import { ChangePasswordFormSchema } from "@/lib/definitions";
import { db } from "@/lib/initDb";
import AppError from "@/lib/server/utils/appError";
import catchAsync from "@/lib/server/utils/catchAsync";
import { NextRequest, NextResponse } from "next/server";
import { User } from "../sign-in/route";
import { protect } from "@/middlewares/server/authMiddleware";
import { correctPassword } from "@/lib/server/utils/authUtils";
import bcrypt from "bcryptjs";

export const PATCH = catchAsync(async (req: NextRequest) => {
    protect(req);
    const currentUser = JSON.parse(req.headers.get('user')!) as User;
    const data = await req.json();
    const validatedData = ChangePasswordFormSchema.safeParse(data);
    if (!validatedData.success) {
        throw new AppError(validatedData.error.issues[0].message, 400);
    }
    const { currentPassword, newPassword } = validatedData.data;

    // Check if the current password is correct
    const stmt = db.prepare("SELECT id,username, email, password, role, active, emailVerified FROM users WHERE id = ?");
    const user = stmt.get(currentUser.id) as User;

    if (!user) {
        throw new AppError("No user found", 404);
    }

    const isValid = await correctPassword(currentPassword, user.password);
    if (!isValid) {
        throw new AppError('Current password is incorrect', 401);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    // Update the user's password in the database
    const updatePassword = db.prepare(`UPDATE users SET password = ? WHERE id = ?`);
    updatePassword.run(hashedPassword, currentUser.id);

    return NextResponse.json({
        status: 'success',
        message: 'Change password successfully',
    }, { status: 200 })
});
import { parseJsonBody } from "@/lib/server/helper/parseJsonBody";
import catchAsync from "@/lib/server/utils/catchAsync";
import { NextRequest, NextResponse } from "next/server";
import AppError from "@/lib/server/utils/appError";
import { ResetPasswordFormSchema } from "@/lib/definitions";
import { hashedToken } from "@/lib/server/utils/authUtils";
import { db } from "@/lib/initDb";
import { User } from "@/app/api/auth/sign-in/route";
import bcrypt from "bcryptjs";


export const PATCH = catchAsync(async (req: NextRequest) => {
    const data = await parseJsonBody(req);

    // check if reset password is provided
    const resetToken = data.resetToken
    if (!resetToken) {
        throw new AppError("Reset token not provided", 400);
    }

    // validate the reset password form data  using zod schema
    const validateData = ResetPasswordFormSchema.safeParse(data);
    if (!validateData.success) {
        throw new AppError(validateData.error.issues[0].message, 400);
    }

    // check if current password and new password are the same
    const { currentPassword, newPassword } = validateData.data;
    if (currentPassword == newPassword) {
        throw new AppError("Current password and new password cannot be the same", 400);
    }

    // check if reset password token is valid
    const hashedResetToken = hashedToken(resetToken);
    const user = db.prepare(`
        SELECT * FROM users WHERE passwordResetToken = ?
    `).get(hashedResetToken) as User;

    if (!user) {
        throw new AppError("Invalid reset password token", 401);
    }

    // hash the new password
    const newHashedPassword = await bcrypt.hash(newPassword, 12);
    const currentDate = new Date().toISOString().slice(0, 10); // Get current date in "YYYY-MM-DD"
    const oldPassword = user.password;

    // update the user's password in the database
    const updatePassword = db.prepare(`
        UPDATE users 
        SET password =?, 
            passwordResetToken = NULL, 
            passwordResetExpiresAt = NULL, 
            passwordResetRequest = ?,
            oldPassword = ?,
            passwordChangedAt=?
        WHERE id =?
    `);
    const result = updatePassword.run(newHashedPassword, 0, currentDate, oldPassword, user.id);

    if (result.changes === 0) {
        throw new AppError("Failed to update password for the user", 400);
    }
    // perform the reset password logic
    return NextResponse.json({
        status: "success",
        message: "Reset password successfully",
        data,
        user,
        currentDate,
        oldPassword,
        newHashedPassword
    })
});
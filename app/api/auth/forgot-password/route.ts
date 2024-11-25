import { ForgotPasswordFormSchema } from "@/lib/definitions";
import { db } from "@/lib/initDb";
import AppError from "@/lib/server/utils/appError";
import catchAsync from "@/lib/server/utils/catchAsync";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/app/api/auth/sign-in/route";
import { createVerificationToken } from "@/lib/server/utils/authUtils";

export const POST = catchAsync(async (req: NextRequest) => {
    const data = await req.json();

    const validateData = ForgotPasswordFormSchema.safeParse(data);
    if (!validateData.success) {
        throw new AppError(validateData.error.issues[0].message, 400)
    }

    const { email } = validateData.data;
    const stmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
    const user = stmt.get(email) as User;

    if (!user) {
        throw new AppError("No user found with this email address", 404);
    };

    const { token, hashedToken } = createVerificationToken();
    const expiredDate = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes from now
    const formattedDate = expiredDate.toISOString().replace('T', ' ').slice(0, 19);
    return NextResponse.json({
        status: 'success',
        message: "Successfully sent reset password to email.",
        formattedDate,
        token,
        hashedToken,
        userId: user.id,
        username: user.username,
        email: user.email,
    }, { status: 200 })
})
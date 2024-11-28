import { ForgotPasswordFormSchema } from "@/lib/definitions";
import { db } from "@/lib/initDb";
import AppError from "@/lib/server/utils/appError";
import catchAsync from "@/lib/server/utils/catchAsync";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/app/api/auth/sign-in/route";
import { createVerificationToken } from "@/lib/server/utils/authUtils";
import { sendMail } from "@/lib/server/services/EmailService";
import jwt from "jsonwebtoken";

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

    // check if the user request reset many times
    const userRequestTime = user.passwordResetRequest as number;
    const currentDate = new Date().toISOString().slice(0, 10); // Get current date in "YYYY-MM-DD"
    if (userRequestTime >= 3) {
        if (currentDate == user.passwordResetRequestDate) {
            throw new AppError("You've exceeded the allowed number of password reset requests. please try again in 24 hours", 400);
        }
    }

    const { token, hashedToken } = createVerificationToken();
    const expiredDate = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes from now
    const formattedExpiredDate = expiredDate.toISOString().replace('T', ' ').slice(0, 19);
    const resetToken = jwt.sign({
        email,
        passwordResetToken: token
    },
        process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN || '10min'
    })

    const updateResetToken = db.prepare(`
        UPDATE users SET 
            passwordResetToken = ?, 
            passwordResetExpiresAt = ? , 
            passwordResetRequest = ? ,
            passwordResetRequestDate = ? WHERE id =?`);
    const result = updateResetToken.run(hashedToken, formattedExpiredDate, userRequestTime + 1, currentDate, user.id);
    if (result.changes === 0) {
        throw new AppError('Failed to update reset token for the user.', 400);
    }
    const host = req.headers.get('host') as string; // e.g., 'localhost:3000' or 'example.com'
    const protocol = req.headers.get('x-forwarded-proto') || req.nextUrl.protocol; // Ensure HTTPS in production
    const domain = `${protocol}://${host}`;
    const url = `${domain || process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    const dataSend =
    {
        "link": url,
        "expiredTime": "10 minutes"
    }
    await sendMail(email, 5, dataSend)

    return NextResponse.json({
        status: 'success',
        message: "Successfully sent reset password to email.",
        resetToken
    }, { status: 200 })
})
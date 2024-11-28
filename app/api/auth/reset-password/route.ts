import { parseJsonBody } from "@/lib/server/helper/parseJsonBody";
import catchAsync from "@/lib/server/utils/catchAsync";
import { NextRequest, NextResponse } from "next/server";
import AppError from "@/lib/server/utils/appError";
import { ResetPasswordFormSchema } from "@/lib/definitions";
import { createSendToken, hashedToken, uncodedJwtToken } from "@/lib/server/utils/authUtils";
import { db } from "@/lib/initDb";
import { User } from "@/app/api/auth/sign-in/route";
import bcrypt from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";


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

    const { newPassword } = validateData.data;

    // uncoded Jwt Token
    const decoded = uncodedJwtToken(resetToken) as JwtPayload;

    // hashed Token
    // check if reset password token is valid
    const hashedResetToken = hashedToken(decoded.passwordResetToken);
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
    const result = updatePassword.run(newHashedPassword, 0, oldPassword, currentDate, user.id);

    if (result.changes === 0) {
        throw new AppError("Failed to update password for the user", 400);
    }

    // sign cookies 
    return createSendToken(user, 200, req);
});
export const GET = catchAsync(async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    // check if token no provided
    if (!token) {
        throw new AppError("Token are not provided", 400);
    }

    // uncoded Jwt Token
    const decoded = uncodedJwtToken(token) as JwtPayload;

    // hashed Verify Token
    const hashedVerifyToken = hashedToken(decoded.passwordResetToken);

    const stmt = db.prepare(` SELECT * FROM users WHERE passwordResetToken = ? `).get(hashedVerifyToken) as User;
    if (!stmt || !decoded) {
        throw new AppError("Token is invalid or has expired.", 404);
    }

    if (stmt.email !== decoded.email) {
        throw new AppError("Token does not match the user's email", 401);
    }

    return NextResponse.json({
        status: "success",
        message: "Reset password token is valid",
        token,
        stmt
    })
})
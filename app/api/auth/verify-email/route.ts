import AppError from "@/lib/server/utils/appError";
import catchAsync from "@/lib/server/utils/catchAsync";
import { NextRequest, NextResponse } from "next/server";
import { JwtPayload } from "jsonwebtoken";
import { db } from "@/lib/initDb";
import { hashedToken, uncodedJwtToken } from "@/lib/server/utils/authUtils";
import { User } from "@/app/api/auth/sign-in/route";

export const POST = catchAsync(async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    // check if token no provided
    if (!token) {
        throw new AppError("Token are not provided", 400);
    }

    // uncoded Jwt Token
    const decoded = uncodedJwtToken(token) as JwtPayload;

    // hashed Verify Token
    const hashedVerifyToken = hashedToken(decoded.emailVerificationToken);

    const stmt = db.prepare(` SELECT * FROM users WHERE emailVerificationToken = ? `).get(hashedVerifyToken) as User;
    if (!stmt || !decoded) {
        throw new AppError("Token is invalid or has expired.", 404);
    }

    if (stmt.email !== decoded.email || stmt.username !== decoded.username) {
        throw new AppError("Token does not match the user's email or username", 401);
    }

    // Update database
    const updateStmt = db.prepare(`
        UPDATE users SET 
            emailVerificationToken = NULL,
            emailVerifiedExpiresAt = NULL,
            emailVerifiedRequestDate = NULL,
            emailVerifiedRequest = ? ,
            emailVerified = ? WHERE email = ?`);
    updateStmt.run(0, 'true', stmt.email);

    return NextResponse.json({
        status: 'success',
        message: 'Verified email successfully',
    })
})


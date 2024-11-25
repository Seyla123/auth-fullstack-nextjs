import AppError from "@/lib/server/utils/appError";
import catchAsync from "@/lib/server/utils/catchAsync";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { db } from "@/lib/initDb";
import { hashedToken } from "@/lib/server/utils/authUtils";
import { User } from "../sign-in/route";

export const POST = catchAsync(async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
        throw new AppError("Token are not provided", 400);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const hashedVerifyToken = hashedToken(decoded.emailVerificationToken);

    const stmt = db.prepare(` SELECT * FROM users WHERE emailVerificationToken = ? `).get(hashedVerifyToken) as User;
    if (!stmt) {
        throw new AppError("Token is invalid or has expired.", 404);
    }

    if (stmt.email !== decoded.email || stmt.username !== decoded.username) {
        throw new AppError("Token does not match the user's email or username", 401);
    }

    

    return NextResponse.json({
        status: 'success',
        message: 'Verified email successfully',
        stmt,
        decoded,
        token
    })
})
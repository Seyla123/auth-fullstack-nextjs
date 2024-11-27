import { User } from "@/app/api/auth/sign-in/route";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';
import AppError from "./appError";
import { db } from "@/lib/initDb";
import bcrypt from "bcryptjs";
export type invitedUser = {
    id: number | string;
    email: string;
    role: string;
    inviteToken: string;
    expiredAt: string;
    status: 'pending' | 'accepted' | 'expired';
    createdAt: string;
    invitedByEmail?: string;
    invitedByUsername?: string;
    invitedBy?: number | string;
}

export const correctPassword = async (candidatePassword: string, hash: string) => {
    return await bcrypt.compare(candidatePassword, hash);
};
export const signToken = (id: string | number): string =>
    jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

export const createSendToken = async (
    user: User,
    statusCode: number,
    req: NextRequest,
) => {
    try {
        const token = signToken(user.id);

        const isProduction = process.env.NODE_ENV === 'production';
        const cookieStore = await cookies();
        cookieStore.set('jwt', token,
            {
                httpOnly: true,
                secure: isProduction ? req.headers.get('x-forwarded-proto') === 'https' : false,
                sameSite: 'strict',
                maxAge: Number(process.env.JWT_COOKIE_EXPIRES_IN) * 1000
            }
        );

        return NextResponse.json({
            success: true,
            token,
            data: {
                id: user.id,
                username: user.username,
                role: user.role,
                emailVerified: user.emailVerified,
                email: user.email,
            },
            message: "User signed in successfully",
        }, { status: statusCode });
    } catch (error) {
        throw new Error(error as string);
    }
};

export const createVerificationToken = () => {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    return { token, hashedToken };
}
export const hashedToken = (token: string) => {
    return crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
}
export const verifyInvite = async (token: string) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const invitedUser = db.prepare('SELECT * FROM invites WHERE inviteToken = ?').get(hashedToken) as invitedUser;
    if (!invitedUser) {
        throw new AppError("Invalid Token", 404);
    }

    // SQLite database has default datetime , so it will be wrong with our current datetime
    //we have to use the default datetime from the database
    const expiredAt = new Date(invitedUser.expiredAt);
    const dateNow = new Date(Date.now())
    const formattedDateNow = dateNow.toISOString().replace('T', ' ').slice(0, 19);

    // Check if expiredAt is a valid date
    if (isNaN(expiredAt.getTime())) {
        throw new AppError('Invalid expiredAt date', 400);
    }

    // Compare the dates
    if (new Date(formattedDateNow) > expiredAt) {
        throw new AppError('Invite token has expired', 401);
    }

    if (invitedUser.status == 'expired') throw new AppError('Invite token has expired', 401);

    if (invitedUser.status == 'accepted') throw new AppError('Invite token has already been used', 401);

    return invitedUser;
};

export const uncodedJwtToken = (token: string) => {
    let decoded: JwtPayload;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        return decoded;
    } catch (err) {

        // Handle specific JWT errors
        if ((err as Error).name === "TokenExpiredError") {
            throw new AppError("Token has expired. Please request a new verification email.", 401);
        }
        if ((err as Error).name === "JsonWebTokenError") {
            throw new AppError("Invalid token format. Please verify the token and try again.", 400);
        }
        // Generic fallback for other JWT errors
        throw new AppError("This token is invalid", 500);
    }

}


import { User } from "@/app/api/auth/sign-in/route";
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';
import AppError from "./appError";
import { db } from "@/lib/initDb";
export type invitedUser = {
    id: number | string;
    email: string;
    role: string;
    inviteToken: string;
    expiredAt: string;
    status: string;
    createdAt: string;
    invitedByEmail?: string;
    invitedByUsername?: string;
    invitedBy?: number | string;
}
const signToken = (id: string | number): string =>
    jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

const createSendToken = async (
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

const createVerificationToken = () => {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    return { token, hashedToken };
}

export const verifyInvite = async (token: string) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const invitedUser = db.prepare('SELECT * FROM invites WHERE inviteToken = ?').get(hashedToken) as invitedUser;
    if (!invitedUser) {
        throw new AppError("User not found", 404);
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
export { signToken, createSendToken, createVerificationToken };


import { User } from "@/app/api/auth/sign-in/route";
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from "next/server";

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
                name: user.name,
                email: user.email,
            },
            message: "User signed in successfully",
        }, { status: statusCode });
    } catch (error) {
        throw new Error(error as string);
    }
};

export { signToken, createSendToken };


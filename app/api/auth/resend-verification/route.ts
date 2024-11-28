import AppError from "@/lib/server/utils/appError";
import catchAsync from "@/lib/server/utils/catchAsync";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/app/api/auth/sign-in/route";
import { db } from "@/lib/initDb";
import { sendMail } from "@/lib/server/services/EmailService";
import { createVerificationToken } from "@/lib/server/utils/authUtils";
import jwt from "jsonwebtoken";
import { protect } from "@/middlewares/server/authMiddleware";


export const POST = catchAsync(async (req: NextRequest) => {
    protect(req);
    const currentUser = JSON.parse(req.headers.get('user')!);

    const email = currentUser.email;
    // check if user exists
    const user = db.prepare(`
        SELECT * FROM users WHERE email = ?
        `).get(email) as User;

    if (!user) {
        throw new AppError("No user found with this email address", 404);
    }
    if (user.emailVerified == 'true') {
        throw new AppError("Email is already verified", 400);
    }

    if (user.active !== 'true') {
        throw new AppError("Your account is currently deactivated. Please reach out to support.", 401);
    }

    const userRequestTime = user.emailVerifiedRequest as number;
    const currentDate = new Date().toISOString().slice(0, 10); // Get current date in "YYYY-MM-DD"
    if (userRequestTime >= 3) {
        if (currentDate == user.emailVerifiedRequestDate) {
            throw new AppError("You've exceeded the allowed number of verification email requests. please try again in 24 hours", 400);
        }
    }

    const { token, hashedToken } = createVerificationToken();
    const username = user.username;
    const verifyToken = jwt.sign({
        email,
        username,
        emailVerificationToken: token
    },
        process.env.JWT_SECRET as string, {
        expiresIn: process.env.EMAIL_VERIFICATION_TOKEN_EXPIRES_IN || '15min'
    })
    const expiredDate = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes from now
    const formattedExpiredDate = expiredDate.toISOString().replace('T', ' ').slice(0, 19);
    // Insert the user into the database
    const stmt = db.prepare(`
      UPDATE users SET  
        emailVerificationToken = ?, 
        emailVerifiedExpiresAt = ?,
        emailVerifiedRequestDate=?,
        emailVerifiedRequest=?
        WHERE email = ?
      `);
    stmt.run(hashedToken, formattedExpiredDate, currentDate, userRequestTime + 1, email);

    const url = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/verify-email?token=${verifyToken}`;
    const dataSend =
    {
        "verify_link": url,
        "username": username
    }

    //send email verification token
    await sendMail(email, 1, dataSend)
    return NextResponse.json({
        status: "success",
        message: "Resent Verification Successfully",
        formattedExpiredDate,
        currentDate,


    }, { status: 200 })
})
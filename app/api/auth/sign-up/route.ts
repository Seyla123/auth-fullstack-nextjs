"use server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/initDb";
import { SignupFormSchema } from "@/lib/definitions";
import bcrypt from "bcryptjs";
import catchAsync from "@/lib/server/utils/catchAsync";
import AppError from "@/lib/server/utils/appError";
import { createVerificationToken } from "@/lib/server/utils/authUtils";
import jwt from "jsonwebtoken";
import { sendMail } from "@/lib/server/services/EmailService";

export const POST = catchAsync(async (req: NextRequest) => {
  // Read the request body
  const data = await req.json();

  // Validate the request body and extract the data
  const validatedData = SignupFormSchema.safeParse(data);
  if (!validatedData.success) {
    throw new AppError(validatedData.error.issues[0].message, 400);
  }

  // Extract the validated data
  const { username, email, password } = validatedData.data;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);
  const { token, hashedToken } = createVerificationToken();

  const verifyToken = jwt.sign({
    email,
    username,
    emailVerificationToken: token
  },
    process.env.JWT_SECRET as string, {
    expiresIn: process.env.EMAIL_VERIFICATION_TOKEN_EXPIRES_IN || '15min'
  })

  try {
    const expiredDate = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes from now
    const formattedExpiredDate = expiredDate.toISOString().replace('T', ' ').slice(0, 19);
    // Insert the user into the database
    const stmt = db.prepare(`
      INSERT INTO users 
        (username, email, password, emailVerificationToken, emailVerifiedExpiresAt) 
        VALUES (?, ?, ?, ?,?)
      `);
    stmt.run(username, email, hashedPassword, hashedToken, formattedExpiredDate);

    // Get the created user data
    const user = db.prepare("SELECT * FROM users WHERE email = ? ");
    const createdUser = user.get(email);

    const url = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/verify-email?token=${verifyToken}`;
    const data =
    {
      "verify_link": url,
      "username": username
    }

    //send email verification token
    await sendMail(email, 1, data)
    // Return the newly created user
    return NextResponse.json(
      { message: "User created successfully", data: createdUser, token: hashedToken, jwt: verifyToken },
      { status: 201 }
    );
  } catch (error) {
    if ((error as Error).message.includes("UNIQUE constraint failed")) {
      if ((error as Error).message.includes("users.email")) {
        throw new AppError("Email already exists. Please use a different email.", 400);
      }
      if ((error as Error).message.includes("users.username")) {
        throw new AppError("Username already exists. Please use a different username.", 400);
      }
    }
    // Rethrow other errors
    throw error;
  }
});

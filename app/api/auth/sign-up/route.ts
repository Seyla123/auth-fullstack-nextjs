"use server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/initDb";
import { SignupFormSchema } from "@/lib/definitions";
import bcrypt from "bcryptjs";
import catchAsync from "@/lib/server/utils/catchAsync";
import AppError from "@/lib/server/utils/appError";

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

  try {
    // Insert the user into the database
    const stmt = db.prepare(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
    );
    stmt.run(username, email, hashedPassword);

    // Get the created user data
    const user = db.prepare("SELECT * FROM users WHERE email = ? ");
    const createdUser = user.get(email);

    // Return the newly created user
    return NextResponse.json(
      { message: "User created successfully", data: createdUser },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message.includes("UNIQUE constraint failed")) {
      if (error.message.includes("users.email")) {
        throw new AppError("Email already exists. Please use a different email.", 400);
      }
      if (error.message.includes("users.username")) {
        throw new AppError("Username already exists. Please use a different username.", 400);
      }
    }
    // Rethrow other errors
    throw new error;
  }
});

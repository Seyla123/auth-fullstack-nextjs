"use server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/initDb";
import { SignupFormSchema } from "@/lib/definitions";
import bcrypt from "bcryptjs";


export async function POST(req: NextRequest) {
  try {

    // read the request body
    const data = await req.json();

    // validate the request body and extract the data
    const validatedData = SignupFormSchema.safeParse(data)
    if (!validatedData.success) {

      // Respond with validation messages
      const firstIssue = validatedData.error.issues[0];
      return NextResponse.json(
        { message: firstIssue.message },
        { status: 400 }
      );
    }
    // extract the validated data
    const { username, email, password } = validatedData.data;

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // insert the user into the database
    const stmt = db.prepare(
      "INSERT INTO users (username , email, password) VALUES (?, ?, ?)"
    );
    stmt.run(username, email, hashedPassword);

    // get the created data user
    const user = db.prepare("SELECT * FROM users WHERE email = ? ");
    const users = user.get(email);

    // return the newly created user and all users
    return NextResponse.json(
      { message: "Data received successfully", data: users },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Handle SQLite-specific errors (e.g., constraint violations)
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) {
      return NextResponse.json(
        { message: "A user with this email already exists" },
        { status: 400 } // Bad Request
      );
    }

    // Default error response for unexpected errors
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "An error occurred while creating the user" },
      { status: 500 } // Internal Server Error
    );
  }
}

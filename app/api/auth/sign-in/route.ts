"use server";
import { db } from "@/lib/initDb";
import { z } from "zod";
import { SignupFormSchema } from "@/lib/definitions";
import bcrypt from "bcryptjs";
import { createSendToken } from "@/lib/server/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";

const correctPassword = async (candidatePassword: string, hash: string) => {
    return await bcrypt.compare(candidatePassword, hash);
};

export type User = {
    id: number;
    name: string;
    email: string;
    password: string;
};

export async function POST(req: NextRequest) {
    try {
        // Parse and validate the incoming data
        const data = await req.json(); // Use .json() to parse the request body
        const validatedData = SignupFormSchema.parse(data); // Zod validation

        const { email, password } = validatedData;

        // Query database to find the user
        const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
        const user = stmt.get(email) as User;

        if (!user) throw new Error("User not found");

        // Verify the password
        const isValid = await correctPassword(password, user.password);
        if (!isValid) throw new Error("Password is not correct");

        // Send the token and user data
        return createSendToken(user, 200, req);

    } catch (error) {
        // Handle validation error
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.issues[0].message }, { status: 400 });
        }

        // Handle specific error for "user not found"
        if (error.message === "User not found") {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Handle incorrect password error
        if (error.message === "Password is not correct") {
            return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
        }

        // Handle other unexpected errors
        console.error("Error: ", error);
        return NextResponse.json({
            message: error instanceof Error ? error.message : "An unexpected error occurred",
        }, { status: 500 });
    }
}

"use server";
import { db } from "@/lib/initDb";
import { z } from "zod";
import { SigninFormSchema } from "@/lib/definitions";
import bcrypt from "bcryptjs";
import { createSendToken } from "@/lib/server/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";

const correctPassword = async (candidatePassword: string, hash: string) => {
    return await bcrypt.compare(candidatePassword, hash);
};

export type User = {
    id: number | string;
    username: string;
    email: string;
    role: string;
    password: string;
    active: boolean;
    emailVerified: boolean;
};

export async function POST(req: NextRequest) {
    try {
        // Parse and validate the incoming data
        const data = await req.json(); // Use .json() to parse the request body
        const validatedData = SigninFormSchema.safeParse(data); // Zod validation

        if (!validatedData.success) {

            // Respond with validation messages
            const firstIssue = validatedData.error.issues[0];
            return NextResponse.json(
              { message: firstIssue.message },
              { status: 400 }
            );
          }
        const { email, password } = validatedData.data;

        // Query database to find the user
        const stmt = db.prepare("SELECT id,username, email, password, role, active, emailVerified FROM users WHERE email = ?");
        const user = stmt.get(email) as User;

        if (!user) {
            return NextResponse.json({
                status: "error",
                message: "No user found with this email address",
            }, { status: 401 })
        };

        // Verify the password
        const isValid = await correctPassword(password, user.password);
        if (!isValid) {
            return NextResponse.json({
                status: "error",
                message: "Password is incorrect",
            }, { status: 401 })
        };

        // Send the token and user data
        return createSendToken(user, 200, req);

    } catch (error: unknown) {
        // Handle validation error
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.issues[0].message }, { status: 400 });
        }

        return NextResponse.json({
            message: error instanceof Error ? error.message : "An unexpected error occurred",
        }, { status: 500 });
    }
}

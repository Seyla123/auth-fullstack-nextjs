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
        const validatedData = SigninFormSchema.parse(data); // Zod validation

        const { email, password } = validatedData;

        // Query database to find the user
        const stmt = db.prepare("SELECT id,username, email, password, role, active, emailVerified FROM users WHERE email = ?");
        const user = stmt.get(email) as User;

        if (!user) throw new Error("User not found");

        // Verify the password
        const isValid = await correctPassword(password, user.password);
        if (!isValid) throw new Error("Password is not correct");

        // Send the token and user data
        return createSendToken(user, 200, req);

    } catch (error: any) {
        // Handle validation error
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.issues[0].message }, { status: 400 });
        }

        return NextResponse.json({
            message: error instanceof Error ? error.message : "An unexpected error occurred",
        }, { status: 500 });
    }
}

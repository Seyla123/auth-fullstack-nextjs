'use server'
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/initDb";
import { z } from 'zod';
import { SignupFormSchema } from "@/lib/definitions";
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

const correctPassword = async (candidatePassword: string, hash: string) => {
    return await bcrypt.compare(candidatePassword, hash);
}
export type User = {
    id: number;
    name: string;
    email: string;
    password: string;
}
export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const validatedData = SignupFormSchema.parse(data);
        const { email, password } = validatedData;

        const stmt = db.prepare("SELECT * FROM users WHERE email = ? ")
        const user = stmt.get(email) as User
        if (!user) throw new Error('User not found')
        const isValid = await correctPassword(password, user.password)
        console.log('this user : ', user);
        console.log('this input : ', password);
        if (!isValid) throw new Error('Password is not correct')

        const getUsers = db.prepare(`
            SELECT * FROM users
          `);
        const users = getUsers.all();
        return NextResponse.json({ message: 'Data received successfully', data: users }, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            console.error('SQLite Error:', error.message);
            if (error instanceof z.ZodError) {
                return NextResponse.json({ errors: error.issues[0].message }, { status: 400 });
            }
            // Handle SQLite-specific errors (e.g., constraint violations)
            if (error.message.includes('UNIQUE constraint failed')) {
                return NextResponse.json(
                    { message: "A user with this email already exists" },
                    { status: 400 } // Bad Request
                );
            }
        }
        // Default error response for unexpected errors
        return NextResponse.json(
            { message: (error as unknown as { message: string }).message || "An error occurred while creating the user" },
            { status: 500 } // Internal Server Error
        );
    }
}

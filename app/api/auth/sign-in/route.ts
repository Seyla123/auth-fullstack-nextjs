'use server'
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/initDb";
import { z } from 'zod';
import { SignupFormSchema } from "@/lib/definitions";
import crypto from 'node:crypto';
export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const validatedData = SignupFormSchema.parse(data);
        const { name, email, password } = validatedData;
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const stmt = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
        stmt.run(name, email, hashedPassword);
        const getUsers = db.prepare(`
            SELECT * FROM users
          `);
        const users = getUsers.all();
        return NextResponse.json({ message: 'Data received successfully', data: users }, { status: 201 });
    } catch (error) {
        // Type the error as an instance of Error
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
            { message: "An error occurred while creating the user" },
            { status: 500 } // Internal Server Error
        );
    }
}

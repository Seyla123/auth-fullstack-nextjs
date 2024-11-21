"use server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/initDb";

export async function GET() {
    try {
        // insert the user into the database
        const stmt = db.prepare("SELECT name, email from users ");
        const users = stmt.all();

        // return the newly created user and all users
        return NextResponse.json(
            {
                status: "success",
                message: "Fetching successfully",
                total: users.length,
                data: users,

            },
            { status: 200 }
        );
    } catch (error) {
        // Default error response for unexpected errors
        return NextResponse.json(
            { message: error.message || "An error occurred while creating the user" },
            { status: 500 } // Internal Server Error
        );
    }
}


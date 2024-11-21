"use server";
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/initDb";
import { protect } from "@/middlewares/server/authMiddleware";


export async function GET(req: NextRequest) {
    try {
        const response = protect(req);
        if (response) return response;
        // insert the user into the database
        const stmt = db.prepare("SELECT name, email ,id from users ");
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
    } catch (error: any) {
        // Default error response for unexpected errors
        return NextResponse.json(
            { message: error.message || "An error occurred while creating the user" },
            { status: 500 } // Internal Server Error
        );
    }
}


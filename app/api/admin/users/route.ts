"use server";
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/initDb";
import { protect, restrict } from "@/middlewares/server/authMiddleware";


export async function GET(req: NextRequest) {
    try {
        protect(req);
        restrict(req, 'admin')
        // insert the user into the database
        const stmt = db.prepare(`
            SELECT 
                id, 
                username ,
                email ,
                role,
                active, 
                emailVerified, 
                passwordChangedAt,
                passwordResetToken,
                passwordResetExpiresAt,
                passwordResetRequestDate,
                passwordResetRequest,
                emailVerificationToken,
                emailVerifiedRequestDate,
                emailVerifiedRequest,
                emailVerifiedExpiresAt,
                emailVerified  from users 
        `);

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
    } catch (error: unknown) {
        // Default error response for unexpected errors
        return NextResponse.json(
            { message: error instanceof Error ? error.message  : "An error occurred while creating the user" },
            { status: 500 } // Internal Server Error
        );
    }
}


import AppError from "@/lib/server/utils/appError";
import { InviteUserFormSchema } from "@/lib/definitions";
import { db } from "@/lib/initDb";
import { NextRequest, NextResponse } from "next/server";
import catchAsync from "@/lib/server/utils/catchAsync";

// Define your async handler
const inviteUserHandler = async (req: NextRequest) => {
    const data = await req.json();

    // Validate data using InviteUserFormSchema
    const validateData = InviteUserFormSchema.safeParse(data);
    if (!validateData.success) {
        const firstIssue = validateData.error.issues[0];
        throw new AppError(firstIssue.message, 400);  // Throw an AppError if validation fails
    }

    const { email, role } = validateData.data;

    // Insert data into the database
    const stmt = db.prepare(`INSERT INTO users (email, role) VALUES (?, ?)`);
    stmt.run(email, role);

    // Return a successful response
    return NextResponse.json(
        {
            status: 'success',
            message: "User invited successfully",
            data: { email, role }
        },
        { status: 201 }
    );
};

// Wrap your handler with catchAsync
export const POST = catchAsync(inviteUserHandler);
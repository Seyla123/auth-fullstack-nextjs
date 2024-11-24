import AppError from "@/lib/server/utils/appError";
import { InviteUserFormSchema } from "@/lib/definitions";
import { db } from "@/lib/initDb";
import { NextRequest, NextResponse } from "next/server";
import catchAsync from "@/lib/server/utils/catchAsync";


// Wrap your handler with catchAsync
export const POST = catchAsync(async (req: NextRequest) => {
    const data = await req.json();

    // Validate data using InviteUserFormSchema
    const validateData = InviteUserFormSchema.safeParse(data);
    if (!validateData.success) {
        const firstIssue = validateData.error.issues[0];
        throw new AppError(firstIssue.message, 400);  // Throw an AppError if validation fails
    }

    const { email, role } = validateData.data;

    // Insert data into the database
    // const stmt = db.prepare(`INSERT INTO users (email, role) VALUES (?, ?)`);
    // stmt.run(email, role);
    const stmt = db.prepare(`INSERT INTO invites (email, role, inviteToken) VALUES (?, ?,?)`);
    stmt.run(email, role, 'unique-token-valude');

    const allData = db.prepare('SELECT * FROM invites').all();

    // Return a successful response
    return NextResponse.json(
        {
            status: 'success',
            message: "User invited successfully",
            data: { email, role , allData}
        },
        { status: 201 }
    );
});
import AppError from "@/lib/server/utils/appError";
import { InviteUserFormSchema } from "@/lib/definitions";
import { db } from "@/lib/initDb";
import { NextRequest, NextResponse } from "next/server";
import catchAsync from "@/lib/server/utils/catchAsync";
import { createVerificationToken } from "@/lib/server/utils/authUtils";
import { protect, restrict } from "@/middlewares/server/authMiddleware";


// Wrap your handler with catchAsync
export const POST = catchAsync(async (req: NextRequest) => {
    try {
        protect(req);
        restrict(req, 'admin');

        // Read request body and parse JSON data
        const data = await req.json();

        // Validate data using InviteUserFormSchema
        const validateData = InviteUserFormSchema.safeParse(data);
        if (!validateData.success) {
            const firstIssue = validateData.error.issues[0];
            throw new AppError(firstIssue.message, 400);  // Throw an AppError if validation fails
        }

        const { email, role } = validateData.data;

        const { token, hashedToken } = createVerificationToken();
        const expiredDate = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now
        const stmt = db.prepare(`INSERT INTO invites (email, role, inviteToken, expiredAt) VALUES (?, ?,?,?)`);
        stmt.run(email, role, hashedToken, expiredDate.toISOString());

        const allData = db.prepare('SELECT * FROM invites').all();

        // Return a successful response
        return NextResponse.json(
            {
                status: 'success',
                message: "User invited successfully",
                data: { email, role, allData },
                token
            },
            { status: 201 }
        );
    } catch (error) {
        if ((error as Error).message.includes("UNIQUE constraint failed")) {
            if ((error as Error).message.includes("invites.email")) {
                throw new AppError("Email already invited. Please use a different email.", 400);
            }
        }
        // Rethrow other errors
        throw error;
    }
});


export const GET = catchAsync(async () => {
    const allData = db.prepare('SELECT * FROM invites').all();
    return NextResponse.json({ status: 'success', message: "Fetching successfully", data: allData }, { status: 200 });
});


import AppError from "@/lib/server/utils/appError";
import { InviteUserFormSchema } from "@/lib/definitions";
import { db } from "@/lib/initDb";
import { NextRequest, NextResponse } from "next/server";
import catchAsync from "@/lib/server/utils/catchAsync";
import { createVerificationToken, verifyInvite } from "@/lib/server/utils/authUtils";


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
});



export const GET = catchAsync(async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    if (!token) {
        throw new AppError("token not provided", 400);
    }

    const invitedUser = await verifyInvite(token);

    return NextResponse.json({ status: 'success', message: "Verify user invite successfully", data: invitedUser }, { status: 200 });
});


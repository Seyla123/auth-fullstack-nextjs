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
        const currentUserId = req.headers.get('userId');
        // Validate data using InviteUserFormSchema
        const validateData = InviteUserFormSchema.safeParse(data);
        if (!validateData.success) {
            const firstIssue = validateData.error.issues[0];
            throw new AppError(firstIssue.message, 400);  // Throw an AppError if validation fails
        }

        const { email, role } = validateData.data;

        const { token, hashedToken } = createVerificationToken();
        const expiredDate = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now
        const formattedDate = expiredDate.toISOString().replace('T', ' ').slice(0, 19);
        const stmt = db.prepare(`INSERT INTO invites (email, role, inviteToken, expiredAt, invitedBy) VALUES (?, ?,?,?,?)`);
        stmt.run(email, role, hashedToken, formattedDate, Number(currentUserId));

        const allData = db.prepare(`
            SELECT invites.*,users.username as invitedByUsername, users.email as invitedByEmail
            FROM invites
            LEFT JOIN users ON invites.invitedBy = users.id
          `).all();

        // Return a successful response
        return NextResponse.json(
            {
                status: 'success',
                message: "User invited successfully",
                data: { email, role, invitedBy: currentUserId, allData },
                token,
                date: formattedDate
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
    const allData = db.prepare(`
        SELECT invites.*,users.username as invitedByUsername, users.email as invitedByEmail
        FROM invites
        LEFT JOIN users ON invites.invitedBy = users.id
      `).all();
    return NextResponse.json({ status: 'success', message: "Fetching successfully", data: allData }, { status: 200 });
});

export const DELETE = catchAsync(async (req: NextRequest) => {
    try {
        const data = await req.json();

        // Validate input
        if (!data || !data.ids || !Array.isArray(data.ids) || data.ids.length === 0) {
            throw new AppError('Field "ids" is required and must be a non-empty array', 400);
        }

        // Start a transaction
        db.exec('BEGIN TRANSACTION');

        // Dynamically create placeholders for the number of IDs
        const placeholders = data.ids.map(() => '?').join(', ');

        // Execute delete query
        const stmt = db.prepare(`DELETE FROM invites WHERE id IN (${placeholders})`);
        const result = stmt.run(...data.ids);

        // Check if any rows were affected
        if (!result.changes) {
            db.exec('ROLLBACK');
            throw new AppError(`Failed to delete users with IDs ${data.ids.join(', ')}`, 400);
        }

        // Commit the transaction
        db.exec('COMMIT');

        // Respond with success
        return NextResponse.json({
            status: 'success',
            message: `Users with IDs ${data.ids.join(', ')} deleted successfully`,
            data
        }, { status: 200 });
    } catch (error) {
        // Ensure rollback on error
        db.exec('ROLLBACK');
        console.error(error);
        throw new AppError((error as Error).message || 'Failed to delete users', 400);
    }
});


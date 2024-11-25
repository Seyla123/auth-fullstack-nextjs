import { RegisterUserByInviteFormSchema } from "@/lib/definitions";
import { db } from "@/lib/initDb";
import AppError from "@/lib/server/utils/appError";
import { verifyInvite } from "@/lib/server/utils/authUtils";
import catchAsync from "@/lib/server/utils/catchAsync";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = catchAsync(async (req: NextRequest) => {
    try {
        const data = await req.json();
        const inviteToken = await verifyInvite(data.token);

        const validatedData = RegisterUserByInviteFormSchema.safeParse(data);

        if (!validatedData.success) {
            throw new AppError(validatedData.error.issues[0].message, 400)
        }

        const { username, password } = validatedData.data;
        // Start a transaction
        db.exec('BEGIN TRANSACTION');
        const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(inviteToken.email);
        if (user) {
            throw new AppError('User already exists with this email address', 409);
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const stmt = db.prepare(`INSERT INTO users (username, email, password, role, emailVerified) VALUES (?,?,?,?,?)`);
        const result = stmt.run(username, inviteToken.email, hashedPassword, inviteToken.role, 'true');
        if (!(result.changes > 0)) {
            db.exec('ROLLBACK');
            throw new AppError('Failed to insert user into database', 500);
        }

        const updateInvite = db.prepare('UPDATE invites SET status = ? WHERE id = ?');
        const resultUpdateInvite = updateInvite.run('accepted', inviteToken.id);
        if (!(resultUpdateInvite.changes > 0)) {
            db.exec('ROLLBACK');
            throw new AppError('Failed to update invite status', 500);
        }

        db.exec('COMMIT');

        return NextResponse.json({
            status: 'success',
            message: 'Data received successfully',
            data: {
                username,
                email: inviteToken.email,
                role: inviteToken.role
            }
        }, { status: 200, })
    } catch (error) {
        if ((error as Error).message.includes("UNIQUE constraint failed")) {
            if ((error as Error).message.includes("users.username")) {
                throw new AppError("Username already exists. Please use a different username.", 400);
            }
        }
        if (process.env.NODE_ENV === 'production') {
            console.log(error);
            throw new AppError('Fail to register user', 400);
        }
        throw new AppError((error as Error).message || 'Fail to register user', 400);
    }
});
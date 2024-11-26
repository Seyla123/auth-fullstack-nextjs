import { db } from "@/lib/initDb";
import AppError from "@/lib/server/utils/appError";
import { verifyInvite } from "@/lib/server/utils/authUtils";
import catchAsync from "@/lib/server/utils/catchAsync";
import { NextRequest, NextResponse } from "next/server";

export const GET = catchAsync(
    async (req: NextRequest, { params }: { params: { slug: string } }) => {
        const token = params.slug;
        if (!token) {
            throw new AppError("token not provided", 400);
        }

        const invitedUser = await verifyInvite(token);

        return NextResponse.json(
            {
                status: "success",
                message: "Verify user invite successfully",
                data: invitedUser,
            },
            { status: 200 }
        );
    }
);
export const DELETE = catchAsync(
    async (req: NextRequest, { params }: { params: { slug: string } }) => {
        const id = params.slug;
        if (!id) {
            throw new AppError("invite id not provided", 400);
        }
        const invitedUser = db
            .prepare(`SELECT * FROM invites WHERE id = ?`)
            .get(id);
        if (!invitedUser) {
            throw new AppError("Invite user not found", 404);
        }
        const stmt = db.prepare("DELETE FROM invites WHERE id =?");
        const result = stmt.run(id);
        if (!(result.changes > 0)) {
            throw new AppError("Failed to delete invites user into database", 400);
        }

        return NextResponse.json(
            {
                status: "success",
                message: `delete user invite ${id} successfully`,
            },
            { status: 200 }
        );
    }
);

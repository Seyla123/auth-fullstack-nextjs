//@typescript-eslint/no-explicit-any
'use server'
import { db } from "@/lib/initDb";
import AppError from "@/lib/server/utils/appError";
import catchAsync from "@/lib/server/utils/catchAsync";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = catchAsync(async (req: NextRequest, { params }: { params: { id: string } }) => {

    const id = params.id;
    const stmt = db.prepare("DELETE FROM users WHERE id = ?");
    const result = stmt.run(id);
    if (!(result.changes > 0)) {
        throw new AppError(`User ID ${id} not found `, 404)
    }
    return NextResponse.json({
        status: "success",
        message: `User ID ${id} deleted successfully`,
    }, { status: 200 });


})

export const GET = catchAsync(async (req: NextRequest, { params }: { params: { id: string } }) => {
    const id = params.id;

    const stmt = db.prepare("SELECT * FROM users WHERE id =?");
    const user = stmt.get(id);

    if (!user) {
        throw new AppError(`User ID ${id} not found`, 404)
    }

    return NextResponse.json({
        status: "success",
        message: "Fetching user successfully",
        data: user,
    }, { status: 200 });
});


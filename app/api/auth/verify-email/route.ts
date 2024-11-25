import { parseJsonBody } from "@/lib/server/helper/parseJsonBody";
import AppError from "@/lib/server/utils/appError";
import catchAsync from "@/lib/server/utils/catchAsync";
import { NextRequest, NextResponse } from "next/server";

export const POST = catchAsync(async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
        throw new AppError("Token are not provided", 400);
    }

    return NextResponse.json({
        status: 'success',
        message: 'Verified email successfully',
        token
    })
})
import AppError from "@/lib/server/utils/appError";
import { verifyInvite } from "@/lib/server/utils/authUtils";
import catchAsync from "@/lib/server/utils/catchAsync";
import { NextRequest, NextResponse } from "next/server";

export const GET = catchAsync(async (req: NextRequest, { params }: { params: { token: string } }) => {
    const token = params.token
    if (!token) {
        throw new AppError("token not provided", 400);
    }

    const invitedUser = await verifyInvite(token);

    return NextResponse.json({ status: 'success', message: "Verify user invite successfully", data: invitedUser }, { status: 200 });
});

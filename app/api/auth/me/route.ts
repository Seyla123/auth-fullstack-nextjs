
import AppError from "@/lib/server/utils/appError";
import catchAsync from "@/lib/server/utils/catchAsync";
import { protect, restrict } from "@/middlewares/server/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
export const GET = catchAsync(async (req: NextRequest) => {
    protect(req);
    restrict(req, ['admin', 'user'])

    const currentUserId = req.headers.get('userId');
    const user = JSON.parse(req.headers.get('user')!);
    if (!currentUserId || !user) throw new AppError('No user id found', 401);

    return NextResponse.json({
        status: 200,
        message: `Hello, user with ID ${currentUserId}!`,
        data: user
    }, { status: 200 })
});
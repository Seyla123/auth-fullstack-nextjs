
import { NextResponse, NextRequest } from "next/server";
import { cookies } from 'next/headers';
import { protect } from "@/middlewares/server/authMiddleware";
import AppError from "@/lib/server/utils/appError";
import catchAsync from "@/lib/server/utils/catchAsync";
export const POST = catchAsync(async (req: NextRequest) => {
    try {
        protect(req);
        const cookieStore = await cookies();
        console.log('this is cookie store : ', cookieStore);
        const isProduction = process.env.NODE_ENV === 'production';

        // cookieStore.delete('jwt');
        cookieStore.set('jwt', 'loggedout',
            {
                httpOnly: true,
                secure: isProduction ? req.headers.get('x-forwarded-proto') === 'https' : false,
                maxAge: 1
            }
        );
        return NextResponse.json({
            status: 'success',
            message: 'User logged out successfully'
        }, { status: 200 });
    } catch (error: unknown) {
        throw new AppError(error instanceof Error ? error.message : 'Failed to logout', 500);
    }
});

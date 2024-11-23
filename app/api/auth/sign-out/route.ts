
import { NextResponse, NextRequest } from "next/server";
import { cookies } from 'next/headers';
import { protect } from "@/middlewares/server/authMiddleware";

export async function POST(req: NextRequest) {
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
        return NextResponse.json({
            status: 'fail',
            message: error instanceof Error ? error.message  : 'Failed to logout'
        }, { status: 500 });
    }
}

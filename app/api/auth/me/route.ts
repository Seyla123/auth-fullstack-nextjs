import { protect, restrict } from "@/middlewares/server/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        protect(req);
        restrict(req, ['admin', 'user'])

        const currentUserId = req.headers.get('userId');
        const user = JSON.parse(req.headers.get('user')!);
        if (!currentUserId || !user) throw new Error('No user id found');

        return NextResponse.json({
            status: 200,
            message: `Hello, user with ID ${currentUserId}!`,
            data: user
        }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({
            status: 'fail',
            message: error.message || 'Fail to fecth current user'
        }, { status: 401 })
    }
}
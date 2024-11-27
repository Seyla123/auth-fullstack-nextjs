import { db } from "@/lib/initDb";
import AppError from "@/lib/server/utils/appError";
import { invitedUser } from "@/lib/server/utils/authUtils";
import catchAsync from "@/lib/server/utils/catchAsync";
import { protect, restrict } from "@/middlewares/server/authMiddleware";
import { NextResponse } from "next/server";

export const POST = catchAsync(async (req: NextRequest, { params }: { params: { slug: string } }) => {
    protect(req);
    restrict(req, "admin");
    const id = params.slug;

    // check if id invited User provided
    if (!id) {
        throw new AppError("invite id not provided", 400);
    }

    // get the current user 
    const currentUserId = JSON.parse(req.headers.get('userId')!);
    // find the invited user with invited id and current user id
    const invitedUser = db.prepare(`
        SELECT * FROM invites WHERE id = ? AND invitedBy = ? 
        `).get(id, currentUserId) as invitedUser;

    if (invitedUser.status == 'accepted') {
        throw new AppError("This invited user has already been registered", 401);
    }
    return NextResponse.json({
        status: "success",
        message: `resent invitation to ${invitedUser.email} successfully`,
    }, { status: 200 })
});
import { db } from "@/lib/initDb";
import { sendMail } from "@/lib/server/services/EmailService";
import AppError from "@/lib/server/utils/appError";
import { createVerificationToken, invitedUser } from "@/lib/server/utils/authUtils";
import catchAsync from "@/lib/server/utils/catchAsync";
import { protect, restrict } from "@/middlewares/server/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

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
    //return with invited user data too
    const invitedUser = db.prepare(`
        SELECT invites.*,users.username as invitedByUsername, users.email as invitedByEmail 
        FROM invites 
        LEFT JOIN users ON invites.invitedBy = users.id
        WHERE invites.id = ? AND invites.invitedBy = ?
        `).get(id, currentUserId) as invitedUser;

    //check if this user has already been registered
    if (invitedUser.status == 'accepted') {
        throw new AppError("This invited user has already been registered", 401);
    }
    //resend invitation to user email
    const { token, hashedToken } = createVerificationToken();
    const expiredDate = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now
    const formattedDate = expiredDate.toISOString().replace('T', ' ').slice(0, 19);

    const stmt = db.prepare(`
        UPDATE invites SET 
            inviteToken = ?, 
            expiredAt = ? WHERE id = ? `);
    stmt.run(hashedToken, formattedDate, id);
    const host = req.headers.get('host') as string; // e.g., 'localhost:3000' or 'example.com'
    const protocol = req.headers.get('x-forwarded-proto') || req.nextUrl.protocol; // Ensure HTTPS in production
    const domain = `${protocol}://${host}`;
    const url = `${domain || process.env.NEXTAUTH_URL || 'http://localhost:3000'}/register-invited-user?token=${token}`;
    const dataSend =
    {
        "invitedLink": url,
        "invitedBy": invitedUser.invitedByEmail
    }
    //send email verification token
    await sendMail(invitedUser.email, 4, dataSend)

    return NextResponse.json({
        status: "success",
        message: `resent invitation to ${invitedUser.email} successfully`,
        invitedUser
    }, { status: 200 })
});
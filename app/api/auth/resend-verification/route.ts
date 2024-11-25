import { ResendVerificationFormSchema } from "@/lib/definitions";
import { parseJsonBody } from "@/lib/server/helper/parseJsonBody";
import AppError from "@/lib/server/utils/appError";
import catchAsync from "@/lib/server/utils/catchAsync";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/app/api/auth/sign-in/route";
import { db } from "@/lib/initDb";


export const POST = catchAsync(async (req: NextRequest) => {
    const data = await parseJsonBody(req);
    // check validation
    const validatedData = ResendVerificationFormSchema.safeParse(data);
    if (!validatedData.success) {
        throw new AppError(validatedData.error.issues[0].message, 400);
    }

    const { email } = validatedData.data;
    const user = db.prepare(`
        SELECT * FROM users WHERE email = ?
        `).get(email) as User;
    if (!user) {
        throw new AppError("No user found with this email address", 404);
    }
    if (user.emailVerified == 'true') {
        throw new AppError("Email is already verified", 400);
    }

    if (user.active !== 'true') {
        throw new AppError("Your account is currently deactivated. Please reach out to support.", 401);
    }

    return NextResponse.json({
        status: "success",
        message: "Resent Verification Successfully"
    }, { status: 200 })
})
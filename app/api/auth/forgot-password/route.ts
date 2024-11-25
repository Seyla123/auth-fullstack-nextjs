import { ForgotPasswordFormSchema } from "@/lib/definitions";
import { db } from "@/lib/initDb";
import AppError from "@/lib/server/utils/appError";
import catchAsync from "@/lib/server/utils/catchAsync";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/app/api/auth/sign-in/route";

export const POST = catchAsync(async (req: NextRequest) => {
    const data = await req.json();

    const validateData = ForgotPasswordFormSchema.safeParse(data);
    if (!validateData.success) {
        throw new AppError(validateData.error.issues[0].message, 400)
    }

    const { email } = validateData.data;
    const stmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
    const user = stmt.get(email) as User;

    if (!user) {
        throw new AppError("No user found with this email address", 404);
    };

    
    return NextResponse.json({
        status: 'success',
        message: "Successfully sent reset password to email."
    }, { status: 200 })
})
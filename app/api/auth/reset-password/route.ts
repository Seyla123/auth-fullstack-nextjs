import { parseJsonBody } from "@/lib/server/helper/parseJsonBody";
import catchAsync from "@/lib/server/utils/catchAsync";
import { NextRequest, NextResponse } from "next/server";
import AppError from "@/lib/server/utils/appError";
import { ResetPasswordFormSchema } from "@/lib/definitions";
import { hashedToken } from "@/lib/server/utils/authUtils";

export const PATCH = catchAsync(async (req: NextRequest) => {
    const data = await parseJsonBody(req);

    // check if reset password is provided
    const resetToken = data.resetToken
    if (!resetToken) {
        throw new AppError("Reset token not provided", 400);
    }

    // validate the reset password form data  using zod schema
    const validateData = ResetPasswordFormSchema.safeParse(data);
    if (!validateData.success) {
        throw new AppError(validateData.error.issues[0].message, 400);
    }

    // check if current password and new password are the same
    const { currentPassword, newPassword } = validateData.data;
    if (currentPassword == newPassword) {
        throw new AppError("Current password and new password cannot be the same", 400);
    }

    const hashedResetToken = hashedToken(resetToken)
    // perform the reset password logic
    return NextResponse.json({
        status: "success",
        message: "Reset password successfully",
        data,
        hashedResetToken
    })
});
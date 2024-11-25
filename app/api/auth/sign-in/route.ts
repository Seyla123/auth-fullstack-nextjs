"use server";
import { db } from "@/lib/initDb";
import { SigninFormSchema } from "@/lib/definitions";
import { correctPassword, createSendToken } from "@/lib/server/utils/authUtils";
import { NextRequest } from "next/server";
import AppError from "@/lib/server/utils/appError";
import catchAsync from "@/lib/server/utils/catchAsync";

export type User = {
    id: number | string;
    username: string;
    email: string;
    role: string;
    password: string;
    active: boolean;
    emailVerified: boolean;
    passwordChangedAt?: string | null;
    passwordResetToken?: string | null;
    passwordResetExpiresAt?: string | null;
    passwordResetRequestDate?: string | null;
    passwordResetRequest?: number | null;
};
export const POST = catchAsync(async (req: NextRequest) => {
    const data = await req.json(); // Use .json() to parse the request body
    const validatedData = SigninFormSchema.safeParse(data); // Zod validation

    if (!validatedData.success) {
        // Respond with validation messages
        throw new AppError(validatedData.error.issues[0].message, 400);
    }
    const { email, password } = validatedData.data;

    // Query database to find the user
    const stmt = db.prepare("SELECT id,username, email, password, role, active, emailVerified FROM users WHERE email = ?");
    const user = stmt.get(email) as User;

    if (!user) {
        throw new AppError("No user found with this email address", 404);
    };

    // Verify the password
    const isValid = await correctPassword(password, user.password);
    if (!isValid) {
        throw new AppError("Password is incorrect", 401);
    };

    // Send the token and user data
    return createSendToken(user, 200, req);
});
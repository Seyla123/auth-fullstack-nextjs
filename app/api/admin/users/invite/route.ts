import { InviteUserFormSchema } from "@/lib/definitions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(res: NextRequest) {
    try {
        const data = await res.json();
        const validateData = InviteUserFormSchema.safeParse(data);
        if (!validateData.success) {
            const firstIssue = validateData.error.issues[0];
            return NextResponse.json(
                { message: firstIssue.message },
                { status: 400 }
            );
        }
        
        const { email, role } = validateData.data;
        return NextResponse.json(
            {
                status: 'success',
                message: "Data received successfully",
                data: {
                    email,
                    role
                }
            },
            { status: 201 }
        );
    } catch (error) {
        // Default error response for unexpected errors
        return NextResponse.json(
            { message: error instanceof Error ? error.message : "An error occurred while creating the user" },
            { status: 500 } // Internal Server Error
        );
    }
}
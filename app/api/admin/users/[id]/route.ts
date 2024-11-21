import { db } from "@/lib/initDb";
import { NextResponse } from "next/server";

// Delete user helper function
const deleteUser = async (email: string): Promise<boolean> => {
    try {
        const stmt = db.prepare("DELETE FROM users WHERE email = ?");
        const result = stmt.run(email);

        // Assuming `result.changes` indicates the number of rows affected
        return result.changes > 0;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Database error while deleting user");
    }
};
export async function DELETE(
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const isDeleted = await deleteUser(id);
        if (isDeleted) {
            return NextResponse.json({
                status: "success",
                message: "User deleted successfully",
            })
        } else {
            return NextResponse.json({
                status: "error",
                message: "User not found",
            })
        }
    } catch (error: any) {
        return NextResponse.json({
            status: "error",
            message: error.message || "Database error while deleting user",
        }, { status: 500 })
    }
}

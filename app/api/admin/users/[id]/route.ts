
import { db } from "@/lib/initDb";
import { NextRequest, NextResponse } from "next/server";

// Delete user helper function
const deleteUser = async (id: string): Promise<boolean> => {
    try {
        const stmt = db.prepare("DELETE FROM users WHERE id = ?");
        const result = stmt.run(id);
        // Assuming `result.changes` indicates the number of rows affected
        return result.changes > 0;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Database error while deleting user");
    }
};
export async function DELETE(
    req: NextRequest, { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const isDeleted = await deleteUser(id);
        if (isDeleted) {
            return NextResponse.json({
                status: "success",
                message: `User ID ${id} deleted successfully`,
            }, { status: 200 });
        } else {
            return NextResponse.json({
                status: "error",
                message: `User ID ${id} not found `,
            }, { status: 404 })
        }
    } catch (error: any) {
        return NextResponse.json({
            status: "error",
            message: error.message || "Database error while deleting user",
        }, { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;

        const stmt = db.prepare("SELECT * FROM users WHERE id =?");
        const user = stmt.get(id);

        if (user) {
            return NextResponse.json({
                status: "success",
                message: "User found",
                data: user,
            }, { status: 200 });
        } else {
            return NextResponse.json({
                status: "error",
                message: "User not found",
            }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({
            status: "error",
            message: error.message || "Database error while deleting user",
        }, { status: 500 });
    }
}

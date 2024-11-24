import { NextRequest, NextResponse } from "next/server";
import AppError from "./appError";

const catchAsync = (fn: (req: NextRequest) => Promise<NextResponse>) => {
    return async (req: NextRequest) => {
        try {
            return await fn(req);  // Execute the async function and return the response
        } catch (err) {
            // Handle AppError or any custom error status
            const statusCode = err instanceof AppError ? err.statusCode : 500;
            const message = err instanceof Error ? err.message : 'Something went wrong!';

            return NextResponse.json({
                status: 'error',
                message,
            }, { status: statusCode });
        }
    };
};
export default catchAsync;
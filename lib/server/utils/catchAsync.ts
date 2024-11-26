import { NextRequest, NextResponse } from "next/server";
import AppError from "@/lib/server/utils/appError";

const catchAsync = (fn: (req: NextRequest, context?: any) => Promise<NextResponse>) => {
  return async (req: NextRequest, context?: any) => {
    try {
      return await fn(req, context); // Execute the async function with the request and context
    } catch (err) {
      // Handle AppError or any custom error status
      const statusCode = err instanceof AppError ? err.statusCode : 500;
      const message = err instanceof Error ? err.message : "Something went wrong!";

      return NextResponse.json(
        {
          status: "error",
          message,
        },
        { status: statusCode }
      );
    }
  };
};

export default catchAsync;

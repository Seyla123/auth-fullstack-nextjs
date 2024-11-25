import { NextRequest } from "next/server";
import AppError from "../utils/appError";

export const parseJsonBody = async (req:NextRequest) => {
    try {
        const data = await req.json();
        if (!data || Object.keys(data).length === 0) {
            throw new AppError('Invalid or missing JSON body', 400);
        }
        return  data ;
    } catch (error) {
        throw new AppError('Invalid or missing data input', 400);
    }
};

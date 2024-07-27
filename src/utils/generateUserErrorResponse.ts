import { Response } from "express";

export const generateUserErrorResponse = (res: Response, message: string, httpCode: number): Response => {
    return res.status(httpCode).json({
        user: undefined,
        msg: message,
    });
}
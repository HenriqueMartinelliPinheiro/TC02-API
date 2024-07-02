import { Response } from "express";

export const generateErrorResponse = (res: Response, message: string, httpCode: number): Response => {
    console.warn(message);
    return res.status(httpCode).json({
        user: undefined,
        msg: message,
    });
}
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "ENV access problem";

export const protectRoute = (req: Request, res: Response, next: NextFunction): any => {
    try {
        const authToken = req.headers.authorization?.split(" ")[1];
        if (!authToken) {
            throw new Error("UNAUTHORIZED: Missing Token")
        } else {
            const decoded = jwt.verify(authToken, jwtSecret);
            console.log(decoded);
        }
    } catch (error: any) {
        res.status(403).json({
            success: false,
            error: {
                message: error.message,
                code: "Unauthorized"
            }
        })   
    }
}
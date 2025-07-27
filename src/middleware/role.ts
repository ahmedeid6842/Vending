import { NextFunction, Request, Response } from "express";

//this middleware to check if user is role authorized or not
export const role = (role: string) => (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role === role) {
        return next();
    } else {
        return res.status(403).send({ message: `your aren't authorized, only ${role} role can perform this action ` })
    }
}


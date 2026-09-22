import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: {userId: string; role: string}}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    const decoded = verifyAccessToken(token);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("userId" in decoded) ||
      !("role" in decoded)
    ) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token",
      });
    }

    req.user = {
      userId: String(decoded.userId),
      role: String(decoded.role),
    };

    next();
  } catch {
    return res.status(401).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }
};
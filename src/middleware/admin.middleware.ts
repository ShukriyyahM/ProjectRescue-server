import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      status: "error",
      message: "Authentication required",
    });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      status: "error",
      message: "Admin access required",
    });
  }

  next();
};
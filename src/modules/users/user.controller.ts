import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { getCurrentUser, updateProfile } from "./user.service";
import { updateProfileSchema } from "./user.validation";

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    const user = await getCurrentUser(userId);

    res.status(200).json({
      status: "success",
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    const data = updateProfileSchema.parse(req.body);

    const user = await updateProfile(userId, data);

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
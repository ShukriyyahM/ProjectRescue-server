import { Response } from "express";
import { logoutSchema } from "./logout.validation";
import { logoutUser } from "./logout.service";

export const logoutController = async (
  req: any,
  res: Response
) => {
  const { refreshToken } = logoutSchema.parse(req.body);

  await logoutUser(refreshToken);

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};
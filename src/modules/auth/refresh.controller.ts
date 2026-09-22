import { Response } from "express";
import { refreshTokenSchema } from "./refresh.validation";
import { refreshAccessToken } from "./refresh.service";

export const refreshTokenController = async (req: any, res: Response) => {
  const { refreshToken } = refreshTokenSchema.parse(req.body);

  const tokens = await refreshAccessToken(refreshToken);

  res.status(200).json({
    status: "success",
    message: "Access token refreshed successfully",
    data: tokens,
  });
};
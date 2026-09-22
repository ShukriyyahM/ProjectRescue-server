import { Request, Response } from "express";
import {forgotPasswordSchema, resetPasswordSchema} from "./forgot-password.validation";
import {requestPasswordReset, resetPassword} from "./forgot-password.service";

export const forgotPasswordController = async (req: Request, res: Response) => {
  const { email } = forgotPasswordSchema.parse(
    req.body
  );

  const result = await requestPasswordReset(email);

  res.status(200).json({
    status: "success",
    message: result.message,
  });
};

export const resetPasswordController = async (req: Request, res: Response) => {
  const { token, newPassword } =
    resetPasswordSchema.parse(req.body);

  const result = await resetPassword(
    token,
    newPassword
  );

  res.status(200).json({
    status: "success",
    message: result.message,
  });
};
import { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "./auth.validation";
import { registerUser, loginUser } from "./auth.service";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = registerSchema.parse(req.body);

    const user = await registerUser(data);

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = loginSchema.parse(req.body);

    const result = await loginUser(data);

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
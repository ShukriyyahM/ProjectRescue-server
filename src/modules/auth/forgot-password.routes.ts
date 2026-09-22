import { Router } from "express";
import {
  forgotPasswordController,
  resetPasswordController,
} from "./forgot-password.controller";

const router = Router();

router.post(
  "/forgot-password",
  forgotPasswordController
);

router.post(
  "/reset-password",
  resetPasswordController
);

export default router;
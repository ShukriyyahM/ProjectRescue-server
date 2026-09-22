import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {
  confirmRecoveryController,
  getProjectRecoveryController,
} from "./recovery.controller";

const router = Router();

router.post(
  "/projects/:projectId/recovery",
  authenticate,
  confirmRecoveryController
);

router.get(
  "/projects/:projectId/recovery",
  authenticate,
  getProjectRecoveryController
);

export default router;
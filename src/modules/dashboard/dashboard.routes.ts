import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import {
  getOwnerDashboardController,
  getRescuerDashboardController,
} from "./dashboard.controller";

const router = Router();

router.get(
  "/owner",
  authenticate,
  requireRole("OWNER"),
  getOwnerDashboardController
);

router.get(
  "/rescuer",
  authenticate,
  requireRole("RESCUER"),
  getRescuerDashboardController
);

export default router;
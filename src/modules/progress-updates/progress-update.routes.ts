import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {
  createProgressUpdateController,
  getProjectProgressUpdatesController,
  getProgressUpdateByIdController,
  deleteProgressUpdateController,
} from "./progress-update.controller";

const router = Router();

router.post(
  "/projects/:projectId/progress-updates",
  authenticate,
  createProgressUpdateController
);

router.get(
  "/projects/:projectId/progress-updates",
  authenticate,
  getProjectProgressUpdatesController
);

router.get(
  "/progress-updates/:updateId",
  authenticate,
  getProgressUpdateByIdController
);

router.delete(
  "/progress-updates/:updateId",
  authenticate,
  deleteProgressUpdateController
);

export default router;
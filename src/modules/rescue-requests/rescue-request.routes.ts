import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {
  createRescueRequestController,
  getProjectRescueRequestsController,
  getMyRescueRequestsController,
  updateRescueRequestStatusController,
  withdrawRescueRequestController,
} from "./rescue-request.controller";

const router = Router();

router.post(
  "/projects/:projectId/rescue-requests",
  authenticate,
  createRescueRequestController
);

router.get(
  "/projects/:projectId/rescue-requests",
  authenticate,
  getProjectRescueRequestsController
);

router.get(
  "/rescue-requests/me",
  authenticate,
  getMyRescueRequestsController
);

router.patch(
  "/rescue-requests/:requestId/status",
  authenticate,
  updateRescueRequestStatusController
);

router.patch(
  "/rescue-requests/:requestId/withdraw",
  authenticate,
  withdrawRescueRequestController
);

export default router;
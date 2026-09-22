import { Router } from "express";
import { getRescueReadinessController } from "./readiness.controller";

const router = Router();

router.get(
  "/projects/:projectId/readiness",
  getRescueReadinessController
);

export default router;
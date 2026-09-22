import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {
  createProjectController,
  getAllProjectsController,
  getProject,
  updateProjectController,
  deleteProjectController,
} from "./project.controller";
import { confirmRecoveryController } from "../recovery/recovery.controller";

const router = Router();

router.get("/", getAllProjectsController);
router.get("/:id", getProject);

router.post("/", authenticate, createProjectController);
router.patch("/:id", authenticate, updateProjectController);
router.delete("/:id", authenticate, deleteProjectController);

router.patch(
  "/:id/recovery/confirm",
  authenticate,
  confirmRecoveryController
);

export default router;

import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {
  createTaskController,
  getProjectTasksController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
} from "./task.controller";

const router = Router();

router.post(
  "/projects/:projectId/tasks",
  authenticate,
  createTaskController
);

router.get(
  "/projects/:projectId/tasks",
  authenticate,
  getProjectTasksController
);

router.get(
  "/tasks/:taskId",
  authenticate,
  getTaskByIdController
);

router.patch(
  "/tasks/:taskId",
  authenticate,
  updateTaskController
);

router.delete(
  "/tasks/:taskId",
  authenticate,
  deleteTaskController
);

export default router;
import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";

import {
  getAllUsersController,
  getUserByIdController,
  updateUserRoleController,
  deleteUserController,
  getAllProjectsForAdminController,
  getProjectForAdminController,
  updateProjectStatusController,
  deleteProjectAsAdminController,
  getAdminStatisticsController,
} from "./admin.controller";

const router = Router();

router.use(authenticate, requireAdmin);

// Statistics
router.get("/statistics", getAdminStatisticsController);

// Users
router.get("/users", getAllUsersController);

router.get("/users/:userId", getUserByIdController);

router.patch("/users/:userId/role", updateUserRoleController);

router.delete("/users/:userId", deleteUserController);

// Projects
router.get("/projects", getAllProjectsForAdminController);

router.get("/projects/:projectId", getProjectForAdminController);

router.patch("/projects/:projectId/status",  updateProjectStatusController);

router.delete("/projects/:projectId", deleteProjectAsAdminController);

export default router;
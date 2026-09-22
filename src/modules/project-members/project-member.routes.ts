import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {
  getProjectMembersController,
  addProjectMemberController,
  updateProjectMemberRoleController,
  removeProjectMemberController,
} from "./project-member.controller";

const router = Router();

router.get(
  "/projects/:projectId/members",
  authenticate,
  getProjectMembersController
);

router.post(
  "/projects/:projectId/members",
  authenticate,
  addProjectMemberController
);

router.patch(
  "/projects/:projectId/members/:memberId",
  authenticate,
  updateProjectMemberRoleController
);

router.delete(
  "/projects/:projectId/members/:memberId",
  authenticate,
  removeProjectMemberController
);

export default router;
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {
  createIssueController,
  getProjectIssuesController,
  getIssueByIdController,
  updateIssueController,
  deleteIssueController,
} from "./issue.controller";

const router = Router();

router.post(
  "/projects/:projectId/issues",
  authenticate,
  createIssueController
);

router.get(
  "/projects/:projectId/issues",
  authenticate,
  getProjectIssuesController
);

router.get(
  "/issues/:issueId",
  authenticate,
  getIssueByIdController
);

router.patch(
  "/issues/:issueId",
  authenticate,
  updateIssueController
);

router.delete(
  "/issues/:issueId",
  authenticate,
  deleteIssueController
);

export default router;
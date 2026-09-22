import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import {
  createIssueSchema,
  updateIssueSchema,
} from "./issue.validation";
import {
  createIssue,
  getProjectIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
} from "./issue.service";

export const createIssueController = async (
  req: AuthRequest,
  res: Response
) => {
  const projectId = String(req.params.projectId);

  const data = createIssueSchema.parse(req.body);

  const issue = await createIssue(
    projectId,
    req.user!.userId,
    data
  );

  res.status(201).json({
    status: "success",
    message: "Issue created successfully",
    data: issue,
  });
};

export const getProjectIssuesController = async (
  req: AuthRequest,
  res: Response
) => {
  const projectId = String(req.params.projectId);

  const issues = await getProjectIssues(
    projectId,
    req.user!.userId
  );

  res.status(200).json({
    status: "success",
    data: issues,
  });
};

export const getIssueByIdController = async (
  req: AuthRequest,
  res: Response
) => {
  const issueId = String(req.params.issueId);

  const issue = await getIssueById(
    issueId,
    req.user!.userId
  );

  res.status(200).json({
    status: "success",
    data: issue,
  });
};

export const updateIssueController = async (
  req: AuthRequest,
  res: Response
) => {
  const issueId = String(req.params.issueId);

  const data = updateIssueSchema.parse(req.body);

  const issue = await updateIssue(
    issueId,
    req.user!.userId,
    data
  );

  res.status(200).json({
    status: "success",
    message: "Issue updated successfully",
    data: issue,
  });
};

export const deleteIssueController = async (
  req: AuthRequest,
  res: Response
) => {
  const issueId = String(req.params.issueId);

  await deleteIssue(
    issueId,
    req.user!.userId
  );

  res.status(200).json({
    status: "success",
    message: "Issue deleted successfully",
  });
};
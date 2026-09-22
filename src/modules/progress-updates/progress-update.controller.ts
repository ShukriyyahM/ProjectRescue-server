import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { createProgressUpdateSchema } from "./progress-update.validation";
import {
  createProgressUpdate,
  getProjectProgressUpdates,
  getProgressUpdateById,
  deleteProgressUpdate,
} from "./progress-update.service";

export const createProgressUpdateController = async (
  req: AuthRequest,
  res: Response
) => {
  const projectId = String(req.params.projectId);

  const data = createProgressUpdateSchema.parse(req.body);

  const progressUpdate = await createProgressUpdate(
    projectId,
    req.user!.userId,
    data
  );

  res.status(201).json({
    status: "success",
    message: "Progress update created successfully",
    data: progressUpdate,
  });
};

export const getProjectProgressUpdatesController = async (
  req: AuthRequest,
  res: Response
) => {
  const projectId = String(req.params.projectId);

  const progressUpdates = await getProjectProgressUpdates(
    projectId,
    req.user!.userId
  );

  res.status(200).json({
    status: "success",
    data: progressUpdates,
  });
};

export const getProgressUpdateByIdController = async (
  req: AuthRequest,
  res: Response
) => {
  const updateId = String(req.params.updateId);

  const progressUpdate = await getProgressUpdateById(
    updateId,
    req.user!.userId
  );

  res.status(200).json({
    status: "success",
    data: progressUpdate,
  });
};

export const deleteProgressUpdateController = async (
  req: AuthRequest,
  res: Response
) => {
  const updateId = String(req.params.updateId);

  await deleteProgressUpdate(
    updateId,
    req.user!.userId
  );

  res.status(200).json({
    status: "success",
    message: "Progress update deleted successfully",
  });
};
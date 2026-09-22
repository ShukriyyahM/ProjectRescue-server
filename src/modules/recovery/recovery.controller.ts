import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { createRecoverySchema } from "./recovery.validation";
import {
  confirmRecovery,
  getProjectRecovery,
} from "./recovery.service";

export const confirmRecoveryController = async (
  req: AuthRequest,
  res: Response
) => {
  const projectId = String(req.params.projectId);

  const data = createRecoverySchema.parse(req.body);

  const recovery = await confirmRecovery(
    projectId,
    req.user!.userId,
    data
  );

  res.status(201).json({
    status: "success",
    message: "Project recovery confirmed successfully",
    data: recovery,
  });
};

export const getProjectRecoveryController = async (
  req: AuthRequest,
  res: Response
) => {
  const projectId = String(req.params.projectId);

  const recovery = await getProjectRecovery(projectId);

  res.status(200).json({
    status: "success",
    data: recovery,
  });
};
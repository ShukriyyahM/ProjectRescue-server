import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { calculateRescueReadiness } from "./readiness.service";

export const getRescueReadinessController = async (
  req: AuthRequest,
  res: Response
) => {
  const projectId = String(req.params.projectId);

  const result = await calculateRescueReadiness(projectId);

  res.status(200).json({
    status: "success",
    message: "Rescue readiness score calculated successfully",
    data: result,
  });
};
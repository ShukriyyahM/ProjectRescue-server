import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import {
  getOwnerDashboard,
  getRescuerDashboard,
} from "./dashboard.service";

export const getOwnerDashboardController = async (
  req: AuthRequest,
  res: Response
) => {
  const dashboard = await getOwnerDashboard(
    req.user!.userId
  );

  res.status(200).json({
    status: "success",
    data: dashboard,
  });
};

export const getRescuerDashboardController = async (
  req: AuthRequest,
  res: Response
) => {
  const dashboard = await getRescuerDashboard(
    req.user!.userId
  );

  res.status(200).json({
    status: "success",
    data: dashboard,
  });
};
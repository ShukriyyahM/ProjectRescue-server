import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import {
  createRescueRequestSchema,
  updateRescueRequestStatusSchema,
} from "./rescue-request.validation";
import {
  createRescueRequest,
  getProjectRescueRequests,
  getMyRescueRequests,
  updateRescueRequestStatus,
  withdrawRescueRequest,
} from "./rescue-request.service";

export const createRescueRequestController = async (
  req: AuthRequest,
  res: Response
) => {
  const projectId = String(req.params.projectId);

  const data = createRescueRequestSchema.parse(req.body);

  const request = await createRescueRequest(
    projectId,
    req.user!.userId,
    data
  );

  res.status(201).json({
    status: "success",
    message: "Rescue request submitted successfully",
    data: request,
  });
};

export const getProjectRescueRequestsController = async (
  req: AuthRequest,
  res: Response
) => {
  const projectId = String(req.params.projectId);

  const requests = await getProjectRescueRequests(
    projectId,
    req.user!.userId
  );

  res.status(200).json({
    status: "success",
    data: requests,
  });
};

export const getMyRescueRequestsController = async (
  req: AuthRequest,
  res: Response
) => {
  const requests = await getMyRescueRequests(req.user!.userId);

  res.status(200).json({
    status: "success",
    data: requests,
  });
};

export const updateRescueRequestStatusController = async (req: AuthRequest, res: Response) => {
  const requestId = String(req.params.requestId);

  const { status } = updateRescueRequestStatusSchema.parse(req.body);

  const result = await updateRescueRequestStatus(
     requestId,
     req.user!.userId,
     status
    );

  res.status(200).json({
    status: "success",
    message: `Rescue request ${status.toLowerCase()} successfully`,
    data: result,
  });
};

export const withdrawRescueRequestController = async (req: AuthRequest, res: Response) => {
  const requestId = String(req.params.requestId);

  const request = await withdrawRescueRequest(
    requestId,
    req.user!.userId
  );

  res.status(200).json({
    status: "success",
    message: "Rescue request withdrawn successfully",
    data: request,
  });
};
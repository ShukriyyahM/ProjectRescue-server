import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import {
  createDocumentation,
  getDocumentation,
  updateDocumentation,
} from "./documentation.service";
import {
  createDocumentationSchema,
  updateDocumentationSchema,
} from "./documentation.validation";

export const createDocumentationController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = req.user?.userId;

    if (!ownerId) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    const data = createDocumentationSchema.parse(req.body);

    const documentation = await createDocumentation(
      String(req.params.projectId),
      ownerId,
      data
    );

    res.status(201).json({
      status: "success",
      message: "Project documentation created successfully",
      data: documentation,
    });
  } catch (error) {
    next(error);
  }
};

export const getDocumentationController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const documentation = await getDocumentation(
      String(req.params.projectId)
    );

    res.status(200).json({
      status: "success",
      message: "Project documentation retrieved successfully",
      data: documentation,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDocumentationController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = req.user?.userId;

    if (!ownerId) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    const data = updateDocumentationSchema.parse(req.body);

    const documentation = await updateDocumentation(
      String(req.params.projectId),
      ownerId,
      data
    );

    res.status(200).json({
      status: "success",
      message: "Project documentation updated successfully",
      data: documentation,
    });
  } catch (error) {
    next(error);
  }
};
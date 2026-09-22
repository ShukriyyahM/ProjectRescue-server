import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import {
  getProjectTechnologies,
  addProjectTechnology,
  removeProjectTechnology,
} from "./technology.service";
import { addTechnologySchema } from "./technology.validation";

export const getTechnologies = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const technologies = await getProjectTechnologies(
      String(req.params.projectId)
    );

    res.status(200).json({
      status: "success",
      message: "Project technologies retrieved successfully",
      data: technologies,
    });
  } catch (error) {
    next(error);
  }
};

export const addTechnology = async (
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

    const { skillId } = addTechnologySchema.parse(req.body);

    const technology = await addProjectTechnology(
      String(req.params.projectId),
      ownerId,
      skillId
    );

    res.status(201).json({
      status: "success",
      message: "Technology added successfully",
      data: technology,
    });
  } catch (error) {
    next(error);
  }
};

export const removeTechnology = async (
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

    await removeProjectTechnology(
      String(req.params.projectId),
      ownerId,
      String(req.params.technologyId)
    );

    res.status(200).json({
      status: "success",
      message: "Technology removed successfully",
    });
  } catch (error) {
    next(error);
  }
};
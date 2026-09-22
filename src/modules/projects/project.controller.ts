import { Response, Request,NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject} from "./project.service";
import {createProjectSchema, updateProjectSchema, projectQuerySchema} from "./project.validation";

export const createProjectController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.user?.userId;

    if (!ownerId) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    const data = createProjectSchema.parse(req.body);

    const project = await createProject(ownerId, data);

    res.status(201).json({
      status: "success",
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProjectsController = async (req: Request, res: Response) => {
  const query = projectQuerySchema.parse(req.query);

  const result = await getAllProjects(query);

  res.status(200).json({
    status: "success",
    data: result,
  });
};

export const getProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const project = await getProjectById(String(req.params.id));

    res.status(200).json({
      status: "success",
      message: "Project retrieved successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProjectController = async (
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

    const data = updateProjectSchema.parse(req.body);

   const project = await updateProject(
     String(req.params.id),
     ownerId,
     data
    );

    res.status(200).json({
      status: "success",
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProjectController = async (
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

    await deleteProject(String(req.params.id), ownerId);

    res.status(200).json({
      status: "success",
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
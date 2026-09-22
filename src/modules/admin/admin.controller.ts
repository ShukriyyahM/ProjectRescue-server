import { Request, Response } from "express";

import {updateUserRoleSchema, updateProjectStatusSchema} from "./admin.validation";

import {getAllUsers, getUserById, updateUserRole, deleteUser, getAllProjectsForAdmin, getProjectForAdmin, updateProjectStatus, deleteProjectAsAdmin, getAdminStatistics} from "./admin.service";

export const getAllUsersController = async (_req: Request, res: Response) => {
  const users = await getAllUsers();

  res.status(200).json({
    status: "success",
    data: users,
  });
};

export const getUserByIdController = async (req: Request, res: Response) => {
  const userId = String(req.params.userId);

  const user = await getUserById(userId);

  res.status(200).json({
    status: "success",
    data: user,
  });
};

export const updateUserRoleController = async (req: Request, res: Response) => {
  const userId = String(req.params.userId);

  const data = updateUserRoleSchema.parse(req.body);

  const user = await updateUserRole(
    userId,
    data.role
  );

  res.status(200).json({
    status: "success",
    message: "User role updated successfully",
    data: user,
  });
};

export const deleteUserController = async (req: Request, res: Response) => {
  const userId = String(req.params.userId);

  await deleteUser(userId);

  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
};

export const getAllProjectsForAdminController = async (_req: Request, res: Response) => {
  const projects = await getAllProjectsForAdmin();

  res.status(200).json({
    status: "success",
    data: projects,
  });
};

export const getProjectForAdminController = async (req: Request, res: Response) => {
  const projectId = String(req.params.projectId);

  const project = await getProjectForAdmin(projectId);

  res.status(200).json({
    status: "success",
    data: project,
  });
};

export const updateProjectStatusController = async (req: Request, res: Response) => {
  const projectId = String(req.params.projectId);

  const data = updateProjectStatusSchema.parse(
    req.body
  );

  const project = await updateProjectStatus(
    projectId,
    data.status
  );

  res.status(200).json({
    status: "success",
    message: "Project status updated successfully",
    data: project,
  });
};

export const deleteProjectAsAdminController = async (req: Request, res: Response) => {
  const projectId = String(req.params.projectId);

  await deleteProjectAsAdmin(projectId);

  res.status(200).json({
    status: "success",
    message: "Project deleted successfully",
  });
};

export const getAdminStatisticsController = async (_req: Request, res: Response) => {
  const statistics = await getAdminStatistics();

  res.status(200).json({
    status: "success",
    data: statistics,
  });
};
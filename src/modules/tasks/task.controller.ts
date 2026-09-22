import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import {
  createTaskSchema,
  updateTaskSchema,
} from "./task.validation";
import {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "./task.service";

export const createTaskController = async (
  req: AuthRequest,
  res: Response
) => {
  const projectId = String(req.params.projectId);

  const data = createTaskSchema.parse(req.body);

  const task = await createTask(
    projectId,
    req.user!.userId,
    data
  );

  res.status(201).json({
    status: "success",
    message: "Task created successfully",
    data: task,
  });
};

export const getProjectTasksController = async (
  req: AuthRequest,
  res: Response
) => {
  const projectId = String(req.params.projectId);

  const tasks = await getProjectTasks(
    projectId,
    req.user!.userId
  );

  res.status(200).json({
    status: "success",
    data: tasks,
  });
};

export const getTaskByIdController = async (
  req: AuthRequest,
  res: Response
) => {
  const taskId = String(req.params.taskId);

  const task = await getTaskById(
    taskId,
    req.user!.userId
  );

  res.status(200).json({
    status: "success",
    data: task,
  });
};

export const updateTaskController = async (
  req: AuthRequest,
  res: Response
) => {
  const taskId = String(req.params.taskId);

  const data = updateTaskSchema.parse(req.body);

  const task = await updateTask(
    taskId,
    req.user!.userId,
    data
  );

  res.status(200).json({
    status: "success",
    message: "Task updated successfully",
    data: task,
  });
};

export const deleteTaskController = async (
  req: AuthRequest,
  res: Response
) => {
  const taskId = String(req.params.taskId);

  await deleteTask(
    taskId,
    req.user!.userId
  );

  res.status(200).json({
    status: "success",
    message: "Task deleted successfully",
  });
};
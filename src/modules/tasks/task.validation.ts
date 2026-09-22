import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(2, "Task title must be at least 2 characters")
    .max(200, "Task title must not exceed 200 characters"),

  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .optional(),

  assignedToId: z.string().optional(),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
    .default("MEDIUM"),

  dueDate: z.coerce.date().optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(2)
    .max(200)
    .optional(),

  description: z
    .string()
    .max(1000)
    .optional(),

  assignedToId: z.string().nullable().optional(),

  status: z
    .enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"])
    .optional(),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
    .optional(),

  dueDate: z.coerce.date().nullable().optional(),
});
import { z } from "zod";

export const createIssueSchema = z.object({
  title: z
    .string()
    .min(2, "Issue title must be at least 2 characters")
    .max(200, "Issue title must not exceed 200 characters"),

  description: z
    .string()
    .max(2000, "Description must not exceed 2000 characters")
    .optional(),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
    .default("MEDIUM"),
});

export const updateIssueSchema = z.object({
  title: z
    .string()
    .min(2)
    .max(200)
    .optional(),

  description: z
    .string()
    .max(2000)
    .optional(),

  status: z
    .enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"])
    .optional(),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
    .optional(),
});
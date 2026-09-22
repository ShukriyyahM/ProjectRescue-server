import { z } from "zod";

export const createNotificationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),

  projectId: z.string().optional(),

  type: z.enum([
    "RESCUE_REQUEST",
    "REQUEST_ACCEPTED",
    "REQUEST_REJECTED",
    "TASK_ASSIGNED",
    "TASK_UPDATED",
    "ISSUE_CREATED",
    "ISSUE_UPDATED",
    "REVIEW_SUBMITTED",
    "PROJECT_UPDATED",
    "RECOVERY_CONFIRMED",
    "SYSTEM",
  ]),

  title: z
    .string()
    .min(2)
    .max(200),

  message: z
    .string()
    .min(2)
    .max(1000),
});

export const markNotificationReadSchema = z.object({
  isRead: z.boolean(),
});
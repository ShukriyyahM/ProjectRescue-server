import { z } from "zod";

export const createRecoverySchema = z.object({
  completedTaskId: z
    .string()
    .min(1, "Completed task ID is required"),

  meaningfulMilestone: z
    .string()
    .min(5, "Meaningful milestone must be at least 5 characters")
    .max(1000, "Meaningful milestone must not exceed 1000 characters"),

  confirmationNotes: z
    .string()
    .max(2000, "Confirmation notes must not exceed 2000 characters")
    .optional(),
});
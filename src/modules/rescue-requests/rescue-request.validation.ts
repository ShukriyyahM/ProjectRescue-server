import { z } from "zod";

export const createRescueRequestSchema = z.object({
  message: z
    .string()
    .max(1000, "Message must not exceed 1000 characters")
    .optional(),

  proposedContribution: z
    .string()
    .max(1000, "Proposed contribution must not exceed 1000 characters")
    .optional(),
});

export const updateRescueRequestStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED"]),
});
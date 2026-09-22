import { z } from "zod";

export const updateUserRoleSchema = z.object({
  role: z.enum(["OWNER", "RESCUER", "REVIEWER", "ADMIN"]),
});

export const updateProjectStatusSchema = z.object({
  status: z.enum([
    "ABANDONED",
    "DEVELOPMENT",
    "STUCK",
    "RESCUED",
  ]),
});

export const adminIdSchema = z.object({
  id: z.string().min(1, "ID is required"),
});
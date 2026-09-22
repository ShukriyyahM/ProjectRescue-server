import { z } from "zod";

export const addProjectMemberSchema = z.object({
  userId: z.string().min(1, "User ID is required"),

  role: z
    .enum(["CONTRIBUTOR", "LEAD"])
    .default("CONTRIBUTOR"),
});

export const updateProjectMemberSchema = z.object({
  role: z.enum(["CONTRIBUTOR", "LEAD"]),
});
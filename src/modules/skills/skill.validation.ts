import { z } from "zod";

export const createSkillSchema = z.object({
  name: z
    .string()
    .min(2, "Skill name must be at least 2 characters")
    .max(100, "Skill name must not exceed 100 characters")
    .trim(),
});

export const skillIdSchema = z.object({
  skillId: z.string().min(1, "Skill ID is required"),
});
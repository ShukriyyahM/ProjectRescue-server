import { z } from "zod";

export const createProgressUpdateSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must not exceed 200 characters"),

  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(2000, "Description must not exceed 2000 characters"),

  percentage: z
    .number()
    .int()
    .min(0)
    .max(100)
    .optional(),
});
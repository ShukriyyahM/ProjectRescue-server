import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must not exceed 100 characters")
    .trim(),

  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
});

export const updateCategorySchema = createCategorySchema.partial();
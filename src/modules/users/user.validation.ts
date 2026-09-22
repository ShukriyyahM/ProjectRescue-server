import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .optional(),

  bio: z
    .string()
    .max(500, "Bio must not exceed 500 characters")
    .optional(),

  location: z
    .string()
    .max(100, "Location must not exceed 100 characters")
    .optional(),
});
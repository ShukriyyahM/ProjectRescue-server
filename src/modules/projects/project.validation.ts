import { z } from "zod";

export const createProjectSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),

  name: z
    .string()
    .min(2, "Project name must be at least 2 characters")
    .max(150, "Project name must not exceed 150 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),

  targetUsers: z.string().optional(),

  type: z.enum(["WEB", "MOBILE", "DESKTOP", "API", "OTHER"]),

  frontend: z.string().optional(),
  backend: z.string().optional(),
  database: z.string().optional(),
  apis: z.string().optional(),
  authentication: z.string().optional(),
  deployment: z.string().optional(),
  repositoryUrl: z.string().url().optional(),
  otherTechnologies: z.string().optional(),

  completionPercentage: z
    .number()
    .int()
    .min(0)
    .max(100)
    .optional(),

  lastDevelopmentDate: z.coerce.date().optional(),

  knownBugs: z.string().optional(),
  unfinishedFeatures: z.string().optional(),
  currentBlockers: z.string().optional(),
  existingDocumentation: z.string().optional(),

  abandonmentReasons: z.string().optional(),
  abandonmentExplanation: z.string().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const projectIdSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
});

export const projectQuerySchema = z.object({
  search: z.string().trim().optional(),

  categoryId: z.string().optional(),

  type: z
    .enum(["WEB", "MOBILE", "DESKTOP", "API", "OTHER"])
    .optional(),

  status: z
    .enum(["ABANDONED", "DEVELOPMENT", "STUCK", "RESCUED"])
    .optional(),

  minReadiness: z.coerce
    .number()
    .int()
    .min(0)
    .max(100)
    .optional(),

  maxReadiness: z.coerce
    .number()
    .int()
    .min(0)
    .max(100)
    .optional(),

  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10),
});
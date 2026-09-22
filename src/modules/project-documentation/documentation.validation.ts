import { z } from "zod";

export const createDocumentationSchema = z.object({
  projectOverview: z.string().optional(),
  architecture: z.string().optional(),
  setupInstructions: z.string().optional(),
  environmentRequirements: z.string().optional(),
  knownProblems: z.string().optional(),
  importantDecisions: z.string().optional(),
  remainingWork: z.string().optional(),
  importantResources: z.string().optional(),
});

export const updateDocumentationSchema =
  createDocumentationSchema.partial();
import { z } from "zod";

export const createReviewSchema = z.object({
  technicalAssessment: z.string().max(2000).optional(),

  feasibilityAssessment: z.string().max(2000).optional(),

  recommendations: z.string().max(2000).optional(),

  recoveryDifficulty: z.string().max(100).optional(),

  score: z.number().int().min(0).max(100).optional(),
});

export const updateReviewSchema = z.object({
  status: z.enum(["PENDING", "IN_REVIEW", "COMPLETED"]).optional(),

  technicalAssessment: z.string().max(2000).optional(),

  feasibilityAssessment: z.string().max(2000).optional(),

  recommendations: z.string().max(2000).optional(),

  recoveryDifficulty: z.string().max(100).optional(),

  score: z.number().int().min(0).max(100).optional(),
});
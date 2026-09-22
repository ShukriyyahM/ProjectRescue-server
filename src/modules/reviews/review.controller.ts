import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import {
  createReviewSchema,
  updateReviewSchema,
} from "./review.validation";
import {
  createReview,
  getProjectReviews,
  getReviewById,
  updateReview,
} from "./review.service";

export const createReviewController = async (
  req: AuthRequest,
  res: Response
) => {
  const projectId = String(req.params.projectId);

  const data = createReviewSchema.parse(req.body);

  const review = await createReview(
    projectId,
    req.user!.userId,
    data
  );

  res.status(201).json({
    status: "success",
    message: "Review created successfully",
    data: review,
  });
};

export const getProjectReviewsController = async (
  req: AuthRequest,
  res: Response
) => {
  const projectId = String(req.params.projectId);

  const reviews = await getProjectReviews(
    projectId,
    req.user!.userId
  );

  res.status(200).json({
    status: "success",
    data: reviews,
  });
};

export const getReviewByIdController = async (
  req: AuthRequest,
  res: Response
) => {
  const reviewId = String(req.params.reviewId);

  const review = await getReviewById(
    reviewId,
    req.user!.userId
  );

  res.status(200).json({
    status: "success",
    data: review,
  });
};

export const updateReviewController = async (
  req: AuthRequest,
  res: Response
) => {
  const reviewId = String(req.params.reviewId);

  const data = updateReviewSchema.parse(req.body);

  const review = await updateReview(
    reviewId,
    req.user!.userId,
    data
  );

  res.status(200).json({
    status: "success",
    message: "Review updated successfully",
    data: review,
  });
};
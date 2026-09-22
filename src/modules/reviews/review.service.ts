import prisma from "../../config/db";
import { sendNotification } from "../notifications/notification.helper";

interface CreateReviewData {
  technicalAssessment?: string;
  feasibilityAssessment?: string;
  recommendations?: string;
  recoveryDifficulty?: string;
  score?: number;
}

interface UpdateReviewData extends CreateReviewData {
  status?: "PENDING" | "IN_REVIEW" | "COMPLETED";
}

const ensureReviewer = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role !== "REVIEWER") {
    throw new Error("Only reviewers can perform this action");
  }

  return user;
};

export const createReview = async (
  projectId: string,
  reviewerId: string,
  data: CreateReviewData
) => {
  await ensureReviewer(reviewerId);

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      projectId,
      reviewerId,
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this project");
  }

  const review = await prisma.review.create({
    data: {
      projectId,
      reviewerId,
      technicalAssessment: data.technicalAssessment,
      feasibilityAssessment: data.feasibilityAssessment,
      recommendations: data.recommendations,
      recoveryDifficulty: data.recoveryDifficulty,
      score: data.score,
    },
    include: {
      reviewer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
          ownerId: true,
        },
      },
    },
  });

  await sendNotification({
    userId: review.project.ownerId,
    projectId: review.project.id,
    type: "REVIEW_SUBMITTED",
    title: "New Project Review",
    message: `${review.reviewer.name} has submitted a review for your project "${review.project.name}".`,
  });

  return review;
};

export const getProjectReviews = async (projectId: string, userId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return prisma.review.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    include: {
      reviewer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const getReviewById = async (
  reviewId: string,
  userId: string
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: {
      project: true,
      reviewer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  return review;
};

export const updateReview = async (
  reviewId: string,
  reviewerId: string,
  data: UpdateReviewData
) => {
  await ensureReviewer(reviewerId);

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.reviewerId !== reviewerId) {
    throw new Error("You can only update your own review");
  }

  return prisma.review.update({
    where: { id: reviewId },
    data,
    include: {
      reviewer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import {createReviewController, getProjectReviewsController, getReviewByIdController, updateReviewController} from "./review.controller";

const router = Router();

router.post("/projects/:projectId/reviews", authenticate, requireRole("REVIEWER"), createReviewController);

router.get("/projects/:projectId/reviews", authenticate, getProjectReviewsController);

router.get( "/reviews/:reviewId", authenticate, getReviewByIdController);

router.patch("/reviews/:reviewId", authenticate, requireRole("REVIEWER"), updateReviewController);

export default router;
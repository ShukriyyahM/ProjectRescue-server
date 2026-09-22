import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {createDocumentationController, getDocumentationController, updateDocumentationController} from "./documentation.controller";

const router = Router();

router.get("/projects/:projectId/documentation", getDocumentationController);

router.post("/projects/:projectId/documentation", authenticate, createDocumentationController);

router.patch("/projects/:projectId/documentation", authenticate, updateDocumentationController);

export default router;
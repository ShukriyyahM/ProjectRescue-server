import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {
  getTechnologies,
  addTechnology,
  removeTechnology,
} from "./technology.controller";

const router = Router();

router.get(
  "/projects/:projectId/technologies",
  getTechnologies
);

router.post(
  "/projects/:projectId/technologies",
  authenticate,
  addTechnology
);

router.delete(
  "/projects/:projectId/technologies/:technologyId",
  authenticate,
  removeTechnology
);

export default router;
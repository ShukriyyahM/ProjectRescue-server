import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {getSkills, getMySkillsController, addSkill, removeSkill} from "./skill.controller";

const router = Router();

router.get("/", getSkills);
router.get("/me", authenticate, getMySkillsController);
router.post("/me", authenticate, addSkill);
router.delete("/me/:skillId", authenticate, removeSkill);

export default router;
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { getMe, updateMe } from "./user.controller";

const router = Router();

router.get("/me", authenticate, getMe);
router.patch("/me", authenticate, updateMe);

export default router;
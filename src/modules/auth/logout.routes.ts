import { Router } from "express";
import { logoutController } from "./logout.controller";

const router = Router();

router.post("/logout", logoutController);

export default router;
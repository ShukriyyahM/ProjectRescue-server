import { Router } from "express";
import { authenticate, AuthRequest } from "../../middleware/auth.middleware";

const router = Router();

router.get("/me", authenticate, (req: AuthRequest, res) => {
  res.status(200).json({
    status: "success",
    message: "Authenticated successfully",
    data: {
      userId: req.user?.userId,
      role: req.user?.role,
    },
  });
});

export default router;
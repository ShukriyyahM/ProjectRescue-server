import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {
  getMyNotificationsController,
  getUnreadNotificationsController,
  markNotificationAsReadController,
  markAllNotificationsAsReadController,
  deleteNotificationController,
} from "./notification.controller";

const router = Router();

router.get(
  "/notifications/me",
  authenticate,
  getMyNotificationsController
);

router.get(
  "/notifications/unread",
  authenticate,
  getUnreadNotificationsController
);

router.patch(
  "/notifications/:notificationId/read",
  authenticate,
  markNotificationAsReadController
);

router.patch(
  "/notifications/read-all",
  authenticate,
  markAllNotificationsAsReadController
);

router.delete(
  "/notifications/:notificationId",
  authenticate,
  deleteNotificationController
);

export default router;
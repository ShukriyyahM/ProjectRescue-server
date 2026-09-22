import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import {
  getMyNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "./notification.service";

export const getMyNotificationsController = async (
  req: AuthRequest,
  res: Response
) => {
  const notifications = await getMyNotifications(
    req.user!.userId
  );

  res.status(200).json({
    status: "success",
    data: notifications,
  });
};

export const getUnreadNotificationsController = async (
  req: AuthRequest,
  res: Response
) => {
  const notifications = await getUnreadNotifications(
    req.user!.userId
  );

  res.status(200).json({
    status: "success",
    data: notifications,
  });
};

export const markNotificationAsReadController = async (
  req: AuthRequest,
  res: Response
) => {
  const notificationId = String(req.params.notificationId);

  const notification = await markNotificationAsRead(
    notificationId,
    req.user!.userId
  );

  res.status(200).json({
    status: "success",
    message: "Notification marked as read",
    data: notification,
  });
};

export const markAllNotificationsAsReadController = async (
  req: AuthRequest,
  res: Response
) => {
  await markAllNotificationsAsRead(
    req.user!.userId
  );

  res.status(200).json({
    status: "success",
    message: "All notifications marked as read",
  });
};

export const deleteNotificationController = async (
  req: AuthRequest,
  res: Response
) => {
  const notificationId = String(req.params.notificationId);

  await deleteNotification(
    notificationId,
    req.user!.userId
  );

  res.status(200).json({
    status: "success",
    message: "Notification deleted successfully",
  });
};
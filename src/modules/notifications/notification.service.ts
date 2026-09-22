import prisma from "../../config/db";

interface CreateNotificationData {
  userId: string;
  projectId?: string;
  type:
    | "RESCUE_REQUEST"
    | "REQUEST_ACCEPTED"
    | "REQUEST_REJECTED"
    | "TASK_ASSIGNED"
    | "TASK_UPDATED"
    | "ISSUE_CREATED"
    | "ISSUE_UPDATED"
    | "REVIEW_SUBMITTED"
    | "PROJECT_UPDATED"
    | "RECOVERY_CONFIRMED"
    | "SYSTEM";
  title: string;
  message: string;
}

export const createNotification = async (
  data: CreateNotificationData
) => {
  return prisma.notification.create({
    data,
  });
};

export const getMyNotifications = async (
  userId: string
) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const getUnreadNotifications = async (
  userId: string
) => {
  return prisma.notification.findMany({
    where: {
      userId,
      isRead: false,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const markNotificationAsRead = async (
  notificationId: string,
  userId: string
) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  if (notification.userId !== userId) {
    throw new Error(
      "You are not allowed to update this notification"
    );
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: {
      isRead: true,
    },
  });
};

export const markAllNotificationsAsRead = async (
  userId: string
) => {
  await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
};

export const deleteNotification = async (
  notificationId: string,
  userId: string
) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  if (notification.userId !== userId) {
    throw new Error(
      "You are not allowed to delete this notification"
    );
  }

  await prisma.notification.delete({
    where: { id: notificationId },
  });
};
import prisma from "../../config/db";

interface SendNotificationData {
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

export const sendNotification = async (data: SendNotificationData) => {
  return prisma.notification.create({
    data,
  });
};
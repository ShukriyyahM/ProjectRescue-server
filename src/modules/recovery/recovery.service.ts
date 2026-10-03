import prisma from "../../config/db";
import { sendNotification } from "../notifications/notification.helper";

interface CreateRecoveryData {
  completedTaskId: string;
  meaningfulMilestone: string;
  confirmationNotes?: string;
}

const ensureCanConfirmRecovery = async (userId: string, projectId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const isOwner = project.ownerId === userId;
  const isReviewer = user.role === "REVIEWER";

  if (!isOwner && !isReviewer) {
    throw new Error(
      "Only the project owner or a reviewer can confirm recovery"
    );
  }

  return project;
};

export const confirmRecovery = async (projectId: string, confirmedById: string, data: CreateRecoveryData) => {
  const project = await ensureCanConfirmRecovery(confirmedById, projectId);

  const existingRecovery = await prisma.recovery.findUnique({
    where: { projectId }});

  if (existingRecovery) {
    throw new Error("Project recovery has already been confirmed");
  }

  // All project tasks must be completed before recovery
  // can be confirmed.
  const totalTasks = await prisma.task.count({
    where: { projectId },
  });

  const completedTasks = await prisma.task.count({
    where: {
      projectId,
      status: "COMPLETED",
    },
  });

  if (totalTasks === 0) {
    throw new Error(
      "Project must have at least one task before recovery can be confirmed"
    );
  }

  if (completedTasks !== totalTasks) {
    throw new Error(
      "All project tasks must be completed before recovery can be confirmed"
    );
  }

  // Make sure the selected task belongs to this project
  // and is completed.
  const completedTask = await prisma.task.findFirst({
    where: {
      id: data.completedTaskId,
      projectId,
      status: "COMPLETED",
    },
  });

  if (!completedTask) {
    throw new Error(
      "The selected task must belong to this project and have COMPLETED status"
    );
  }

  const recovery = await prisma.$transaction(async (tx) => {
    const newRecovery = await tx.recovery.create({
      data: {
        projectId,
        confirmedById,
        meaningfulMilestone: data.meaningfulMilestone,
        confirmationNotes: data.confirmationNotes,
      },
      include: {
        confirmedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    await tx.project.update({
      where: { id: projectId },
      data: {
        status: "RESCUED",
      },
    });

    return newRecovery;
  });

  await sendNotification({
    userId: project.ownerId,
    projectId: project.id,
    type: "RECOVERY_CONFIRMED",
    title: "Project Recovery Confirmed",
    message: `The project "${project.name}" has been successfully rescued.`,
  });

  return recovery;
};
export const getProjectRecovery = async (projectId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const recovery = await prisma.recovery.findUnique({
    where: { projectId },
    include: {
      confirmedBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!recovery) {
    throw new Error("Project recovery has not been confirmed");
  }

  return recovery;
};
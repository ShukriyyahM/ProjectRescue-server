import prisma from "../../config/db";
import { sendNotification } from "../notifications/notification.helper";

interface CreateRescueRequestData {
  message?: string;
  proposedContribution?: string;
}

export const createRescueRequest = async (
  projectId: string,
  rescuerId: string,
  data: CreateRescueRequestData
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.ownerId === rescuerId) {
    throw new Error("You cannot submit a rescue request for your own project");
  }

  const existingRequest = await prisma.rescueRequest.findUnique({
    where: {
      projectId_rescuerId: {
        projectId,
        rescuerId,
      },
    },
  });

  if (existingRequest) {
    throw new Error("You have already submitted a rescue request for this project");
  }

const rescueRequest = await prisma.rescueRequest.create({
  data: {
    projectId,
    rescuerId,
    message: data.message,
    proposedContribution: data.proposedContribution,
  },
  include: {
    project: {
      select: {
        id: true,
        name: true,
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
    rescuer: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  },
});

await sendNotification({
  userId: rescueRequest.project.owner.id,
  projectId: rescueRequest.project.id,
  type: "RESCUE_REQUEST",
  title: "New Rescue Request",
  message: `${rescueRequest.rescuer.name} wants to help rescue your project "${rescueRequest.project.name}".`,
});

return rescueRequest;
}

export const getProjectRescueRequests = async (
  projectId: string,
  ownerId: string
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.ownerId !== ownerId) {
    throw new Error("You are not allowed to view these requests");
  }

  return prisma.rescueRequest.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    include: {
      rescuer: {
        select: {
          id: true,
          name: true,
          email: true,
          profile: true,
          skills: {
            include: {
              skill: true,
            },
          },
        },
      },
    },
  });
};

export const getMyRescueRequests = async (rescuerId: string) => {
  return prisma.rescueRequest.findMany({
    where: { rescuerId },
    orderBy: { createdAt: "desc" },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          status: true,
          rescueReadinessScore: true,
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
          category: true,
        },
      },
    },
  });
};

export const updateRescueRequestStatus = async (requestId: string, ownerId: string, status: "ACCEPTED" | "REJECTED") => {
  const request = await prisma.rescueRequest.findUnique({
    where: { id: requestId },
    include: {
      project: true,
    },
  });

  if (!request) {
    throw new Error("Rescue request not found");
  }

  if (request.project.ownerId !== ownerId) {
    throw new Error("You are not allowed to update this request");
  }

  if (request.status !== "PENDING") {
    throw new Error("Only pending requests can be updated");
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedRequest = await tx.rescueRequest.update({
      where: { id: requestId },
      data: { status },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        rescuer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    let member = null;

    if (status === "ACCEPTED") {
      const existingMember = await tx.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId: request.projectId,
            userId: request.rescuerId,
          },
        },
      });

      if (!existingMember) {
        member = await tx.projectMember.create({
          data: {
            projectId: request.projectId,
            userId: request.rescuerId,
            role: "CONTRIBUTOR",
          },
        });
      } else {
        member = existingMember;
      }
    }

    return {
      request: updatedRequest,
      member,
    };
  });

  await sendNotification({
  userId: result.request.rescuer.id,
  projectId: result.request.project.id,
  type:
    status === "ACCEPTED"
      ? "REQUEST_ACCEPTED"
      : "REQUEST_REJECTED",
  title:
    status === "ACCEPTED"
      ? "Rescue Request Accepted"
      : "Rescue Request Rejected",
  message:
    status === "ACCEPTED"
      ? `Your rescue request for "${result.request.project.name}" has been accepted. You are now a project member.`
      : `Your rescue request for "${result.request.project.name}" has been rejected.`,
 });

  return result;
};

export const withdrawRescueRequest = async (
  requestId: string,
  rescuerId: string
) => {
  const request = await prisma.rescueRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new Error("Rescue request not found");
  }

  if (request.rescuerId !== rescuerId) {
    throw new Error("You are not allowed to withdraw this request");
  }

  if (request.status !== "PENDING") {
    throw new Error("Only pending requests can be withdrawn");
  }

  return prisma.rescueRequest.update({
    where: { id: requestId },
    data: {
      status: "WITHDRAWN",
    },
  });
};
import prisma from "../../config/db";

interface CreateProgressUpdateData {
  title: string;
  description: string;
  percentage?: number;
}

const ensureProjectAccess = async (
  projectId: string,
  userId: string
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.ownerId === userId) {
    return project;
  }

  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });

  if (!member) {
    throw new Error("User is not a member of this project");
  }

  return project;
};

export const createProgressUpdate = async (
  projectId: string,
  userId: string,
  data: CreateProgressUpdateData
) => {
  await ensureProjectAccess(projectId, userId);

  const progressUpdate = await prisma.progressUpdate.create({
    data: {
      projectId,
      userId,
      title: data.title,
      description: data.description,
      percentage: data.percentage,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return progressUpdate;
};

export const getProjectProgressUpdates = async (
  projectId: string,
  userId: string
) => {
  await ensureProjectAccess(projectId, userId);

  return prisma.progressUpdate.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const getProgressUpdateById = async (
  updateId: string,
  userId: string
) => {
  const progressUpdate = await prisma.progressUpdate.findUnique({
    where: { id: updateId },
    include: {
      project: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!progressUpdate) {
    throw new Error("Progress update not found");
  }

  await ensureProjectAccess(
    progressUpdate.projectId,
    userId
  );

  return progressUpdate;
};

export const deleteProgressUpdate = async (
  updateId: string,
  userId: string
) => {
  const progressUpdate = await prisma.progressUpdate.findUnique({
    where: { id: updateId },
    include: {
      project: true,
    },
  });

  if (!progressUpdate) {
    throw new Error("Progress update not found");
  }

  if (
    progressUpdate.userId !== userId &&
    progressUpdate.project.ownerId !== userId
  ) {
    throw new Error(
      "You are not allowed to delete this progress update"
    );
  }

  await prisma.progressUpdate.delete({
    where: { id: updateId },
  });
};
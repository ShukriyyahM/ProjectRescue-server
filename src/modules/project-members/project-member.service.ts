import prisma from "../../config/db";

interface AddProjectMemberData {
  userId: string;
  role?: "CONTRIBUTOR" | "LEAD";
}

export const getProjectMembers = async (projectId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return prisma.projectMember.findMany({
    where: { projectId },
    orderBy: { joinedAt: "asc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
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

export const addProjectMember = async (
  projectId: string,
  ownerId: string,
  data: AddProjectMemberData
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.ownerId !== ownerId) {
    throw new Error("Only the project owner can add members");
  }

  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.id === ownerId) {
    throw new Error("Project owner cannot be added as a member");
  }

  const existingMember = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId: data.userId,
      },
    },
  });

  if (existingMember) {
    throw new Error("User is already a member of this project");
  }

  return prisma.projectMember.create({
    data: {
      projectId,
      userId: data.userId,
      role: data.role ?? "CONTRIBUTOR",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

export const updateProjectMemberRole = async (
  projectId: string,
  memberId: string,
  ownerId: string,
  role: "CONTRIBUTOR" | "LEAD"
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.ownerId !== ownerId) {
    throw new Error("Only the project owner can update member roles");
  }

  const member = await prisma.projectMember.findUnique({
    where: { id: memberId },
  });

  if (!member || member.projectId !== projectId) {
    throw new Error("Project member not found");
  }

  return prisma.projectMember.update({
    where: { id: memberId },
    data: { role },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

export const removeProjectMember = async (
  projectId: string,
  memberId: string,
  ownerId: string
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.ownerId !== ownerId) {
    throw new Error("Only the project owner can remove members");
  }

  const member = await prisma.projectMember.findUnique({
    where: { id: memberId },
  });

  if (!member || member.projectId !== projectId) {
    throw new Error("Project member not found");
  }

  await prisma.projectMember.delete({
    where: { id: memberId },
  });
};
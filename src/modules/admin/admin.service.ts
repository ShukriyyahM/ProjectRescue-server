import prisma from "../../config/db";

export const getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
      skills: {
        include: {
          skill: true,
        },
      },
    },
  });
};

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
      skills: {
        include: {
          skill: true,
        },
      },
      ownedProjects: {
        select: {
          id: true,
          name: true,
          status: true,
          rescueReadinessScore: true,
        },
      },
      rescueRequests: {
        select: {
          id: true,
          projectId: true,
          status: true,
          createdAt: true,
        },
      },
      memberships: {
        select: {
          id: true,
          projectId: true,
          role: true,
          joinedAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateUserRole = async (
  userId: string,
  role: "OWNER" | "RESCUER" | "REVIEWER" | "ADMIN"
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.user.delete({
    where: { id: userId },
  });
};

export const getAllProjectsForAdmin = async () => {
  return prisma.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
      documentation: true,
      technologies: {
        include: {
          skill: true,
        },
      },
    },
  });
};

export const getProjectForAdmin = async (projectId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
      documentation: true,
      technologies: {
        include: {
          skill: true,
        },
      },
      members: {
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
      },
      tasks: true,
      issues: true,
      reviews: {
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      rescueRequests: {
        include: {
          rescuer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      recovery: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

export const updateProjectStatus = async (
  projectId: string,
  status: "ABANDONED" | "DEVELOPMENT" | "STUCK" | "RESCUED"
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return prisma.project.update({
    where: { id: projectId },
    data: { status },
  });
};

export const deleteProjectAsAdmin = async (
  projectId: string
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  await prisma.project.delete({
    where: { id: projectId },
  });
};

export const getAdminStatistics = async () => {
  const [
    totalUsers,
    totalProjects,
    totalRescueRequests,
    totalAcceptedRequests,
    totalRescuedProjects,
    totalTasks,
    totalIssues,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.project.count(),

    prisma.rescueRequest.count(),

    prisma.rescueRequest.count({
      where: {
        status: "ACCEPTED",
      },
    }),

    prisma.project.count({
      where: {
       status: "RESCUED",
      },
    }),

    prisma.task.count(),

    prisma.issue.count(),
  ]);

  const [owners, rescuers, reviewers, admins] = await Promise.all([
    prisma.user.count({
      where: { role: "OWNER" },
    }),

    prisma.user.count({
      where: { role: "RESCUER" },
    }),

    prisma.user.count({
      where: { role: "REVIEWER" },
    }),

    prisma.user.count({
      where: { role: "ADMIN" },
    }),
  ]);

  const [
    abandonedProjects,
    developmentProjects,
    stuckProjects,
    rescuedProjects,
  ] = await Promise.all([
    prisma.project.count({
      where: { status: "ABANDONED" },
    }),

    prisma.project.count({
      where: { status: "DEVELOPMENT" },
    }),

    prisma.project.count({
      where: { status: "STUCK" },
    }),

    prisma.project.count({
      where: { status: "RESCUED" },
    }),
  ]);

  return {
    users: {
      total: totalUsers,
      owners,
      rescuers,
      reviewers,
      admins,
    },

    projects: {
      total: totalProjects,
      abandoned: abandonedProjects,
      development: developmentProjects,
      stuck: stuckProjects,
      rescued: rescuedProjects,
    },

    activity: {
      rescueRequests: totalRescueRequests,
      tasks: totalTasks,
      issues: totalIssues,
    },

    rescueSuccessRate:
       totalAcceptedRequests === 0
         ? 0
         : Number(
           (
             (totalRescuedProjects / totalAcceptedRequests) *
             100
           ).toFixed(2)
          ),
  }
};
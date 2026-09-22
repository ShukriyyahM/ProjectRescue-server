import prisma from "../../config/db";

export const getOwnerDashboard = async (userId: string) => {
  const [
    totalProjects,
    abandonedProjects,
    rescuedProjects,
    activeProjects,
    pendingRequests,
    projectMembers,
    totalTasks,
    completedTasks,
    openIssues,
    recentProjects,
    rescueRequests,
  ] = await Promise.all([
    prisma.project.count({
      where: {
        ownerId: userId,
      },
    }),

    prisma.project.count({
      where: {
        ownerId: userId,
        status: "ABANDONED",
      },
    }),

    prisma.project.count({
      where: {
        ownerId: userId,
        status: "RESCUED",
      },
    }),

    prisma.project.count({
      where: {
        ownerId: userId,
        status: {
          in: ["DEVELOPMENT", "STUCK"],
        },
      },
    }),

    prisma.rescueRequest.count({
      where: {
        project: {
          ownerId: userId,
        },
        status: "PENDING",
      },
    }),

    prisma.projectMember.count({
      where: {
        project: {
          ownerId: userId,
        },
      },
    }),

    prisma.task.count({
      where: {
        project: {
          ownerId: userId,
        },
      },
    }),

    prisma.task.count({
      where: {
        project: {
          ownerId: userId,
        },
        status: "COMPLETED",
      },
    }),

    prisma.issue.count({
      where: {
        project: {
          ownerId: userId,
        },
        status: {
          in: ["OPEN", "IN_PROGRESS"],
        },
      },
    }),

    prisma.project.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    }),

    prisma.rescueRequest.findMany({
      where: {
        project: {
          ownerId: userId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        status: true,
        createdAt: true,

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
    }),
  ]);

  return {
    role: "OWNER",

    overview: {
      totalProjects,
      activeProjects,
      rescuedProjects,
      abandonedProjects,
      pendingRequests,
      totalTasks,
      completedTasks,
      openIssues,
    },

    recentProjects: recentProjects.map((project) => ({
      id: project.id,
      title: project.name,
      description: project.description,
      status: project.status,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    })),

    rescueRequests: rescueRequests.map((request) => ({
      id: request.id,
      status: request.status,
      createdAt: request.createdAt.toISOString(),

      project: request.project
        ? {
            id: request.project.id,
            title: request.project.name,
          }
        : undefined,

      requester: request.rescuer
        ? {
            id: request.rescuer.id,
            name: request.rescuer.name,
            email: request.rescuer.email,
          }
        : undefined,
    })),

    activeProjects: recentProjects
      .filter(
        (project) =>
          project.status === "DEVELOPMENT" ||
          project.status === "STUCK"
      )
      .map((project) => ({
        id: project.id,
        title: project.name,
        description: project.description,
        status: project.status,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
      })),

    tasks: [],
  };
};

export const getRescuerDashboard = async (userId: string) => {
  const [
    joinedProjects,
    rescueRequests,
    acceptedRequests,
    assignedTasks,
    completedTasks,
    progressUpdates,
    projectMemberships,
    taskRows,
    requestRows,
  ] = await Promise.all([
    prisma.projectMember.count({
      where: {
        userId,
      },
    }),

    prisma.rescueRequest.count({
      where: {
        rescuerId: userId,
      },
    }),

    prisma.rescueRequest.count({
      where: {
        rescuerId: userId,
        status: "ACCEPTED",
      },
    }),

    prisma.task.count({
      where: {
        assignedToId: userId,
      },
    }),

    prisma.task.count({
      where: {
        assignedToId: userId,
        status: "COMPLETED",
      },
    }),

    prisma.progressUpdate.count({
      where: {
        userId,
      },
    }),

    prisma.projectMember.findMany({
      where: {
        userId,
      },
      orderBy: {
        joinedAt: "desc",
      },
      take: 5,
      select: {
        projectId: true,
        joinedAt: true,
      },
    }),

    prisma.task.findMany({
      where: {
        assignedToId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,

        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),

    prisma.rescueRequest.findMany({
      where: {
        rescuerId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        status: true,
        createdAt: true,

        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
  ]);

  const projectIds = projectMemberships.map(
    (membership) => membership.projectId
  );

  const joinedProjectRows =
    projectIds.length > 0
      ? await prisma.project.findMany({
          where: {
            id: {
              in: projectIds,
            },
          },
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        })
      : [];

  const projectMap = new Map(
    joinedProjectRows.map((project) => [
      project.id,
      project,
    ])
  );

  const activeProjects = projectMemberships.flatMap(
    (membership) => {
      const project = projectMap.get(membership.projectId);

      if (!project) {
        return [];
      }

      if (
        project.status !== "DEVELOPMENT" &&
        project.status !== "STUCK"
      ) {
        return [];
      }

      return [project];
    }
  );

  return {
    role: "RESCUER",

    overview: {
      totalProjects: joinedProjects,
      activeProjects: activeProjects.length,
      acceptedRequests,
      totalTasks: assignedTasks,
      completedTasks,
      pendingRequests: Math.max(
        rescueRequests - acceptedRequests,
        0
      ),
    },

    recentProjects: activeProjects.map((project) => ({
      id: project.id,
      title: project.name,
      description: project.description,
      status: project.status,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    })),

    activeProjects: activeProjects.map((project) => ({
      id: project.id,
      title: project.name,
      description: project.description,
      status: project.status,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    })),

    tasks: taskRows.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,

      project: task.project
        ? {
            id: task.project.id,
            title: task.project.name,
          }
        : undefined,
    })),

    rescueRequests: requestRows.map((request) => ({
      id: request.id,
      status: request.status,
      createdAt: request.createdAt.toISOString(),

      project: request.project
        ? {
            id: request.project.id,
            title: request.project.name,
          }
        : undefined,
    })),

    progressUpdates,
  };
};
import prisma from "../../config/db";

interface CreateProjectData {
  categoryId: string;
  name: string;
  description: string;
  targetUsers?: string;
  type: "WEB" | "MOBILE" | "DESKTOP" | "API" | "OTHER";
  frontend?: string;
  backend?: string;
  database?: string;
  apis?: string;
  authentication?: string;
  deployment?: string;
  repositoryUrl?: string;
  otherTechnologies?: string;
  completionPercentage?: number;
  lastDevelopmentDate?: Date;
  knownBugs?: string;
  unfinishedFeatures?: string;
  currentBlockers?: string;
  existingDocumentation?: string;
  abandonmentReasons?: string;
  abandonmentExplanation?: string;
}

interface ProjectQuery {
  search?: string;
  categoryId?: string;
  type?: "WEB" | "MOBILE" | "DESKTOP" | "API" | "OTHER";
  status?: "ABANDONED" | "DEVELOPMENT" | "STUCK" | "RESCUED";
  minReadiness?: number;
  maxReadiness?: number;
  page: number;
  limit: number;
}

export const createProject = async (
  ownerId: string,
  data: CreateProjectData
) => {
  return prisma.project.create({
    data: {
      ...data,
      ownerId,
    },
  });
};

export const getAllProjects = async (query: ProjectQuery) => {
  const {search, categoryId, type, status, minReadiness, maxReadiness, page, limit} = query;

  const skip = (page - 1) * limit;

  const where = {...(search && {OR: [
        {name: {contains: search, mode: "insensitive" as const}},
        {description: {contains: search, mode: "insensitive" as const}
        }],
    }),

    ...(categoryId && {categoryId}),

    ...(type && {
      type,
    }),

    ...(status && {
      status,
    }),

    ...(minReadiness !== undefined && {
      rescueReadinessScore: {
        gte: minReadiness,
      },
    }),

    ...(maxReadiness !== undefined && {
      rescueReadinessScore: {
        lte: maxReadiness,
      },
    }),
  };

  const [projects, total] = await prisma.$transaction([
    prisma.project.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        category: true,
      },
    }),

    prisma.project.count({
      where,
    }),
  ]);

  return {
    projects,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProjectById = async (id: string) => {
  const project = await prisma.project.findUnique({
    where: {
      id,
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
      technologies: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

export const updateProject = async (
  id: string,
  ownerId: string,
  data: Partial<CreateProjectData>
) => {
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.ownerId !== ownerId) {
    throw new Error("You are not allowed to update this project");
  }

  return prisma.project.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteProject = async (
  id: string,
  ownerId: string
) => {
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.ownerId !== ownerId) {
    throw new Error("You are not allowed to delete this project");
  }

  await prisma.project.delete({
    where: {
      id,
    },
  });
};
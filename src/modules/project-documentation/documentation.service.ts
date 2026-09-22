import prisma from "../../config/db";

interface DocumentationData {
  projectOverview?: string;
  architecture?: string;
  setupInstructions?: string;
  environmentRequirements?: string;
  knownProblems?: string;
  importantDecisions?: string;
  remainingWork?: string;
  importantResources?: string;
}

export const createDocumentation = async (
  projectId: string,
  ownerId: string,
  data: DocumentationData
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.ownerId !== ownerId) {
    throw new Error(
      "You are not allowed to modify this project"
    );
  }

  const existing = await prisma.projectDocumentation.findUnique({
    where: { projectId },
  });

  if (existing) {
    throw new Error(
      "Documentation already exists for this project"
    );
  }

  return prisma.projectDocumentation.create({
    data: {
      projectId,
      ...data,
    },
  });
};

export const getDocumentation = async (projectId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const documentation =
    await prisma.projectDocumentation.findUnique({
      where: { projectId },
    });

  if (!documentation) {
    throw new Error("Project documentation not found");
  }

  return documentation;
};

export const updateDocumentation = async (
  projectId: string,
  ownerId: string,
  data: DocumentationData
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.ownerId !== ownerId) {
    throw new Error(
      "You are not allowed to modify this project"
    );
  }

  const documentation =
    await prisma.projectDocumentation.findUnique({
      where: { projectId },
    });

  if (!documentation) {
    throw new Error("Project documentation not found");
  }

  return prisma.projectDocumentation.update({
    where: { projectId },
    data,
  });
};
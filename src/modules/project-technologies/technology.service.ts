import prisma from "../../config/db";

export const getProjectTechnologies = async (projectId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return prisma.projectTechnology.findMany({
    where: { projectId },
    include: {
      skill: true,
    },
  });
};

export const addProjectTechnology = async (
  projectId: string,
  ownerId: string,
  skillId: string
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

  const skill = await prisma.skill.findUnique({
    where: { id: skillId },
  });

  if (!skill) {
    throw new Error("Skill not found");
  }

  const existing = await prisma.projectTechnology.findUnique({
    where: {
      projectId_skillId: {
        projectId,
        skillId,
      },
    },
  });

  if (existing) {
    throw new Error("Technology already added to project");
  }

  return prisma.projectTechnology.create({
    data: {
      projectId,
      skillId,
    },
    include: {
      skill: true,
    },
  });
};

export const removeProjectTechnology = async (
  projectId: string,
  ownerId: string,
  technologyId: string
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

  const technology =
    await prisma.projectTechnology.findUnique({
      where: {
        id: technologyId,
      },
    });

  if (!technology || technology.projectId !== projectId) {
    throw new Error("Technology not found");
  }

  await prisma.projectTechnology.delete({
    where: {
      id: technologyId,
    },
  });
};
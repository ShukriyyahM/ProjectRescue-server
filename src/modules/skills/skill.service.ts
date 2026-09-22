import prisma from "../../config/db";

export const getAllSkills = async () => {
  return prisma.skill.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

export const getMySkills = async (userId: string) => {
  return prisma.userSkill.findMany({
    where: {
      userId,
    },
    include: {
      skill: true,
    },
  });
};

export const addSkillToUser = async (
  userId: string,
  skillName: string
) => {
  const skill = await prisma.skill.upsert({
    where: {
      name: skillName,
    },
    update: {},
    create: {
      name: skillName,
    },
  });

  const existing = await prisma.userSkill.findUnique({
    where: {
      userId_skillId: {
        userId,
        skillId: skill.id,
      },
    },
  });

  if (existing) {
    throw new Error("Skill already added to profile");
  }

  return prisma.userSkill.create({
    data: {
      userId,
      skillId: skill.id,
    },
    include: {
      skill: true,
    },
  });
};

export const removeSkillFromUser = async (
  userId: string,
  skillId: string
) => {
  const existing = await prisma.userSkill.findUnique({
    where: {
      userId_skillId: {
        userId,
        skillId,
      },
    },
  });

  if (!existing) {
    throw new Error("Skill not found on profile");
  }

  await prisma.userSkill.delete({
    where: {
      userId_skillId: {
        userId,
        skillId,
      },
    },
  });
};
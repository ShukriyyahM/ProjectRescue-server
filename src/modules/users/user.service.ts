import prisma from "../../config/db";

interface UpdateProfileData {
  name?: string;
  bio?: string;
  location?: string;
}

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
      skills: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};


export const updateProfile = async (userId: string, data: UpdateProfileData) => {
  const { name, bio, location } = data;

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...(name !== undefined && { name }),

      profile: {
        upsert: {
          create: {
            bio,
            location,
          },
          update: {
            ...(bio !== undefined && { bio }),
            ...(location !== undefined && { location }),
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
      skills: true,
    },
  });

  return user;
};
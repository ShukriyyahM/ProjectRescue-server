import prisma from "../../config/db";
import { hashRefreshToken } from "../../utils/refresh-token";

export const logoutUser = async (
  refreshToken: string
) => {
  const tokenHash = hashRefreshToken(refreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      tokenHash,
    },
  });

  if (!storedToken) {
    return;
  }

  await prisma.refreshToken.update({
    where: {
      id: storedToken.id,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};
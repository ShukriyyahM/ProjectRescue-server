import prisma from "../../config/db";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import {
  hashRefreshToken,
  getRefreshTokenExpiry,
} from "../../utils/refresh-token";

export const refreshAccessToken = async (
  refreshToken: string
) => {
  let decoded: unknown;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new Error("Invalid or expired refresh token");
  }

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    !("userId" in decoded) ||
    !("role" in decoded)
  ) {
    throw new Error("Invalid refresh token");
  }

  const userId = String(decoded.userId);

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      tokenHash: hashRefreshToken(refreshToken),
    },
  });

  if (!storedToken) {
    throw new Error("Refresh token not found");
  }

  if (storedToken.revokedAt) {
    throw new Error("Refresh token has been revoked");
  }

  if (storedToken.expiresAt <= new Date()) {
    throw new Error("Refresh token has expired");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const newAccessToken = generateAccessToken(
    user.id,
    user.role
  );

  const newRefreshToken = generateRefreshToken(
    user.id,
    user.role
  );

  await prisma.$transaction(async (tx) => {
    await tx.refreshToken.update({
      where: {
        id: storedToken.id,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    await tx.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashRefreshToken(newRefreshToken),
        expiresAt: getRefreshTokenExpiry(),
      },
    });
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};
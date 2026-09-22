import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "../../config/db";
import { sendPasswordResetEmail } from "../../utils/email";

const RESET_TOKEN_EXPIRY_MINUTES = 15;

const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const hashResetToken = (token: string) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Do not reveal whether an email exists.
  if (!user) {
    return {
      message:
        "If an account with that email exists, a password reset token has been generated.",
    };
  }

  // Invalidate any previous unused reset tokens.
  await prisma.passwordResetToken.updateMany({
    where: {
      userId: user.id,
      usedAt: null,
    },
    data: {
      usedAt: new Date(),
    },
  });

  const resetToken = generateResetToken();
  const tokenHash = hashResetToken(resetToken);

  const expiresAt = new Date(
    Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000
  );

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

 await sendPasswordResetEmail(
   user.email,
   resetToken
  );

   return {
     message:
      "If an account with that email exists, a password reset link has been sent.",
    };
}

export const resetPassword = async (token: string, newPassword: string) => {
  const tokenHash = hashResetToken(token);

  const resetToken =
    await prisma.passwordResetToken.findUnique({
      where: {
        tokenHash,
      },
    });

  if (!resetToken) {
    throw new Error("Invalid or expired password reset token");
  }

  if (resetToken.usedAt) {
    throw new Error("Password reset token has already been used");
  }

  if (resetToken.expiresAt <= new Date()) {
    throw new Error("Invalid or expired password reset token");
  }

  const passwordHash = await bcrypt.hash(
    newPassword,
    12
  );

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: resetToken.userId,
      },
      data: {
        passwordHash,
      },
    });

    await tx.passwordResetToken.update({
      where: {
        id: resetToken.id,
      },
      data: {
        usedAt: new Date(),
      },
    });

    // Revoke all existing sessions after password reset.
    await tx.refreshToken.updateMany({
      where: {
        userId: resetToken.userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  });

  return {
    message:
      "Password has been reset successfully",
  };
};
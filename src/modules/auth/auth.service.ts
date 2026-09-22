import bcrypt from "bcryptjs";
import prisma from "../../config/db";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { hashRefreshToken, getRefreshTokenExpiry } from "../../utils/refresh-token";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "OWNER" | "RESCUER";
}

export const registerUser = async (data: RegisterData) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};

interface LoginData {
  email: string;
  password: string;
}

export const loginUser = async (data: LoginData) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await bcrypt.compare(
    data.password,
    user.passwordHash
  );

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

 const accessToken = generateAccessToken(
  user.id,
  user.role
);

const refreshToken = generateRefreshToken(
  user.id,
  user.role
);

await prisma.refreshToken.create({
  data: {
    userId: user.id,
    tokenHash: hashRefreshToken(refreshToken),
    expiresAt: getRefreshTokenExpiry(),
  },
});

return {
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
  accessToken,
  refreshToken,
};
}

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

if (!REFRESH_TOKEN_SECRET) {
  throw new Error("REFRESH_TOKEN_SECRET is not defined");
}

export const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign(
    {userId, role},
    JWT_SECRET,
    {expiresIn: "15m"}
  );
};

export const generateRefreshToken = (userId: string, role: string) => {
  return jwt.sign(
    {userId, role},
    REFRESH_TOKEN_SECRET,
    {expiresIn: "30d"}
  );
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};
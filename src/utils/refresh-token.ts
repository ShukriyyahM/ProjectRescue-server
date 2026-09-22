import crypto from "crypto";

export const hashRefreshToken = (token: string) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

export const getRefreshTokenExpiry = () => {
  const expiry = new Date();

  expiry.setDate(expiry.getDate() + 30);

  return expiry;
};
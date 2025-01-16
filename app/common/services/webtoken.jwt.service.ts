import jwt from "jsonwebtoken";

export const generateTokens = async (
  userId: string,
  email: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const jwtSecretKey = process.env.JWT_SECRET;
  const jwtRefreshSecretKey = process.env.JWT_REFRESH_SECRET;

  if (!jwtSecretKey || !jwtRefreshSecretKey) {
    throw new Error("JWT secrets are not defined in the environment variables");
  }

  const data = { userId, email };

  // Generate Access Token (short-lived)
  const accessToken = jwt.sign(data, jwtSecretKey, { expiresIn: "59m" });

  // Generate Refresh Token (longer-lived)
  const refreshToken = jwt.sign(data, jwtRefreshSecretKey, { expiresIn: "7d" });

  return { accessToken, refreshToken };
};

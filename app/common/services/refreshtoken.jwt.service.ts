import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Admin } from "../admin/admin.schema"
import { generateTokens } from "../services/webtoken.jwt.service";

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ success: false, message: "Refresh token is required" });
    return; // Ensure the function ends here
  }

  try {
    const jwtRefreshSecretKey = process.env.JWT_REFRESH_SECRET ?? "";

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, jwtRefreshSecretKey) as { email: string };

    // Check if the refresh token exists in the database
    const user = await Admin.findOne({ email: decoded.email, refreshToken });
    if (!user) {
      res.status(403).json({ success: false, message: "Invalid refresh token" });
      return; // Ensure the function ends here
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user.name, user.email);

    // Update the refresh token in the database
    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
  }
});

import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";

import User from "./user.schema";
import { encryption, decryption } from "../common/services/hashing.bycrypt";
import { generateTokens } from "../common/services/webtoken.jwt.service";

interface DecodedToken {
  email: string;
}

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res
        .status(400)
        .json(createResponse(null, "User already exists"));
    }

    const hashedPassword = await encryption(password);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res
      .status(201)
      .json(createResponse(newUser, "User created successfully"));
  } catch (error) {
    const errorResponse = {
      success: false,
      message: error,
      data: null,
      error_code: 500,
    };
    res.status(500).json(errorResponse);
  }
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
       res
        .status(404)
        .json(createResponse(null, "User not found"));
        return;
    }
    

    const isMatch = await decryption(password, user.password);
    if (!isMatch) {
       res
        .status(401)
        .json(createResponse(null, "Invalid credentials"));
    }

   
    const { accessToken, refreshToken } = await generateTokens(
      user._id,
      user.email
    );

    
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json(
      createResponse(
        {
          user: { id: user._id, name: user.name, email: user.email },
          accessToken,
          refreshToken,
        },
        "Login successful"
      )
    );
  } catch (error) {
    const errorResponse = {
      success: false,
      message: error,
      data: null,
      error_code: 500,
    };
    res.status(500).json(errorResponse);
  }
});

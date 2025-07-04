import { db } from "@/db";
import { refreshTokens, users } from "@/db/schema";
import { authLoginSchema, authRegistrationSchema } from "@/schema/auth-schema";
import { ApiError } from "@/utils/api-error";
import { apiResponse } from "@/utils/api-response";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt";
import { Request, Response } from "express";
import argon2 from "argon2";
import { eq } from "drizzle-orm";
import { asyncHandler } from "@/utils/async-handler";
import { parseExpiry } from "@/utils/token";
import jwt from "jsonwebtoken";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = authRegistrationSchema.parse(req.body);
    const newUser = await db
      .insert(users)
      .values({
        email: validatedData.email,
        password: await argon2.hash(validatedData.password),
      })
      .returning();
    res.status(201).json(
      apiResponse(true, "User registered successfully", {
        user: {
          id: newUser[0].id,
          email: newUser[0].email,
          role: newUser[0].role,
          createdAt: newUser[0].createdAt,
          updatedAt: newUser[0].updatedAt,
        },
      })
    );
  }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = authLoginSchema.parse(req.body);
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, validatedData.email),
  });
  if (!existingUser) {
    throw new ApiError(
      404,
      `User with email: ${validatedData.email} not found`
    );
  }
  const isPasswordCorrect = await argon2.verify(
    existingUser.password,
    validatedData.password
  );
  if (!isPasswordCorrect) {
    throw new ApiError(400, `Invalid credentials`);
  }

  // Create access & refresh tokens
  const accessToken = generateAccessToken({
    userId: existingUser.id,
    email: existingUser.email,
  });
  const refreshToken = generateRefreshToken({
    userId: existingUser.id,
    email: existingUser.email,
  });

  // Save refresh token to DB
  await db.insert(refreshTokens).values({
    token: refreshToken,
    userId: existingUser.id,
    expiresAt: new Date(
      Date.now() + parseExpiry(process.env.REFRESH_TOKEN_EXPIRES_IN || "7d")
    ).toISOString(),
  });

  // Set cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Send access token
  return res
    .status(200)
    .json(apiResponse(true, "Login successful", { accessToken }));
});

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;

    if (!token) {
      throw new ApiError(401, "Refresh token missing");
    }

    // Verify token (you may want to use jwt.verify here)
    let payload;
    try {
      payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as {
        userId: string;
      };
    } catch {
      throw new ApiError(403, "Invalid refresh token");
    }

    // Optionally, check if token is in DB
    const tokenInDb = await db.query.refreshTokens.findFirst({
      where: eq(refreshTokens.token, token),
    });

    if (!tokenInDb) {
      throw new ApiError(403, "Refresh token not found in database");
    }

    const newAccessToken = generateAccessToken(payload.userId);
    const newRefreshToken = generateRefreshToken(payload.userId);

    // Update DB: replace old token
    await db.insert(refreshTokens).values({
      token: newRefreshToken,
      userId: payload.userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // Optionally delete old token (clean up)
    await db.delete(refreshTokens).where(eq(refreshTokens.token, token));

    // Set new cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(
      apiResponse(true, "Access token refreshed", {
        accessToken: newAccessToken,
      })
    );
  }
);

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (token) {
    await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json(apiResponse(true, "Logged out successfully"));
});

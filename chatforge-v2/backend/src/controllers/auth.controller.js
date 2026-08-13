import jwt from "jsonwebtoken";
import ms from "ms";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: ms(process.env.JWT_REFRESH_EXPIRY || "7d"),
};

// Only the fields the frontend is allowed to see - never the password hash
// or the raw refreshToken.
const toPublicUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  bio: user.bio,
});

const issueTokensAndRespond = async (res, user, statusCode, message) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  return res
    .status(statusCode)
    .json(
      new ApiResponse(
        statusCode,
        { user: toPublicUser(user), accessToken },
        message,
      ),
    );
};

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    const field = existingUser.email === email ? "email" : "username";
    throw new ApiError(409, `An account with this ${field} already exists`);
  }

  const user = await User.create({ username, email, password });

  return issueTokensAndRespond(res, user, 201, "Registered successfully");
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    // Same message either way - don't reveal whether the email exists.
    throw new ApiError(401, "Invalid email or password");
  }

  user.isOnline = true;

  return issueTokensAndRespond(res, user, 200, "Logged in successfully");
});

export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $unset: { refreshToken: 1 },
    isOnline: false,
    lastSeen: new Date(),
  });

  res.clearCookie("refreshToken", refreshCookieOptions);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  let decoded;
  try {
    decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new ApiError(401, "Refresh token expired or invalid");
  }

  const user = await User.findById(decoded.userId).select("+refreshToken");

  // Comparing against the stored token (not just verifying the signature)
  // means a logged-out or rotated token can't be replayed even if it
  // hasn't technically expired yet.
  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is invalid or has been revoked");
  }

  return issueTokensAndRespond(res, user, 200, "Access token refreshed");
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: toPublicUser(req.user) },
        "Current user fetched",
      ),
    );
});

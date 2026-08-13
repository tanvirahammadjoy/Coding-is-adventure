import User from "../models/User.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const searchUsers = asyncHandler(async (req, res) => {
  const { q = "" } = req.query;

  const filter = { _id: { $ne: req.user._id } };
  const trimmed = q.trim();
  if (trimmed) {
    filter.$or = [
      { username: { $regex: trimmed, $options: "i" } },
      { email: { $regex: trimmed, $options: "i" } },
    ];
  }

  const users = await User.find(filter)
    .select("username email avatar isOnline")
    .limit(20);

  return res.status(200).json(new ApiResponse(200, { users }, "Users fetched"));
});

import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { before, limit = 30 } = req.query;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new ApiError(404, "Conversation not found");
  if (!conversation.hasParticipant(req.user._id)) {
    throw new ApiError(403, "You're not a participant of this conversation");
  }

  const query = { conversation: conversationId };
  // Cursor pagination on createdAt: robust against new messages arriving
  // while the user is scrolling up through history, unlike offset-based
  // paging where inserts shift every later page by one.
  if (before) {
    query.createdAt = { $lt: new Date(before) };
  }

  const messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(Math.min(Number(limit) || 30, 100))
    .populate("sender", "username avatar")
    .populate("replyTo", "content sender isDeleted");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { messages: messages.reverse() },
        "Messages fetched",
      ),
    );
});

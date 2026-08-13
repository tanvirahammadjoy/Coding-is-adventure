import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const PARTICIPANT_FIELDS = "username avatar isOnline lastSeen";

// Every participant's open tabs get told about a brand-new conversation
// over their `user:{id}` room - including the creator, since their own
// socket also needs to join the new room before messages will reach it.
const broadcastNewConversation = (req, conversation) => {
  const io = req.app.get("io");
  conversation.participants.forEach((p) => {
    io.to(`user:${p._id}`).emit("conversation:new", conversation);
  });
};

export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .sort({ updatedAt: -1 })
    .populate("participants", PARTICIPANT_FIELDS)
    .populate("lastMessage");

  // One count query per conversation, run in parallel - fine at the scale
  // a single user's conversation list actually reaches. At real product
  // scale this becomes a single aggregation ($lookup + $group) instead.
  const conversationsWithUnread = await Promise.all(
    conversations.map(async (c) => {
      const unreadCount = await Message.countDocuments({
        conversation: c._id,
        sender: { $ne: req.user._id },
        "readBy.user": { $ne: req.user._id },
        isDeleted: false,
      });
      return { ...c.toObject(), unreadCount };
    }),
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { conversations: conversationsWithUnread },
        "Conversations fetched",
      ),
    );
});

export const getConversationById = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id).populate(
    "participants",
    PARTICIPANT_FIELDS,
  );

  if (!conversation) throw new ApiError(404, "Conversation not found");
  if (!conversation.hasParticipant(req.user._id)) {
    throw new ApiError(403, "You're not a participant of this conversation");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { conversation }, "Conversation fetched"));
});

export const startDirectConversation = asyncHandler(async (req, res) => {
  const { userId: otherUserId } = req.body;

  if (otherUserId === req.user._id.toString()) {
    throw new ApiError(400, "You can't start a conversation with yourself");
  }

  const otherUser = await User.findById(otherUserId);
  if (!otherUser) throw new ApiError(404, "User not found");

  // Reuse the existing direct conversation between these two people if
  // one exists, rather than spawning a duplicate every time someone clicks.
  let conversation = await Conversation.findOne({
    type: "direct",
    participants: { $all: [req.user._id, otherUserId], $size: 2 },
  });

  let isNew = false;
  if (!conversation) {
    conversation = await Conversation.create({
      type: "direct",
      participants: [req.user._id, otherUserId],
    });
    isNew = true;
  }

  conversation = await conversation.populate(
    "participants",
    PARTICIPANT_FIELDS,
  );

  if (isNew) broadcastNewConversation(req, conversation);

  return res
    .status(isNew ? 201 : 200)
    .json(
      new ApiResponse(
        isNew ? 201 : 200,
        { conversation },
        "Conversation ready",
      ),
    );
});

export const createGroupConversation = asyncHandler(async (req, res) => {
  const { groupName, participantIds } = req.body;

  const uniqueParticipantIds = [
    ...new Set([...participantIds, req.user._id.toString()]),
  ];
  if (uniqueParticipantIds.length < 3) {
    throw new ApiError(400, "A group needs at least 2 other members");
  }

  let conversation = await Conversation.create({
    type: "group",
    groupName,
    participants: uniqueParticipantIds,
    admins: [req.user._id],
    createdBy: req.user._id,
  });

  conversation = await conversation.populate(
    "participants",
    PARTICIPANT_FIELDS,
  );

  broadcastNewConversation(req, conversation);

  return res
    .status(201)
    .json(new ApiResponse(201, { conversation }, "Group created"));
});

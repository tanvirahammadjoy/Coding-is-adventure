import Conversation from "../models/Conversation.js";
import User from "../models/User.js";
import { onlineUsers } from "../sockets/index.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const PARTICIPANT_FIELDS = "username avatar isOnline lastSeen";

const loadGroup = async (conversationId, userId) => {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new ApiError(404, "Conversation not found");
  if (conversation.type !== "group")
    throw new ApiError(400, "Not a group conversation");
  if (!conversation.hasParticipant(userId)) {
    throw new ApiError(403, "You're not a participant of this group");
  }
  return conversation;
};

const isAdmin = (conversation, userId) =>
  conversation.admins.some((a) => a.toString() === userId.toString());

const notifyUsers = (req, userIds, event, payload) => {
  const io = req.app.get("io");
  userIds.forEach((id) => io.to(`user:${id}`).emit(event, payload));
};

const broadcastToRoom = (req, conversationId, event, payload) => {
  req.app.get("io").to(conversationId.toString()).emit(event, payload);
};

// A departed member's live sockets need to actually leave the Socket.io
// room, or they'd keep receiving messages from a group they're no longer
// in until their next reconnect.
const evictFromRoom = (req, userId, conversationId) => {
  const io = req.app.get("io");
  const socketIds = onlineUsers.get(userId.toString());
  if (!socketIds) return;
  socketIds.forEach((socketId) => {
    io.sockets.sockets.get(socketId)?.leave(conversationId.toString());
  });
};

export const updateGroupInfo = asyncHandler(async (req, res) => {
  const conversation = await loadGroup(req.params.id, req.user._id);
  if (!isAdmin(conversation, req.user._id)) {
    throw new ApiError(403, "Only group admins can update group info");
  }

  const { groupName, groupDescription, groupAvatar } = req.body;
  if (groupName !== undefined) conversation.groupName = groupName;
  if (groupDescription !== undefined)
    conversation.groupDescription = groupDescription;
  if (groupAvatar !== undefined) conversation.groupAvatar = groupAvatar;
  await conversation.save();

  const populated = await conversation.populate(
    "participants",
    PARTICIPANT_FIELDS,
  );
  broadcastToRoom(req, conversation._id, "conversation:updated", populated);

  return res
    .status(200)
    .json(new ApiResponse(200, { conversation: populated }, "Group updated"));
});

export const addParticipants = asyncHandler(async (req, res) => {
  const conversation = await loadGroup(req.params.id, req.user._id);
  if (!isAdmin(conversation, req.user._id)) {
    throw new ApiError(403, "Only group admins can add members");
  }

  const { participantIds } = req.body;
  const existingUsers = await User.find({
    _id: { $in: participantIds },
  }).select("_id");
  if (existingUsers.length !== participantIds.length) {
    throw new ApiError(404, "One or more users not found");
  }

  const newIds = participantIds.filter(
    (id) => !conversation.hasParticipant(id),
  );
  if (newIds.length === 0) {
    throw new ApiError(400, "All selected users are already in the group");
  }

  conversation.participants.push(...newIds);
  await conversation.save();

  const populated = await conversation.populate(
    "participants",
    PARTICIPANT_FIELDS,
  );

  // Newly added members need the "brand-new conversation" flow (join the
  // room, add it to their list); everyone already in stays in the room
  // and just needs their participant list refreshed.
  notifyUsers(req, newIds, "conversation:new", populated);
  broadcastToRoom(req, conversation._id, "conversation:updated", populated);

  return res
    .status(200)
    .json(new ApiResponse(200, { conversation: populated }, "Members added"));
});

// Shared by an admin kicking someone and a member leaving on their own -
// room eviction, admin succession, and notifications are identical either way.
const removeMemberFromGroup = async (req, conversation, targetUserId) => {
  conversation.participants = conversation.participants.filter(
    (p) => p.toString() !== targetUserId,
  );
  conversation.admins = conversation.admins.filter(
    (a) => a.toString() !== targetUserId,
  );

  evictFromRoom(req, targetUserId, conversation._id);
  notifyUsers(req, [targetUserId], "conversation:removed", {
    conversationId: conversation._id,
  });

  if (conversation.participants.length === 0) {
    await conversation.deleteOne();
    return;
  }

  // A group with members but no admin is stuck - nobody left could manage
  // it - so promote whoever's been there longest among those who remain.
  if (conversation.admins.length === 0) {
    conversation.admins.push(conversation.participants[0]);
  }
  await conversation.save();

  const populated = await conversation.populate(
    "participants",
    PARTICIPANT_FIELDS,
  );
  broadcastToRoom(req, conversation._id, "conversation:updated", populated);
};

export const removeParticipant = asyncHandler(async (req, res) => {
  const conversation = await loadGroup(req.params.id, req.user._id);
  const targetUserId = req.params.userId;

  if (!isAdmin(conversation, req.user._id)) {
    throw new ApiError(403, "Only group admins can remove members");
  }
  if (!conversation.hasParticipant(targetUserId)) {
    throw new ApiError(404, "That user isn't in this group");
  }

  await removeMemberFromGroup(req, conversation, targetUserId);

  return res.status(200).json(new ApiResponse(200, {}, "Member removed"));
});

export const leaveGroup = asyncHandler(async (req, res) => {
  const conversation = await loadGroup(req.params.id, req.user._id);
  await removeMemberFromGroup(req, conversation, req.user._id.toString());
  return res.status(200).json(new ApiResponse(200, {}, "Left group"));
});

export const updateAdminStatus = asyncHandler(async (req, res) => {
  const conversation = await loadGroup(req.params.id, req.user._id);
  const targetUserId = req.params.userId;
  const { isAdmin: shouldBeAdmin } = req.body;

  if (!isAdmin(conversation, req.user._id)) {
    throw new ApiError(403, "Only group admins can change admin status");
  }
  if (!conversation.hasParticipant(targetUserId)) {
    throw new ApiError(404, "That user isn't in this group");
  }

  const currentlyAdmin = conversation.admins.some(
    (a) => a.toString() === targetUserId,
  );

  if (shouldBeAdmin && !currentlyAdmin) {
    conversation.admins.push(targetUserId);
  } else if (!shouldBeAdmin && currentlyAdmin) {
    if (conversation.admins.length === 1) {
      throw new ApiError(
        400,
        "A group needs at least one admin - promote someone else first",
      );
    }
    conversation.admins = conversation.admins.filter(
      (a) => a.toString() !== targetUserId,
    );
  }

  await conversation.save();

  const populated = await conversation.populate(
    "participants",
    PARTICIPANT_FIELDS,
  );
  broadcastToRoom(req, conversation._id, "conversation:updated", populated);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { conversation: populated }, "Admin status updated"),
    );
});

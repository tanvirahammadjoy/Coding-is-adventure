import crypto from "crypto";
import jwt from "jsonwebtoken";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

// userId -> Set<socketId>. A Set (not a single id) because one user can
// have several tabs/devices connected at once.
const onlineUsers = new Map();

const addOnlineSocket = (userId, socketId) => {
  if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
  onlineUsers.get(userId).add(socketId);
};

// Returns true if this was the user's *last* active socket - that's the
// moment they actually go offline, not every disconnect event.
const removeOnlineSocket = (userId, socketId) => {
  const sockets = onlineUsers.get(userId);
  if (!sockets) return true;
  sockets.delete(socketId);
  if (sockets.size === 0) {
    onlineUsers.delete(userId);
    return true;
  }
  return false;
};

const isUserOnline = (userId) => onlineUsers.has(userId);

const populateMessage = async (message) => {
  await message.populate("sender", "username avatar");
  if (message.replyTo)
    await message.populate("replyTo", "content sender isDeleted");
  return message;
};

// --- Call session state (in-memory, ephemeral - mirrors onlineUsers) ---
// callId -> {
//   conversationId, callType, initiator, isGroupCall,
//   activeParticipants: Map<userId, socketId>,  // who's actually connected
//   invitedUserIds: Set<userId>,                 // who's still being rung
//   connectedAt: number|null, ringTimeout
// }
const callSessions = new Map();
const CALL_RING_TIMEOUT_MS = 45000;

// Centralizes the "what do we log this call as" decision so every ending
// path (timeout, decline, hangup, disconnect) agrees, instead of each
// computing it slightly differently.
const resolveEndStatus = (session, { declinedBy } = {}) => {
  if (session.connectedAt) return "completed";
  if (declinedBy) return "declined";
  return "missed";
};

const initializeSocket = (io) => {
  const endCallSession = async (callId, status) => {
    const session = callSessions.get(callId);
    if (!session) return;
    callSessions.delete(callId);
    clearTimeout(session.ringTimeout);

    const durationSeconds = session.connectedAt
      ? Math.round((Date.now() - session.connectedAt) / 1000)
      : 0;

    let message = await Message.create({
      conversation: session.conversationId,
      sender: session.initiator,
      type: "call",
      callInfo: { callType: session.callType, status, durationSeconds },
    });
    message = await populateMessage(message);

    await Conversation.findByIdAndUpdate(session.conversationId, {
      lastMessage: message._id,
    });

    io.to(session.conversationId).emit("message:new", message);
    io.to(session.conversationId).emit("call:ended", { callId });
  };

  // Runs once per connection attempt, before 'connection' fires. A
  // missing/invalid token rejects the handshake outright.
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) return next(new Error("User no longer exists"));

      socket.userId = user._id.toString();
      next();
    } catch {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", async (socket) => {
    const { userId } = socket;
    const wasOffline = !isUserOnline(userId);
    addOnlineSocket(userId, socket.id);

    // A room named after the user (independent of any conversation) lets
    // other users reach "all of this person's open tabs" - used for
    // presence pushes, new-conversation notices, and call signaling -
    // without the server tracking raw socket ids per recipient.
    socket.join(`user:${userId}`);

    // Join a room per conversation this user's already in, so broadcasting
    // a message is just "emit to the room", the same way for a 2-person
    // DM or a 50-person group.
    const conversations = await Conversation.find({
      participants: userId,
    }).select("_id participants");
    conversations.forEach((c) => socket.join(c._id.toString()));

    // Who needs to know this user's online status, and whose status this
    // user needs on load: exactly the people who share a conversation
    // with them - not a global broadcast to every connected socket.
    const partnerIds = new Set();
    conversations.forEach((c) => {
      c.participants.forEach((p) => {
        const pid = p.toString();
        if (pid !== userId) partnerIds.add(pid);
      });
    });

    if (wasOffline) {
      await User.findByIdAndUpdate(userId, { isOnline: true });
      partnerIds.forEach((pid) => {
        io.to(`user:${pid}`).emit("presence:update", {
          userId,
          isOnline: true,
        });
      });
    }

    socket.emit("presence:initial", [...partnerIds].filter(isUserOnline));

    // --- Messaging ---
    socket.on(
      "message:send",
      async ({ conversationId, content, replyTo, attachments }, ack) => {
        try {
          const trimmedContent = content?.trim() || "";
          const hasAttachments =
            Array.isArray(attachments) && attachments.length > 0;
          if (!trimmedContent && !hasAttachments) {
            return ack?.({ error: "Message cannot be empty" });
          }

          const conversation = await Conversation.findById(conversationId);
          if (!conversation || !conversation.hasParticipant(userId)) {
            return ack?.({ error: "Not a participant of this conversation" });
          }

          let message = await Message.create({
            conversation: conversationId,
            sender: userId,
            content: trimmedContent,
            replyTo: replyTo || null,
            attachments: hasAttachments ? attachments : [],
          });
          message = await populateMessage(message);

          conversation.lastMessage = message._id;
          await conversation.save();

          io.to(conversationId).emit("message:new", message);
          ack?.({ message });
        } catch (err) {
          ack?.({ error: "Failed to send message" });
        }
      },
    );

    socket.on("message:edit", async ({ messageId, content }, ack) => {
      try {
        if (!content?.trim())
          return ack?.({ error: "Content cannot be empty" });

        const message = await Message.findById(messageId);
        if (!message) return ack?.({ error: "Message not found" });
        if (message.sender.toString() !== userId) {
          return ack?.({ error: "You can only edit your own messages" });
        }
        if (message.isDeleted)
          return ack?.({ error: "Cannot edit a deleted message" });

        message.content = content.trim();
        message.isEdited = true;
        message.editedAt = new Date();
        await message.save();
        await populateMessage(message);

        io.to(message.conversation.toString()).emit("message:updated", message);
        ack?.({ message });
      } catch {
        ack?.({ error: "Failed to edit message" });
      }
    });

    socket.on("message:delete", async ({ messageId }, ack) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) return ack?.({ error: "Message not found" });
        if (message.sender.toString() !== userId) {
          return ack?.({ error: "You can only delete your own messages" });
        }

        message.isDeleted = true;
        message.content = "";
        message.attachments = [];
        await message.save();
        await populateMessage(message);

        io.to(message.conversation.toString()).emit("message:updated", message);
        ack?.({ message });
      } catch {
        ack?.({ error: "Failed to delete message" });
      }
    });

    socket.on("message:react", async ({ messageId, emoji }, ack) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) return ack?.({ error: "Message not found" });

        const conversation = await Conversation.findById(message.conversation);
        if (!conversation || !conversation.hasParticipant(userId)) {
          return ack?.({ error: "Not a participant of this conversation" });
        }

        const existingIndex = message.reactions.findIndex(
          (r) => r.user.toString() === userId && r.emoji === emoji,
        );
        if (existingIndex > -1) {
          message.reactions.splice(existingIndex, 1);
        } else {
          message.reactions.push({ user: userId, emoji });
        }

        await message.save();
        await populateMessage(message);

        io.to(message.conversation.toString()).emit("message:updated", message);
        ack?.({ message });
      } catch {
        ack?.({ error: "Failed to react to message" });
      }
    });

    socket.on("message:read", async ({ conversationId }) => {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation || !conversation.hasParticipant(userId)) return;

      const readAt = new Date();
      await Message.updateMany(
        {
          conversation: conversationId,
          sender: { $ne: userId },
          "readBy.user": { $ne: userId },
        },
        { $push: { readBy: { user: userId, readAt } } },
      );

      socket
        .to(conversationId)
        .emit("conversation:read", { conversationId, userId, readAt });
    });

    // --- Typing indicators (broadcast to others in the room, not self) ---
    socket.on("typing:start", ({ conversationId }) => {
      socket
        .to(conversationId)
        .emit("typing:update", { conversationId, userId, isTyping: true });
    });

    socket.on("typing:stop", ({ conversationId }) => {
      socket
        .to(conversationId)
        .emit("typing:update", { conversationId, userId, isTyping: false });
    });

    socket.on("conversation:join", ({ conversationId }) => {
      socket.join(conversationId);
    });

    // --- Voice/video calls ---
    // The join/offer/answer/ice flow is identical for a 1-on-1 call and a
    // group call - a direct call is just a two-person mesh. Whoever
    // *joins* an in-progress call always creates the offer to each
    // existing peer (avoids two sides both offering at once - "glare").
    socket.on("call:invite", async ({ conversationId, callType }, ack) => {
      try {
        if (!["audio", "video"].includes(callType)) {
          return ack?.({ error: "Invalid call type" });
        }

        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.hasParticipant(userId)) {
          return ack?.({ error: "Not a participant of this conversation" });
        }

        const alreadyActive = [...callSessions.values()].some(
          (s) => s.conversationId === conversationId,
        );
        if (alreadyActive) {
          return ack?.({
            error: "A call is already active in this conversation",
          });
        }

        const callId = crypto.randomUUID();
        const otherParticipantIds = conversation.participants
          .map((p) => p.toString())
          .filter((id) => id !== userId);

        const session = {
          conversationId,
          callType,
          initiator: userId,
          isGroupCall: conversation.type === "group",
          activeParticipants: new Map([[userId, socket.id]]),
          invitedUserIds: new Set(otherParticipantIds),
          connectedAt: null,
          ringTimeout: null,
        };
        callSessions.set(callId, session);

        session.ringTimeout = setTimeout(() => {
          if (session.activeParticipants.size < 2) {
            endCallSession(callId, resolveEndStatus(session));
          }
        }, CALL_RING_TIMEOUT_MS);

        const caller = await User.findById(userId).select("username avatar");
        otherParticipantIds.forEach((pid) => {
          io.to(`user:${pid}`).emit("call:incoming", {
            callId,
            conversationId,
            callType,
            isGroupCall: session.isGroupCall,
            caller: {
              id: userId,
              username: caller.username,
              avatar: caller.avatar,
            },
          });
        });

        ack?.({ callId });
      } catch {
        ack?.({ error: "Failed to start call" });
      }
    });

    socket.on("call:accept", ({ callId }, ack) => {
      const session = callSessions.get(callId);
      if (!session || !session.invitedUserIds.has(userId)) {
        return ack?.({ error: "Call not found" });
      }

      const existingPeerIds = [...session.activeParticipants.keys()];
      session.activeParticipants.set(userId, socket.id);
      session.invitedUserIds.delete(userId);
      if (!session.connectedAt) session.connectedAt = Date.now();

      // My other open tabs should stop ringing - this one's answering.
      socket.to(`user:${userId}`).emit("call:answered-elsewhere", { callId });

      socket.emit("call:existing-peers", { callId, peerIds: existingPeerIds });
      existingPeerIds.forEach((peerId) => {
        io.to(`user:${peerId}`).emit("call:peer-joined", {
          callId,
          peerId: userId,
        });
      });

      ack?.({ success: true });
    });

    socket.on("call:decline", ({ callId }) => {
      const session = callSessions.get(callId);
      if (!session) return;

      session.invitedUserIds.delete(userId);
      io.to(session.conversationId).emit("call:declined", { callId, userId });

      // A direct call ends the moment its one invitee declines. A group
      // call only ends on a decline if nobody's left to ring *and*
      // nobody ever actually connected - otherwise it just continues
      // for whoever's already on it.
      const noOneLeftToRing = session.invitedUserIds.size === 0;
      const neverConnected = session.activeParticipants.size < 2;
      if (!session.isGroupCall || (noOneLeftToRing && neverConnected)) {
        endCallSession(
          callId,
          resolveEndStatus(session, { declinedBy: userId }),
        );
      }
    });

    // The server never inspects the SDP/candidates, just routes them to
    // the right peer - same job any signaling server does.
    socket.on("call:offer", ({ callId, to, sdp }) => {
      io.to(`user:${to}`).emit("call:offer", { callId, from: userId, sdp });
    });

    socket.on("call:answer", ({ callId, to, sdp }) => {
      io.to(`user:${to}`).emit("call:answer", { callId, from: userId, sdp });
    });

    socket.on("call:ice-candidate", ({ callId, to, candidate }) => {
      io.to(`user:${to}`).emit("call:ice-candidate", {
        callId,
        from: userId,
        candidate,
      });
    });

    socket.on("call:end", async ({ callId }) => {
      const session = callSessions.get(callId);
      if (!session) return;

      session.activeParticipants.delete(userId);
      session.invitedUserIds.delete(userId);

      if (session.activeParticipants.size === 0) {
        await endCallSession(callId, resolveEndStatus(session));
      } else {
        io.to(session.conversationId).emit("call:peer-left", {
          callId,
          peerId: userId,
        });
        // A direct call only ever has 2 people - if one leaves, it's over.
        if (!session.isGroupCall) {
          await endCallSession(callId, resolveEndStatus(session));
        }
      }
    });

    socket.on("disconnect", async () => {
      // A closed tab shouldn't leave a call "stuck" open for everyone
      // else - treat it the same as an explicit hangup/decline.
      for (const [callId, session] of callSessions) {
        if (session.activeParticipants.get(userId) === socket.id) {
          session.activeParticipants.delete(userId);
          session.invitedUserIds.delete(userId);
          if (session.activeParticipants.size === 0) {
            await endCallSession(callId, resolveEndStatus(session));
          } else {
            io.to(session.conversationId).emit("call:peer-left", {
              callId,
              peerId: userId,
            });
            if (!session.isGroupCall) {
              await endCallSession(callId, resolveEndStatus(session));
            }
          }
        } else if (session.invitedUserIds.has(userId) && !session.isGroupCall) {
          session.invitedUserIds.delete(userId);
          if (session.activeParticipants.size < 2) {
            await endCallSession(callId, "missed");
          }
        }
      }

      const wasLastSocket = removeOnlineSocket(userId, socket.id);
      if (wasLastSocket) {
        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          lastSeen: new Date(),
        });
        partnerIds.forEach((pid) => {
          io.to(`user:${pid}`).emit("presence:update", {
            userId,
            isOnline: false,
          });
        });
      }
    });
  });
};

export default initializeSocket;
export { isUserOnline, onlineUsers };

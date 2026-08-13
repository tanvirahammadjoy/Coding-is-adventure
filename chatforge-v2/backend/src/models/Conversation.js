import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      required: true,
      default: "direct",
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    // Only meaningful when type === 'group'
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    groupName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    groupAvatar: {
      type: String,
      default: "",
    },
    groupDescription: {
      type: String,
      maxlength: 200,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Denormalized pointer so conversation lists can render a preview
    // without a separate query per conversation.
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true },
);

conversationSchema.index({ participants: 1 });

conversationSchema.methods.hasParticipant = function hasParticipant(userId) {
  const targetId = userId.toString();
  // Works whether participants are raw ObjectIds (the common case) or
  // populated User documents (e.g. after .populate('participants')) -
  // p._id.toString() is reliable in both cases, whereas a populated
  // document's own .toString() isn't guaranteed to return its id.
  return this.participants.some((p) => (p?._id ?? p).toString() === targetId);
};

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;

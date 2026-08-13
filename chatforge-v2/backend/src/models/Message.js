import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    emoji: { type: String, required: true },
  },
  { _id: false },
);

const attachmentSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String }, // Cloudinary public_id, used for deletion
    type: {
      type: String,
      enum: ["image", "video", "audio", "file"],
      required: true,
    },
    fileName: { type: String },
    fileSize: { type: Number },
  },
  { _id: false },
);

const readReceiptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    readAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // 'call' messages are how a finished call shows up in the thread -
    // no new parallel history system, just another message shape.
    type: {
      type: String,
      enum: ["text", "call"],
      default: "text",
    },
    callInfo: {
      callType: { type: String, enum: ["audio", "video"] },
      status: { type: String, enum: ["completed", "missed", "declined"] },
      durationSeconds: { type: Number, default: 0 },
    },
    content: {
      type: String,
      trim: true,
    },
    attachments: [attachmentSchema],
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    reactions: [reactionSchema],
    readBy: [readReceiptSchema],
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: Date,
    // Soft delete: keeps the row (and reply references intact) but the
    // UI renders a "message deleted" placeholder instead of content.
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Conversation history is always queried "latest messages in this
// conversation", so this compound index is the one that matters most.
messageSchema.index({ conversation: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;

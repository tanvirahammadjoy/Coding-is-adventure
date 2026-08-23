import { Document, Schema, model } from "mongoose";

/**
 * Why a single unified "Launch" collection instead of one per source:
 * every connector (Product Hunt, GitHub, HN, Reddit, RSS...) speaks a
 * different shape. We normalize everything into one document shape at
 * the connector boundary, so the rest of the app (API, dashboard,
 * dedupe, classifier) never has to know where a launch came from.
 */

export type LaunchSource =
  | "producthunt"
  | "github"
  | "hackernews"
  | "reddit"
  | "rss"
  | "twitter"
  | "discord";

export type LaunchCategory =
  | "llm"
  | "agent"
  | "image_video_gen"
  | "dev_tool"
  | "voice_audio"
  | "data_rag"
  | "other";

export interface ILaunch extends Document {
  title: string;
  description: string;
  url: string;
  sourceUrl: string; // canonical link back to the origin post
  source: LaunchSource;
  sourceId: string; // the ID/slug from the origin platform — used for dedupe
  tags: string[];
  votesOrScore: number; // upvotes / stars / points — normalized "popularity" signal
  author?: string;
  publishedAt: Date;
  isAiRelevant: boolean; // set by the classifier service
  aiConfidence: number; // 0-1 score from the classifier
  category: LaunchCategory;
  fingerprint: string; // hash used for cross-source dedupe (same tool, different site)
  duplicateGroupId?: string; // shared across launches identified as the same tool
  createdAt: Date;
}

const LaunchSchema = new Schema<ILaunch>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    url: { type: String, required: true },
    sourceUrl: { type: String, required: true },
    source: {
      type: String,
      enum: [
        "producthunt",
        "github",
        "hackernews",
        "reddit",
        "rss",
        "twitter",
        "discord",
      ],
      required: true,
    },
    sourceId: { type: String, required: true },
    tags: { type: [String], default: [] },
    votesOrScore: { type: Number, default: 0 },
    author: { type: String },
    publishedAt: { type: Date, required: true },
    isAiRelevant: { type: Boolean, default: false },
    aiConfidence: { type: Number, default: 0 },
    category: {
      type: String,
      enum: [
        "llm",
        "agent",
        "image_video_gen",
        "dev_tool",
        "voice_audio",
        "data_rag",
        "other",
      ],
      default: "other",
    },
    fingerprint: { type: String, required: true },
    duplicateGroupId: { type: String, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// One document per (source, sourceId) — same connector never inserts a dupe.
LaunchSchema.index({ source: 1, sourceId: 1 }, { unique: true });
// Fingerprint index for cross-source dedupe (e.g. same launch on PH and HN).
LaunchSchema.index({ fingerprint: 1 });
// Feed queries: latest AI-relevant launches first.
LaunchSchema.index({ isAiRelevant: 1, publishedAt: -1 });
// Free-text search across title/description for the search box.
LaunchSchema.index({ title: "text", description: "text" });

export const Launch = model<ILaunch>("Launch", LaunchSchema);

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

export interface Launch {
  _id?: string;
  title: string;
  description: string;
  url: string;
  sourceUrl: string;
  source: LaunchSource;
  sourceId: string;
  tags: string[];
  votesOrScore: number;
  author?: string;
  publishedAt: string;
  isAiRelevant: boolean;
  aiConfidence: number;
  category: LaunchCategory;
  fingerprint: string;
  duplicateGroupId?: string;
}

export const SOURCE_LABELS: Record<LaunchSource, string> = {
  producthunt: "Product Hunt",
  github: "GitHub",
  hackernews: "Hacker News",
  reddit: "Reddit",
  rss: "Blog",
  twitter: "X",
  discord: "Discord",
};

export const CATEGORY_LABELS: Record<LaunchCategory, string> = {
  llm: "LLM",
  agent: "Agent",
  image_video_gen: "Image/Video Gen",
  dev_tool: "Dev Tool",
  voice_audio: "Voice/Audio",
  data_rag: "Data/RAG",
  other: "Other",
};

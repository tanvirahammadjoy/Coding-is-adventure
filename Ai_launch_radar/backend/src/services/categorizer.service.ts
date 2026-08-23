import { LaunchCategory } from "../models/Launch";

/**
 * Runs after the relevance classifier — only called on items already
 * confirmed AI-relevant, so this doesn't need an "is this AI" check,
 * just "which flavor of AI". Order matters: checked top-to-bottom,
 * first match wins, so more specific categories are listed before
 * the broader ones they could also match (e.g. "voice_audio" before
 * the more generic "dev_tool" catch-all keywords).
 */
const CATEGORY_RULES: { category: LaunchCategory; keywords: string[] }[] = [
  {
    category: "agent",
    keywords: ["agent", "agentic", "autonomous", "multi-agent", "workflow automation", "copilot"],
  },
  {
    category: "voice_audio",
    keywords: ["voice", "speech", "text-to-speech", "tts", "speech-to-text", "audio generation", "music generation"],
  },
  {
    category: "image_video_gen",
    keywords: ["text-to-image", "text-to-video", "image generation", "video generation", "diffusion", "stable diffusion", "midjourney", "upscal"],
  },
  {
    category: "data_rag",
    keywords: ["rag", "retrieval", "vector database", "vector db", "embedding", "knowledge base", "semantic search"],
  },
  {
    category: "llm",
    keywords: ["llm", "large language model", "gpt", "chatbot", "fine-tun", "prompt engineering", "language model"],
  },
  {
    category: "dev_tool",
    keywords: ["sdk", "api", "framework", "library", "cli", "developer tool", "open source", "open-source"],
  },
];

export function categorize(title: string, description: string): LaunchCategory {
  const text = `${title} ${description}`.toLowerCase();

  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      return rule.category;
    }
  }

  return "other";
}

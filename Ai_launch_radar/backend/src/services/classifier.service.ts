/**
 * Keyword/heuristic classifier — no LLM call needed for this pass.
 * Why not just call an LLM API per item? At full-coverage polling
 * (5+ sources every 10 min) you'd burn tokens on hundreds of items/day
 * just to answer "is this AI-related", most of which are an obvious
 * yes/no from the title alone. Keep this cheap; only escalate to an
 * LLM call later (Phase 2 optional upgrade) for the ambiguous middle.
 */

const STRONG_SIGNALS = [
  "llm", "gpt", "claude", "gemini", "copilot", "chatbot", "genai",
  "generative ai", "machine learning", "neural network", "transformer",
  "diffusion model", "text-to-image", "text-to-video", "rag",
  "vector database", "embedding model", "fine-tun", "agentic", "ai agent",
  "openai", "anthropic", "huggingface", "stable diffusion", "midjourney",
];

const WEAK_SIGNALS = ["ai", "ml", "model", "prompt", "automation", "assistant"];

export function classifyAiRelevance(title: string, description: string): {
  isAiRelevant: boolean;
  aiConfidence: number;
} {
  const text = `${title} ${description}`.toLowerCase();

  let score = 0;
  for (const signal of STRONG_SIGNALS) {
    if (text.includes(signal)) score += 0.35;
  }
  for (const signal of WEAK_SIGNALS) {
    // word-boundary match so "ai" doesn't match "again", "email", etc.
    const re = new RegExp(`\\b${signal}\\b`, "i");
    if (re.test(text)) score += 0.1;
  }

  const aiConfidence = Math.min(1, Number(score.toFixed(2)));
  return { isAiRelevant: aiConfidence >= 0.3, aiConfidence };
}

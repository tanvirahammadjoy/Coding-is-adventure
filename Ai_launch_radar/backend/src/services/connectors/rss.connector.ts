import Parser from "rss-parser";
import { logger } from "../../utils/logger";
import { Connector, RawLaunch } from "./types";

/**
 * Company blogs post launches before anyone reposts them elsewhere,
 * so this is often the single fastest connector. Add/remove feeds
 * freely — most AI labs and news sites publish a standard RSS feed
 * even if they don't advertise it on the page.
 */
const FEEDS: { url: string; label: string }[] = [
  { url: "https://openai.com/news/rss.xml", label: "OpenAI" },
  { url: "https://www.anthropic.com/rss.xml", label: "Anthropic" },
  { url: "https://blog.google/technology/ai/rss/", label: "Google AI" },
  { url: "https://huggingface.co/blog/feed.xml", label: "Hugging Face" },
  { url: "https://techcrunch.com/category/artificial-intelligence/feed/", label: "TechCrunch AI" },
];

const parser = new Parser();

export const rssConnector: Connector = {
  name: "rss",
  enabled: true,

  async fetch(): Promise<RawLaunch[]> {
    const results: RawLaunch[] = [];

    for (const feed of FEEDS) {
      try {
        const parsed = await parser.parseURL(feed.url);
        for (const item of parsed.items) {
          if (!item.link || !item.title) continue;
          results.push({
            title: item.title,
            description: item.contentSnippet?.slice(0, 500) ?? "",
            url: item.link,
            sourceUrl: item.link,
            source: "rss",
            sourceId: item.guid || item.link,
            tags: [feed.label],
            votesOrScore: 0, // RSS has no popularity signal
            author: item.creator || feed.label,
            publishedAt: item.isoDate ? new Date(item.isoDate) : new Date(),
          });
        }
      } catch (err) {
        logger.error("rss", `Fetch failed for ${feed.label}`, err);
      }
    }

    return results;
  },
};

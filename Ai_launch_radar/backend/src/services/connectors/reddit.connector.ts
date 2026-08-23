import axios from "axios";
import { env } from "../../config/env";
import { logger } from "../../utils/logger";
import { Connector, RawLaunch } from "./types";

/**
 * Reddit's public JSON endpoints (append .json to any listing URL)
 * don't require OAuth for read-only access — just a real User-Agent,
 * or they'll silently rate-limit/429 you. We pull "new" from a
 * curated set of AI subreddits rather than r/all, since that's where
 * actual tool launches get posted first.
 */
const SUBREDDITS = ["artificial", "MachineLearning", "LocalLLaMA", "OpenAI", "singularity"];

export const redditConnector: Connector = {
  name: "reddit",
  enabled: true,

  async fetch(): Promise<RawLaunch[]> {
    const results: RawLaunch[] = [];

    for (const sub of SUBREDDITS) {
      try {
        const res = await axios.get(`https://www.reddit.com/r/${sub}/new.json?limit=15`, {
          headers: { "User-Agent": env.redditUserAgent },
        });

        const posts = res.data?.data?.children ?? [];
        for (const post of posts) {
          const d = post.data;
          results.push({
            title: d.title,
            description: d.selftext?.slice(0, 500) ?? "",
            url: d.url_overridden_by_dest || `https://reddit.com${d.permalink}`,
            sourceUrl: `https://reddit.com${d.permalink}`,
            source: "reddit",
            sourceId: d.id,
            tags: [sub],
            votesOrScore: d.ups ?? 0,
            author: d.author,
            publishedAt: new Date(d.created_utc * 1000),
          });
        }
      } catch (err) {
        logger.error("reddit", `Fetch failed for r/${sub}`, err);
      }
    }

    return results;
  },
};

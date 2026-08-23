import axios from "axios";
import { env } from "../../config/env";
import { logger } from "../../utils/logger";
import { Connector, RawLaunch } from "./types";

/**
 * IMPORTANT: X's API v2 free tier does NOT include search/recent-tweet
 * access — that needs at least the Basic paid tier (~$100/mo as of
 * this writing, verify current pricing before committing). This
 * connector is written and ready to go the moment you add a bearer
 * token; until then `enabled` is false and the scheduler just skips it,
 * no crash, no missing data elsewhere.
 */
const QUERY = encodeURIComponent(
  '("we just launched" OR "introducing" OR "now available") (AI OR LLM OR "machine learning") -is:retweet lang:en'
);

export const twitterConnector: Connector = {
  name: "twitter",
  enabled: Boolean(env.twitterBearerToken),

  async fetch(): Promise<RawLaunch[]> {
    if (!env.twitterBearerToken) {
      logger.warn("twitter", "Skipped — TWITTER_BEARER_TOKEN not set (requires paid API tier)");
      return [];
    }

    try {
      const res = await axios.get(
        `https://api.twitter.com/2/tweets/search/recent?query=${QUERY}&max_results=25&tweet.fields=created_at,public_metrics,author_id`,
        { headers: { Authorization: `Bearer ${env.twitterBearerToken}` } }
      );

      const tweets = res.data?.data ?? [];

      return tweets.map(
        (t: any): RawLaunch => ({
          title: t.text.slice(0, 120),
          description: t.text,
          url: `https://twitter.com/i/web/status/${t.id}`,
          sourceUrl: `https://twitter.com/i/web/status/${t.id}`,
          source: "twitter",
          sourceId: t.id,
          tags: [],
          votesOrScore: (t.public_metrics?.like_count ?? 0) + (t.public_metrics?.retweet_count ?? 0),
          author: t.author_id,
          publishedAt: new Date(t.created_at),
        })
      );
    } catch (err) {
      logger.error("twitter", "Fetch failed", err);
      return [];
    }
  },
};

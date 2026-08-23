import axios from "axios";
import { logger } from "../../utils/logger";
import { Connector, RawLaunch } from "./types";

/**
 * HN's official Firebase-backed API is free, unauthenticated, and
 * generous — no key needed. We pull the "new" stories list rather
 * than "top", since top stories have already been up for hours; new
 * is closer to "the instant it was submitted".
 */
const HN_BASE = "https://hacker-news.firebaseio.com/v0";
const ITEMS_TO_CHECK = 60; // scan the newest N; filtering trims it down

export const hackerNewsConnector: Connector = {
  name: "hackernews",
  enabled: true,

  async fetch(): Promise<RawLaunch[]> {
    try {
      const idsRes = await axios.get<number[]>(`${HN_BASE}/newstories.json`);
      const ids = idsRes.data.slice(0, ITEMS_TO_CHECK);

      const items = await Promise.all(
        ids.map((id) =>
          axios
            .get(`${HN_BASE}/item/${id}.json`)
            .then((r) => r.data)
            .catch(() => null)
        )
      );

      return items
        .filter((item) => item && item.title && item.url && item.type === "story")
        .map(
          (item): RawLaunch => ({
            title: item.title,
            description: "",
            url: item.url,
            sourceUrl: `https://news.ycombinator.com/item?id=${item.id}`,
            source: "hackernews",
            sourceId: String(item.id),
            tags: [],
            votesOrScore: item.score ?? 0,
            author: item.by,
            publishedAt: new Date(item.time * 1000),
          })
        );
    } catch (err) {
      logger.error("hackernews", "Fetch failed", err);
      return [];
    }
  },
};

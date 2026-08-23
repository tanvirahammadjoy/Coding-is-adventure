import axios from "axios";
import * as cheerio from "cheerio";
import { logger } from "../../utils/logger";
import { Connector, RawLaunch } from "./types";

/**
 * GitHub never shipped an official trending API, so this scrapes the
 * public trending page (allowed by their robots.txt for this path).
 * We scope to daily trending so "new" actually means new-ish, and we
 * only request it unauthenticated — no rate-limit risk since it's a
 * plain HTML page, not the REST/GraphQL API.
 */
export const githubTrendingConnector: Connector = {
  name: "github",
  enabled: true,

  async fetch(): Promise<RawLaunch[]> {
    try {
      const res = await axios.get("https://github.com/trending?since=daily", {
        headers: { "User-Agent": "ai-launch-radar/1.0" },
      });

      const $ = cheerio.load(res.data);
      const results: RawLaunch[] = [];

      $("article.Box-row").each((_, el) => {
        const repoPath = $(el).find("h2 a").attr("href")?.trim().replace(/^\//, "");
        if (!repoPath) return;

        const description = $(el).find("p").text().trim();
        const starsText = $(el)
          .find(`a[href="/${repoPath}/stargazers"]`)
          .text()
          .trim()
          .replace(/,/g, "");
        const language = $(el).find('[itemprop="programmingLanguage"]').text().trim();

        results.push({
          title: repoPath,
          description,
          url: `https://github.com/${repoPath}`,
          sourceUrl: `https://github.com/${repoPath}`,
          source: "github",
          sourceId: repoPath,
          tags: language ? [language] : [],
          votesOrScore: Number(starsText) || 0,
          publishedAt: new Date(), // trending page has no launch date — treat "seen today" as the signal
        });
      });

      return results;
    } catch (err) {
      logger.error("github", "Fetch failed", err);
      return [];
    }
  },
};

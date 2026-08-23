import axios from "axios";
import { env } from "../../config/env";
import { logger } from "../../utils/logger";
import { Connector, RawLaunch } from "./types";

/**
 * Product Hunt's public REST API was sunset — v2 is GraphQL-only and
 * requires a developer token (free tier exists, see .env.example).
 * We query the newest posts sorted by NEWEST rather than "featured",
 * since we want launches the moment they land, not once they've
 * already trended.
 */
const QUERY = `
  query {
    posts(first: 20, order: NEWEST) {
      edges {
        node {
          id
          name
          tagline
          description
          url
          website
          votesCount
          createdAt
          topics(first: 5) { edges { node { name } } }
        }
      }
    }
  }
`;

export const productHuntConnector: Connector = {
  name: "producthunt",
  enabled: Boolean(env.productHuntToken),

  async fetch(): Promise<RawLaunch[]> {
    if (!env.productHuntToken) {
      logger.warn("producthunt", "Skipped — PRODUCTHUNT_TOKEN not set");
      return [];
    }

    try {
      const res = await axios.post(
        "https://api.producthunt.com/v2/api/graphql",
        { query: QUERY },
        { headers: { Authorization: `Bearer ${env.productHuntToken}` } }
      );

      const edges = res.data?.data?.posts?.edges ?? [];

      return edges.map((edge: any): RawLaunch => {
        const node = edge.node;
        return {
          title: node.name,
          description: node.tagline || node.description || "",
          url: node.website || node.url,
          sourceUrl: node.url,
          source: "producthunt",
          sourceId: node.id,
          tags: (node.topics?.edges ?? []).map((t: any) => t.node.name),
          votesOrScore: node.votesCount ?? 0,
          publishedAt: new Date(node.createdAt),
        };
      });
    } catch (err) {
      logger.error("producthunt", "Fetch failed", err);
      return [];
    }
  },
};

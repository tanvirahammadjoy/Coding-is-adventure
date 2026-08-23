import { Connector } from "./types";
import { productHuntConnector } from "./producthunt.connector";
import { githubTrendingConnector } from "./githubTrending.connector";
import { hackerNewsConnector } from "./hackernews.connector";
import { redditConnector } from "./reddit.connector";
import { rssConnector } from "./rss.connector";
import { twitterConnector } from "./twitter.connector";
import { discordConnector } from "./discord.connector";

// Add a new source? Write a connector matching the Connector interface,
// import it, and add it here — nothing else in the app needs to change.
export const connectors: Connector[] = [
  productHuntConnector,
  githubTrendingConnector,
  hackerNewsConnector,
  redditConnector,
  rssConnector,
  twitterConnector,
  discordConnector,
];

import { LaunchSource } from "../../models/Launch";

/**
 * Every connector normalizes its source's data into this shape before
 * handing it to the ingestion service. This is the contract that lets
 * ingestion.service.ts treat all 7 sources identically.
 */
export interface RawLaunch {
  title: string;
  description: string;
  url: string;
  sourceUrl: string;
  source: LaunchSource;
  sourceId: string;
  tags: string[];
  votesOrScore: number;
  author?: string;
  publishedAt: Date;
}

export interface Connector {
  name: LaunchSource;
  enabled: boolean; // false when required API key is missing
  fetch(): Promise<RawLaunch[]>;
}

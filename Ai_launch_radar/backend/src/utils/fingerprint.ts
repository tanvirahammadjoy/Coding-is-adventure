import crypto from "crypto";

/**
 * The same tool often launches on Product Hunt AND gets posted to HN
 * AND shows up on GitHub trending the same week. Each connector gives
 * it a different sourceId, so the unique index on (source, sourceId)
 * won't catch that. This fingerprint normalizes the title (strip
 * punctuation, lowercase, collapse whitespace) so near-identical
 * titles from different sources hash to the same value, letting the
 * ingestion service flag — not silently merge — likely duplicates.
 */
export function makeFingerprint(title: string): string {
  const normalized = title
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return crypto.createHash("sha1").update(normalized).digest("hex");
}

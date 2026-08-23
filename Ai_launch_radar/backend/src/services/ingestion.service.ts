import { Server as SocketServer } from "socket.io";
import { connectors } from "./connectors";
import { RawLaunch } from "./connectors/types";
import { classifyAiRelevance } from "./classifier.service";
import { categorize } from "./categorizer.service";
import { launchRepository } from "../repositories/launch.repository";
import { makeFingerprint } from "../utils/fingerprint";
import { logger } from "../utils/logger";

/**
 * The core pipeline, run on every cron tick:
 *   1. Fetch from every enabled connector (in parallel)
 *   2. Classify each item for AI relevance
 *   3. Upsert into Mongo (source+sourceId prevents connector-level dupes)
 *   4. For genuinely new AI-relevant docs, emit over Socket.io so the
 *      dashboard updates without the user refreshing
 *
 * `io` is optional so this module is testable/runnable without a
 * live socket server attached.
 */
export async function runIngestionCycle(io?: SocketServer): Promise<{ scanned: number; newLaunches: number }> {
  const active = connectors.filter((c) => c.enabled);
  logger.info("ingestion", `Running cycle with ${active.length}/${connectors.length} connectors enabled`);

  const results = await Promise.all(active.map((c) => safeFetch(c.name, c.fetch)));
  const rawLaunches: RawLaunch[] = results.flat();

  let newCount = 0;

  for (const raw of rawLaunches) {
    const { isAiRelevant, aiConfidence } = classifyAiRelevance(raw.title, raw.description);

    // Skip storing clearly irrelevant items — keeps the collection focused
    // and avoids the dashboard feed filling up with unrelated noise.
    if (!isAiRelevant) continue;

    const category = categorize(raw.title, raw.description);
    const fingerprint = makeFingerprint(raw.title);

    const result = await launchRepository.upsertBySourceId({
      ...raw,
      isAiRelevant,
      aiConfidence,
      category,
      fingerprint,
    });

    // rawResult + upsert: result.lastErrorObject.updatedExisting tells us
    // whether this was a genuinely new insert or a re-poll of something
    // we've already seen — that's what gates the live push.
    const wasNewInsert = result?.lastErrorObject?.updatedExisting === false;

    if (wasNewInsert) {
      newCount++;

      // Cross-source dedupe: does an existing launch from a DIFFERENT
      // source share this fingerprint? If so, group them under the
      // same duplicateGroupId (the fingerprint itself is stable and
      // collision-resistant enough to double as the group key) so the
      // dashboard can later show "also seen on X" instead of two
      // unrelated cards for the same tool.
      const match = await launchRepository.findRecentCrossSourceMatch(fingerprint, raw.source);
      const newId = result?.lastErrorObject?.upserted;

      if (match && newId) {
        const groupId = match.duplicateGroupId ?? match.fingerprint;
        await launchRepository.setDuplicateGroupId(String(newId), groupId);
        if (!match.duplicateGroupId) {
          await launchRepository.setDuplicateGroupId(String(match._id), groupId);
        }
        logger.info("ingestion", `Linked cross-source duplicate: "${raw.title}" (${raw.source} ↔ ${match.source})`);
      }

      if (io) io.emit("launch:new", { ...raw, isAiRelevant, aiConfidence, category, fingerprint });
    }
  }

  logger.info("ingestion", `Cycle complete: ${rawLaunches.length} scanned, ${newCount} new AI launches`);
  return { scanned: rawLaunches.length, newLaunches: newCount };
}

async function safeFetch(name: string, fn: () => Promise<RawLaunch[]>): Promise<RawLaunch[]> {
  try {
    return await fn();
  } catch (err) {
    // A single connector failing (network blip, API change) should
    // never take down the whole cycle — log and move on.
    logger.error("ingestion", `Connector "${name}" threw unexpectedly`, err);
    return [];
  }
}

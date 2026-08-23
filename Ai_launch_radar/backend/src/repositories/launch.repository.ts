import { Launch, ILaunch, LaunchSource, LaunchCategory } from "../models/Launch";

/**
 * Repository layer: the ONLY place in the app that issues Mongoose
 * queries. Services call this instead of importing the model directly.
 * If we ever swap Mongo for Postgres, only this file changes.
 */

export interface LaunchFilters {
  source?: LaunchSource;
  category?: LaunchCategory;
  isAiRelevant?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export const launchRepository = {
  async upsertBySourceId(data: Partial<ILaunch> & { source: LaunchSource; sourceId: string }) {
    // Upsert on (source, sourceId) — this is what makes each connector
    // safe to re-run on every cron tick without creating duplicates.
    // rawResult:true is what lets the caller check
    // lastErrorObject.updatedExisting to tell "new insert" from
    // "already had this one" — Mongoose's typings don't infer that
    // return shape automatically, so it's cast explicitly here.
    return Launch.findOneAndUpdate(
      { source: data.source, sourceId: data.sourceId },
      { $setOnInsert: data },
      { upsert: true, new: false, rawResult: true }
    ) as unknown as Promise<{
      lastErrorObject?: { updatedExisting: boolean; upserted?: unknown };
      value: ILaunch | null;
    }>;
  },

  async findByFingerprint(fingerprint: string) {
    return Launch.findOne({ fingerprint });
  },

  /**
   * Looks for an existing launch with the same fingerprint (same
   * normalized title) from a DIFFERENT source, posted within the
   * lookback window. That's the "same tool, different platform" case
   * — e.g. a Product Hunt post and an HN submission for the same
   * launch a day apart. Same-source matches are already handled by
   * the (source, sourceId) upsert, so this only needs to check across
   * sources.
   */
  async findRecentCrossSourceMatch(fingerprint: string, excludeSource: LaunchSource, withinDays = 14) {
    const since = new Date(Date.now() - withinDays * 24 * 60 * 60 * 1000);
    return Launch.findOne({
      fingerprint,
      source: { $ne: excludeSource },
      publishedAt: { $gte: since },
    }).sort({ publishedAt: -1 });
  },

  async setDuplicateGroupId(id: string, duplicateGroupId: string) {
    return Launch.updateOne({ _id: id }, { $set: { duplicateGroupId } });
  },

  async list(filters: LaunchFilters) {
    const { source, category, isAiRelevant, search, page = 1, limit = 20 } = filters;

    const query: Record<string, unknown> = {};
    if (source) query.source = source;
    if (category) query.category = category;
    if (isAiRelevant !== undefined) query.isAiRelevant = isAiRelevant;
    if (search) query.$text = { $search: search };

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Launch.find(query).sort({ publishedAt: -1 }).skip(skip).limit(limit),
      Launch.countDocuments(query),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async findById(id: string) {
    return Launch.findById(id);
  },
};

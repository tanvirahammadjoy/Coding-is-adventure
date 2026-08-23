import { Launch } from "../types/launch";
import { LaunchCard } from "./LaunchCard";

interface FeedProps {
  items: Launch[];
  loading: boolean;
  error: string | null;
  liveIds: Set<string>;
}

export function Feed({ items, loading, error, liveIds }: FeedProps) {
  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p className="font-display text-ink">Signal lost</p>
        <p className="mt-1 text-sm text-muted">{error}</p>
      </div>
    );
  }

  if (loading && items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p className="font-mono text-sm text-muted">scanning…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p className="font-display text-ink">Nothing here yet</p>
        <p className="mt-1 text-sm text-muted">
          Nothing matches these filters. Try widening the source or category.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-4 space-y-2.5">
      {items.map((launch) => (
        <LaunchCard
          key={launch._id ?? `${launch.source}-${launch.sourceId}`}
          launch={launch}
          isNew={launch._id ? liveIds.has(launch._id) : false}
        />
      ))}
    </div>
  );
}

import { useCallback, useEffect, useState } from "react";
import { listLaunches } from "../lib/api";
import { useLaunchSocket } from "./useLaunchSocket";
import { Launch, LaunchCategory, LaunchSource } from "../types/launch";

export interface Filters {
  source?: LaunchSource;
  category?: LaunchCategory;
  search?: string;
}

export function useLaunchFeed(filters: Filters, enabled: boolean) {
  const [items, setItems] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const res = await listLaunches({ ...filters, limit: 40 });
      setItems(res.items);
    } catch {
      setError("Couldn't reach the radar backend. Is the API running?");
    } finally {
      setLoading(false);
    }
  }, [enabled, filters.source, filters.category, filters.search]);

  useEffect(() => {
    load();
  }, [load]);

  // Live launches only get prepended locally if they'd actually match
  // the current filters — otherwise a push while you're filtered to
  // "GitHub only" would silently inject a Reddit card.
  const handleNewLaunch = useCallback(
    (launch: Launch) => {
      const matchesSource = !filters.source || launch.source === filters.source;
      const matchesCategory = !filters.category || launch.category === filters.category;
      if (!matchesSource || !matchesCategory) return;

      setItems((prev) => {
        if (prev.some((i) => i.fingerprint === launch.fingerprint && i.source === launch.source)) {
          return prev; // already have it (e.g. from a manual refresh mid-cycle)
        }
        return [{ ...launch, _id: `live-${launch.source}-${launch.sourceId}` }, ...prev];
      });
    },
    [filters.source, filters.category]
  );

  const { connected } = useLaunchSocket(handleNewLaunch, enabled);

  return { items, loading, error, connected, reload: load };
}

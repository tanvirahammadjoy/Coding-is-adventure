// ─────────────────────────────────────────────────────────────────────────
// StatCard — a single metric tile (label, big mono number, trend delta).
// Used four times in a row on the Overview page.
// ─────────────────────────────────────────────────────────────────────────

import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  /** Percent change vs the previous period. Can be negative. */
  delta: number;
  /**
   * Which direction of `delta` counts as "good" for this particular
   * metric. E.g. requests/min going up is good ("up"), but error rate
   * going up is bad, so error rate passes "down" here.
   */
  deltaGoodDirection?: "up" | "down";
  icon: LucideIcon;
}

export function StatCard({ label, value, unit, delta, deltaGoodDirection = "up", icon: Icon }: StatCardProps) {
  const isPositive = delta >= 0;
  // Reconcile the raw sign of the delta with which direction is desirable
  // for this metric, so the color (teal vs coral) always means "good vs bad"
  // rather than always meaning "up vs down".
  const isGood = deltaGoodDirection === "up" ? isPositive : !isPositive;
  const DeltaIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      <div className="mt-3 flex items-baseline gap-1 font-mono">
        <span className="text-2xl font-semibold tabular-nums text-foreground">{value}</span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>

      <div
        className={cn(
          "mt-2 inline-flex items-center gap-0.5 text-xs font-medium",
          isGood ? "text-primary" : "text-destructive"
        )}
      >
        <DeltaIcon className="h-3 w-3" />
        {Math.abs(delta)}% vs last hour
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Overview page — the dashboard's landing view.
//
// Layout: PulseStrip hero → 4 stat cards → two-column split of a live
// events table (3/5 width) and a queue-depth panel (2/5 width).
// ─────────────────────────────────────────────────────────────────────────

import { AlertTriangle, Gauge, TimerReset, Webhook } from "lucide-react";
import { PulseStrip } from "@/components/relay/PulseStrip";
import { StatCard } from "@/components/relay/StatCard";
import { StatusDot, statusTextColor } from "@/components/relay/StatusDot";
import { recentEvents, queues } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/** Color per HTTP method, purely for quick visual scanning of the table. */
const methodColor: Record<string, string> = {
  GET: "text-primary",
  POST: "text-accent",
  PUT: "text-warn",
  DELETE: "text-destructive",
};

export function Overview() {
  return (
    <div className="flex flex-col gap-6">
      <PulseStrip />

      {/* Stat cards: each `deltaGoodDirection` is set per-metric — e.g.
          error rate going down is "good", so it gets "down" explicitly,
          while the default "up" is used for metrics like request volume. */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Requests / min" value="1,284" delta={4.2} icon={Gauge} />
        <StatCard label="Error rate" value="0.34" unit="%" delta={-0.6} icon={AlertTriangle} />
        <StatCard label="p95 latency" value="212" unit="ms" delta={-3.1} icon={TimerReset} />
        <StatCard label="Active webhooks" value="18" delta={0} icon={Webhook} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Recent events — scrollable table, capped height so the page
            doesn't grow unbounded as more rows are added. */}
        <div className="rounded-lg border border-border bg-card lg:col-span-3">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-medium text-foreground">Recent events</h2>
            <span className="text-xs text-muted-foreground">Streaming live</span>
          </div>
          <div className="max-h-[380px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-card text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-4 py-2 font-medium">Time</th>
                  <th className="px-4 py-2 font-medium">Endpoint</th>
                  <th className="px-4 py-2 font-medium">Code</th>
                  <th className="px-4 py-2 text-right font-medium">Latency</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {recentEvents.map((evt) => (
                  <tr key={evt.id} className="border-b border-border/60 last:border-0">
                    <td className="whitespace-nowrap px-4 py-2 text-muted-foreground">{evt.time}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <StatusDot status={evt.status} />
                        <span className={cn("font-semibold", methodColor[evt.method])}>{evt.method}</span>
                        <span className="truncate text-foreground/90">{evt.endpoint}</span>
                      </div>
                    </td>
                    <td className={cn("px-4 py-2", statusTextColor(evt.status))}>{evt.code}</td>
                    <td className="px-4 py-2 text-right text-muted-foreground">{evt.latencyMs}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Queue depth — each row is a labeled progress bar, depth/capacity
            expressed both as a percentage fill and as raw numbers. */}
        <div className="rounded-lg border border-border bg-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-medium text-foreground">Queue depth</h2>
            <span className="text-xs text-muted-foreground">5 queues</span>
          </div>
          <div className="flex flex-col gap-4 p-4">
            {queues.map((q) => {
              const pct = Math.min(100, Math.round((q.depth / q.capacity) * 100));
              return (
                <div key={q.name}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-mono text-foreground/90">
                      <StatusDot status={q.status} />
                      {q.name}
                    </div>
                    <span className="text-muted-foreground">
                      {q.depth} / {q.capacity}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        q.status === "ok" ? "bg-primary" : q.status === "warn" ? "bg-warn" : "bg-destructive"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

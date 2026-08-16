// ─────────────────────────────────────────────────────────────────────────
// PulseStrip — the dashboard's signature element.
//
// A live-updating "telemetry" line chart representing API request volume,
// rendered as raw SVG (no charting library needed for a single sparkline).
// Path math lives in lib/chart-utils.ts; this file owns state + rendering.
// ─────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import { generatePulseSeries } from "@/lib/mock-data";
import { buildLinePath, buildAreaPath } from "@/lib/chart-utils";

// Fixed SVG coordinate space. The viewBox scales to any container width via
// `preserveAspectRatio="none"`, so these numbers only need to keep the
// right aspect ratio, not match real pixel dimensions.
const WIDTH = 1040;
const HEIGHT = 120;
const POINT_COUNT = 64;

export function PulseStrip() {
  // Seed series computed once (useRef so it survives re-renders without
  // re-running the generator); `series` is the mutable state that the
  // interval below shifts left and appends to, creating a scrolling effect.
  const baseSeries = useRef(generatePulseSeries(POINT_COUNT));
  const [series, setSeries] = useState(baseSeries.current);
  const [reqPerMin, setReqPerMin] = useState(1284);
  const tick = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      tick.current += 1;

      // Scroll the chart: drop the oldest point, compute and push a new
      // one. Blending 40% of the previous value with 60% of the new target
      // avoids jarring jumps between ticks.
      setSeries((prev) => {
        const next = prev.slice(1);
        const last = prev[prev.length - 1];
        const wobble = Math.sin(tick.current / 2.4) * 10 + (Math.sin(tick.current * 1.7) > 0.85 ? 20 : 0);
        const value = Math.max(10, Math.min(96, Math.round(last * 0.4 + (60 + wobble) * 0.6)));
        next.push(value);
        return next;
      });

      // Independent "req/min" counter readout — not derived from the
      // chart series, just its own gentle drift so the big number and the
      // line don't move in obvious lockstep.
      setReqPerMin(() => {
        const drift = Math.round(Math.sin(tick.current / 1.8) * 40 + (tick.current % 9 === 0 ? 60 : 0));
        return Math.max(900, 1284 + drift);
      });
    }, 900);

    // Always clear the interval on unmount to avoid setState-after-unmount
    // warnings and a leaked timer.
    return () => clearInterval(id);
  }, []);

  const linePath = buildLinePath(series, WIDTH, HEIGHT);
  const areaPath = buildAreaPath(linePath, WIDTH, HEIGHT);

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card signal-grid-bg">
      <div className="flex items-start justify-between gap-6 px-6 pt-5">
        <div>
          {/* Pulsing dot: a ping animation layered under a solid dot,
              a common "live indicator" pattern done in pure CSS/Tailwind. */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Live signal · api.relay.dev</span>
          </div>

          <div className="mt-2 flex items-baseline gap-2 font-mono">
            <span className="text-4xl font-semibold tabular-nums text-foreground">
              {reqPerMin.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">req/min</span>
          </div>
        </div>

        <div className="hidden shrink-0 text-right sm:block">
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Uptime, 30d</div>
          <div className="mt-2 font-mono text-2xl font-semibold text-primary">99.982%</div>
        </div>
      </div>

      {/* preserveAspectRatio="none" lets the viewBox stretch to fill the
          container's actual width regardless of screen size. */}
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" className="mt-4 h-28 w-full">
        <defs>
          <linearGradient id="pulseFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.28" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#pulseFill)" />
        <path d={linePath} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </svg>

      <div className="h-px w-full bg-border" />
    </div>
  );
}

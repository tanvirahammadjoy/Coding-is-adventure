import { useEffect, useState } from "react";
import { CATEGORY_LABELS, Launch, SOURCE_LABELS } from "../types/launch";

const CATEGORY_ACCENT: Record<string, string> = {
  llm: "border-l-signal",
  agent: "border-l-alert",
  image_video_gen: "border-l-[#8FA8FF]",
  dev_tool: "border-l-[#C9A5FF]",
  voice_audio: "border-l-[#FFD37A]",
  data_rag: "border-l-[#7CD4E8]",
  other: "border-l-muted",
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function LaunchCard({ launch, isNew }: { launch: Launch; isNew?: boolean }) {
  // Only run the pulse animation once, right after this card mounts as
  // "new" — not on every re-render.
  const [pulse, setPulse] = useState(isNew);
  useEffect(() => {
    if (!isNew) return;
    const t = setTimeout(() => setPulse(false), 1200);
    return () => clearTimeout(t);
  }, [isNew]);

  return (
    <a
      href={launch.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`block bg-panel hover:bg-panel-raised border border-line ${
        CATEGORY_ACCENT[launch.category] ?? "border-l-muted"
      } border-l-2 rounded-lg px-4 py-3.5 transition-colors ${pulse ? "animate-pulseIn" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display font-medium text-[15px] text-ink leading-snug">
          {launch.title}
        </h3>
        <span className="font-mono text-[11px] text-muted whitespace-nowrap pt-0.5">
          {timeAgo(launch.publishedAt)}
        </span>
      </div>

      {launch.description && (
        <p className="mt-1.5 text-sm text-muted leading-relaxed line-clamp-2">
          {launch.description}
        </p>
      )}

      <div className="mt-3 flex items-center gap-2 flex-wrap font-mono text-[11px]">
        <span className="px-2 py-0.5 rounded bg-panel-raised text-muted">
          {SOURCE_LABELS[launch.source]}
        </span>
        <span className="px-2 py-0.5 rounded bg-panel-raised text-muted">
          {CATEGORY_LABELS[launch.category]}
        </span>
        {launch.votesOrScore > 0 && (
          <span className="text-muted">▲ {launch.votesOrScore}</span>
        )}
        {launch.duplicateGroupId && (
          <span className="text-signal/70">also seen elsewhere</span>
        )}
      </div>
    </a>
  );
}

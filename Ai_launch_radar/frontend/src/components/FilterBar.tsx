import { CATEGORY_LABELS, LaunchCategory, LaunchSource, SOURCE_LABELS } from "../types/launch";

interface FilterBarProps {
  source?: LaunchSource;
  category?: LaunchCategory;
  search: string;
  onSourceChange: (source?: LaunchSource) => void;
  onCategoryChange: (category?: LaunchCategory) => void;
  onSearchChange: (search: string) => void;
}

const SOURCES = Object.keys(SOURCE_LABELS) as LaunchSource[];
const CATEGORIES = Object.keys(CATEGORY_LABELS) as LaunchCategory[];

export function FilterBar({
  source,
  category,
  search,
  onSourceChange,
  onCategoryChange,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="max-w-5xl mx-auto px-6 pt-6 pb-2 space-y-3">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search launches…"
        className="w-full bg-panel border border-line rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-signal/50 focus:border-signal/50"
      />

      <div className="flex flex-wrap gap-2 items-center">
        <Pill active={!source} label="All sources" onClick={() => onSourceChange(undefined)} />
        {SOURCES.map((s) => (
          <Pill key={s} active={source === s} label={SOURCE_LABELS[s]} onClick={() => onSourceChange(s)} />
        ))}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Pill active={!category} label="All categories" onClick={() => onCategoryChange(undefined)} muted />
        {CATEGORIES.map((c) => (
          <Pill
            key={c}
            active={category === c}
            label={CATEGORY_LABELS[c]}
            onClick={() => onCategoryChange(c)}
            muted
          />
        ))}
      </div>
    </div>
  );
}

function Pill({
  active,
  label,
  onClick,
  muted,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  muted?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`font-mono text-xs px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? muted
            ? "bg-panel-raised border-muted/60 text-ink"
            : "bg-signal/10 border-signal/50 text-signal"
          : "bg-transparent border-line text-muted hover:text-ink hover:border-muted"
      }`}
    >
      {label}
    </button>
  );
}

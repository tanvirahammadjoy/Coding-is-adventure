// ─────────────────────────────────────────────────────────────────────────
// InitialsBadge — a minimal circular initials avatar.
//
// Deliberately a plain <div>, not shadcn's Avatar (@radix-ui/react-avatar).
// That package's compiled output references a conditional subpath export
// ("@radix-ui/primitive/is-development") that this project's bundler
// (Parcel, via the artifact-bundling script) cannot resolve. Since the
// only thing needed here is "circle with initials", a styled div avoids
// the dependency entirely rather than fighting version pins.
// ─────────────────────────────────────────────────────────────────────────

import { cn } from "@/lib/utils";

interface InitialsBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function InitialsBadge({ children, className }: InitialsBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full border border-border bg-secondary font-mono text-xs text-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}

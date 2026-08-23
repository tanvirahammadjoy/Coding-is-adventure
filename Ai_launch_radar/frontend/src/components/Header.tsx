interface HeaderProps {
  connected: boolean;
  totalVisible: number;
  onLogout: () => void;
}

export function Header({ connected, totalVisible, onLogout }: HeaderProps) {
  return (
    <header className="border-b border-line bg-panel/60 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Signature element: a slow rotating sweep behind a center
              dot, styled like a radar/sonar display. Doubles as the
              literal live-connection indicator — dot glows signal-green
              when the socket is connected, dims to muted grey when not. */}
          <div className="relative w-9 h-9 shrink-0">
            <div
              className="absolute inset-0 rounded-full animate-sweep"
              style={{
                background: connected
                  ? "conic-gradient(from 0deg, rgba(110,231,176,0.55), transparent 35%)"
                  : "conic-gradient(from 0deg, rgba(124,143,135,0.3), transparent 35%)",
              }}
            />
            <div className="absolute inset-[3px] rounded-full bg-base border border-line" />
            <div
              className={`absolute top-1/2 left-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                connected ? "bg-signal" : "bg-muted"
              }`}
            />
          </div>

          <div>
            <h1 className="font-display font-semibold text-lg tracking-tight text-ink">
              AI Launch Radar
            </h1>
            <p className="font-mono text-xs text-muted">
              {connected ? "live · scanning 4 sources" : "reconnecting…"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="font-mono text-xs text-muted text-right">
            <div className="text-ink text-sm font-medium">{totalVisible}</div>
            <div>in view</div>
          </div>
          <button
            onClick={onLogout}
            className="font-mono text-xs text-muted hover:text-ink border border-line rounded px-2.5 py-1.5 transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}

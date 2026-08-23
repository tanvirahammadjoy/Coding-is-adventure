import { FormEvent, useState } from "react";
import { auth } from "../lib/auth";

export function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await auth.login(password);
      onSuccess();
    } catch {
      setError("Wrong password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="relative w-8 h-8 shrink-0">
            <div
              className="absolute inset-0 rounded-full animate-sweep"
              style={{ background: "conic-gradient(from 0deg, rgba(110,231,176,0.4), transparent 35%)" }}
            />
            <div className="absolute inset-[3px] rounded-full bg-base border border-line" />
          </div>
          <h1 className="font-display font-semibold text-lg text-ink">AI Launch Radar</h1>
        </div>

        <label className="block font-mono text-xs text-muted mb-2">Access password</label>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-panel border border-line rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-signal/50 focus:border-signal/50"
          placeholder="••••••••"
        />

        {error && <p className="mt-2 text-sm text-alert">{error}</p>}

        <button
          type="submit"
          disabled={loading || !password}
          className="mt-4 w-full bg-signal/10 border border-signal/50 text-signal rounded-lg py-2.5 text-sm font-medium hover:bg-signal/15 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Checking…" : "Enter"}
        </button>
      </form>
    </div>
  );
}

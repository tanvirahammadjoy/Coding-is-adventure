// ─────────────────────────────────────────────────────────────────────────
// ThemeContext — switches between the two visual themes by toggling a
// `data-theme` attribute on <html>. Each theme's actual CSS variable
// values live in index.css; this context only tracks which one is active
// and persists the choice to localStorage (this is a UI preference, not
// a secret, so localStorage is fine here — unlike the access token).
// ─────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useEffect, useState } from "react";

export type ThemeName = "relay" | "aurora";

const STORAGE_KEY = "relay-theme";

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function readStoredTheme(): ThemeName {
  if (typeof window === "undefined") return "relay";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "aurora" ? "aurora" : "relay";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(readStoredTheme);

  // Keep the DOM attribute (which index.css selectors key off of) and
  // localStorage in sync whenever the theme changes.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  function setTheme(next: ThemeName) {
    setThemeState(next);
  }

  function toggleTheme() {
    setThemeState((prev) => (prev === "relay" ? "aurora" : "relay"));
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider.");
  return ctx;
}

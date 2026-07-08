"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "theme";
const DEFAULT_THEME: Theme = "light";
const CHANGE_EVENT = "themechange";

/**
 * The anti-FOUC script. Rendered as a plain inline `<script>` from the *server*
 * root layout `<head>` (see `layout.tsx`) so it runs before first paint without
 * tripping React 19.2's "script inside a client component" warning — the reason
 * we no longer rely on `next-themes`' own client-rendered script.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}')||'${DEFAULT_THEME}';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;d?e.classList.add('dark'):e.classList.remove('dark');e.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

const systemPrefersDark = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const resolve = (theme: Theme): ResolvedTheme =>
  theme === "system" ? (systemPrefersDark() ? "dark" : "light") : theme;

// --- External store: the persisted theme in localStorage -------------------
// Read via useSyncExternalStore so no effect-driven setState is needed and SSR
// stays consistent (server always sees the default, then the client corrects
// itself against localStorage during hydration).

const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
    mq.removeEventListener("change", onChange);
  };
};

const getSnapshot = (): Theme =>
  (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? DEFAULT_THEME;

const getServerSnapshot = (): Theme => DEFAULT_THEME;

// Toggle the `.dark` class on <html>, with transitions momentarily disabled so
// the colour swap doesn't animate (mirrors next-themes' disableTransitionOnChange).
const applyToDom = (resolved: ResolvedTheme) => {
  const el = document.documentElement;
  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode("*,*::before,*::after{transition:none !important}"),
  );
  document.head.appendChild(style);

  el.classList.toggle("dark", resolved === "dark");
  el.style.colorScheme = resolved;

  // Force a reflow, then re-enable transitions on the next frame.
  window.getComputedStyle(document.body);
  requestAnimationFrame(() => style.remove());
};

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * App-wide theme provider. Toggles the `.dark` class on <html>, which drives
 * both the shadcn/Tailwind tokens and the HeroUI theme variables defined under
 * the `.dark` selector in globals.css. Mirrors the previous next-themes setup
 * (default light, optional system, class attribute, no transition flash).
 */
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const resolvedTheme = resolve(theme);

  // Keep the DOM in sync with the store. Also re-runs when the OS preference
  // changes while the user is on "system" (subscribe listens to matchMedia).
  useEffect(() => {
    applyToDom(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem(STORAGE_KEY, next);
    // Notify this tab's store subscribers ("storage" only fires in other tabs).
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return (
    <ThemeContext value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
};

export default ThemeProvider;

"use client";

import { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";

// Decorative only — keep it out of the initial JS chunk so it never competes
// for the main thread during hydration (TBT). Loaded lazily, and only when the
// pointer/motion check below actually enables it.
const CursorEffect = dynamic(
  () => import("@hwagfu/cursor").then((m) => m.CursorEffect),
  { ssr: false },
);

/**
 * Renders the decorative cursor exactly once, and only where it makes sense:
 * - devices with a fine pointer (mouse/trackpad) — skips touch screens where
 *   the effect is pure wasted work,
 * - users who have not requested reduced motion.
 *
 * Hoisting this to the root layout also prevents the duplicate instances that
 * previously ran on the home and services pages.
 */
const MEDIA_QUERY = "(pointer: fine) and (prefers-reduced-motion: no-preference)";

const subscribe = (callback: () => void) => {
  const mql = window.matchMedia(MEDIA_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
};

export default function CursorEffectClient() {
  const enabled = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MEDIA_QUERY).matches,
    () => false,
  );

  if (!enabled) return null;
  return <CursorEffect dotColor="#808080" />;
}

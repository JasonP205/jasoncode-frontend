import { cn } from "@/lib/utils";

/**
 * The backdrop behind every page hero: a faint navy grid fading downward, a
 * navy glow, and one pink bloom off to the side (`.saas-backdrop`). Pure CSS —
 * nothing to load, nothing running.
 *
 * Place inside a `relative isolate overflow-hidden` section: the backdrop sits
 * at `-z-10` within that stacking context and never causes horizontal scroll.
 */
export default function Aura({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("saas-backdrop pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem]", className)}
    />
  );
}

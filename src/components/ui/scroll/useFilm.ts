import type { RefObject } from "react";
import { useScroll, useTransform } from "motion/react";
import { useScrub } from "./useScrub";

/** How much of the previous film's last pinned stretch the next film covers, in svh. */
export const FILM_OVERLAP = 100;

/**
 * Scroll timeline for one pinned film on the home page.
 *
 * Films follow each other without a gap: a film that `enters` sits
 * `FILM_OVERLAP` svh up over the previous one (`-mt-[100svh]` on its section)
 * and holds its frame at the top of the screen while it fades in, so its
 * opening plays over the previous film's closing instead of sliding in after
 * it. A film that `leaves` finishes its own timeline half-way through that
 * hand-over, so its last scene is still moving underneath.
 *
 * `height` is the film wrapper's height in svh. `progress` runs 0–1 over the
 * film's own scenes; spread `frame` onto the sticky frame's `style`.
 */
export function useFilm(
  ref: RefObject<HTMLElement | null>,
  height: number,
  { enters = false, leaves = false }: { enters?: boolean; leaves?: boolean },
) {
  const range = enters ? height : height - FILM_OVERLAP;
  const lead = enters ? (FILM_OVERLAP * 0.5) / range : 0;
  const tail = leaves ? (FILM_OVERLAP * 0.5) / range : 0;

  const { scrollYProgress: raw } = useScroll({
    target: ref,
    offset: [enters ? "start end" : "start start", "end end"],
  });
  // 0 → 1 while the wrapper's top travels from the bottom of the screen to the top.
  const { scrollYProgress: arrival } = useScroll({ target: ref, offset: ["start end", "start start"] });

  const progress = useTransform(raw, (value) => Math.min(1, Math.max(0, (value - lead) / (1 - lead - tail))));
  // Counter the natural scroll of the not-yet-pinned frame, so it is already
  // standing at the top of the screen for the whole hand-over.
  const y = useTransform(arrival, (value) => (enters ? `${((value - 1) * FILM_OVERLAP).toFixed(3)}svh` : "0svh"));
  const opacity = useScrub(arrival, [0.35, 1], enters ? [0, 1] : [1, 1]);
  const pointerEvents = useTransform(arrival, (value) => (!enters || value > 0.98 ? "auto" : "none"));

  return { progress, frame: { y, opacity, pointerEvents } };
}

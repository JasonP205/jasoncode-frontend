"use client";

import { useEffect } from "react";
import { play, unlock } from "@/lib/sound/engine";

/** Things that make a sound when the mouse lands on them. */
const INTERACTIVE =
  'a[href], button:not([disabled]), [role="button"], [role="tab"], [role="switch"], summary, [data-sound="hover"]';

/**
 * Site-wide sound wiring, mounted once in the root layout. Renders nothing.
 *
 * - Unlocks the audio context on the first gesture (browsers require one).
 * - A glassy tick when a mouse pointer enters a link or button. Touch and pen
 *   are skipped: a tap would play hover and press at once.
 * - A soft press on click. Controls that play their own cue (the sound and
 *   theme toggles) opt out with `data-sound="self"`.
 */
export default function UiSounds() {
  useEffect(() => {
    const onGesture = () => unlock();
    let current: Element | null = null;

    const onOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const target = (event.target as Element | null)?.closest(INTERACTIVE) ?? null;
      if (target && target !== current && !target.closest('[data-sound="self"]')) {
        play("hover");
      }
      current = target;
    };

    const onClick = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest(INTERACTIVE);
      if (target && !target.closest('[data-sound="self"]')) play("press");
    };

    window.addEventListener("pointerdown", onGesture, { capture: true, passive: true });
    window.addEventListener("keydown", onGesture, { capture: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => {
      window.removeEventListener("pointerdown", onGesture, { capture: true });
      window.removeEventListener("keydown", onGesture, { capture: true });
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, []);

  return null;
}

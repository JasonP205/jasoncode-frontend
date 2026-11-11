"use client";

import { useSyncExternalStore } from "react";
import { play, soundStore, unlock } from "@/lib/sound/engine";
import { cn } from "@/lib/utils";

interface SoundToggleProps {
  onLabel: string;
  offLabel: string;
  /** Show the word next to the bars (the hero prompt); the nav shows bars only. */
  showText?: boolean;
  className?: string;
}

export function useSoundOn() {
  return useSyncExternalStore(soundStore.subscribe, soundStore.get, soundStore.getServer);
}

/**
 * Sound on/off. Four little equaliser bars that dance while sound is on and
 * lie flat while it is off. The server always renders "off" (no storage
 * there); the store corrects it during hydration.
 */
export default function SoundToggle({ onLabel, offLabel, showText, className }: SoundToggleProps) {
  const on = useSoundOn();
  const label = on ? onLabel : offLabel;

  const toggle = () => {
    const next = !on;
    // The "off" cue has to play while sound is still on; "on" right after.
    if (!next) play("toggleOff");
    soundStore.set(next);
    unlock();
    if (next) play("toggleOn");
  };

  return (
    <button
      type="button"
      data-sound="self"
      aria-pressed={on}
      aria-label={showText ? undefined : label}
      title={label}
      onClick={toggle}
      className={cn(
        "inline-flex h-9 items-center gap-2.5 rounded-full px-2.5 text-sm text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
        showText && "px-3.5 shadow-[inset_0_0_0_1px_var(--border)]",
        className,
      )}
    >
      <span aria-hidden className="eq flex h-3.5 items-end gap-[2px]" data-on={on || undefined}>
        <i />
        <i />
        <i />
        <i />
      </span>
      {showText && <span>{label}</span>}
    </button>
  );
}

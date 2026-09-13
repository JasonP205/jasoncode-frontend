/**
 * Section tones. Each section on a page carries one hue, used only for small
 * accents: its kicker, its icons, its step numbers. Large surfaces stay neutral
 * so the colour reads as a signpost, not decoration.
 *
 * The class strings are spelled out in full (not built from `tone`) so
 * Tailwind's scanner can find them.
 */
export type Tone = "blue" | "purple" | "green" | "orange" | "pink";

export const toneText: Record<Tone, string> = {
  blue: "text-hue-blue",
  purple: "text-hue-purple",
  green: "text-hue-green",
  orange: "text-hue-orange",
  pink: "text-hue-pink",
};

/** A pale wash of the tone, for the circle behind an icon or a badge. */
export const toneSoft: Record<Tone, string> = {
  blue: "bg-hue-blue/10 dark:bg-hue-blue/15",
  purple: "bg-hue-purple/10 dark:bg-hue-purple/15",
  green: "bg-hue-green/10 dark:bg-hue-green/15",
  orange: "bg-hue-orange/10 dark:bg-hue-orange/15",
  pink: "bg-hue-pink/10 dark:bg-hue-pink/15",
};

/**
 * A faint wash of the tone fading down into the card's own fill — colour you
 * notice as warmth, not as a tinted box. Pair with a background colour class.
 */
export const toneWash: Record<Tone, string> = {
  blue: "bg-linear-to-b from-hue-blue/10 to-transparent to-70% dark:from-hue-blue/15",
  purple: "bg-linear-to-b from-hue-purple/10 to-transparent to-70% dark:from-hue-purple/15",
  green: "bg-linear-to-b from-hue-green/10 to-transparent to-70% dark:from-hue-green/15",
  orange: "bg-linear-to-b from-hue-orange/10 to-transparent to-70% dark:from-hue-orange/15",
  pink: "bg-linear-to-b from-hue-pink/10 to-transparent to-70% dark:from-hue-pink/15",
};

/** A thin ring in the tone, for the one recommended card in a set. */
export const toneRing: Record<Tone, string> = {
  blue: "ring-2 ring-hue-blue/50",
  purple: "ring-2 ring-hue-purple/50",
  green: "ring-2 ring-hue-green/50",
  orange: "ring-2 ring-hue-orange/50",
  pink: "ring-2 ring-hue-pink/50",
};

/** Order used when a list of items takes a tone each. */
export const toneCycle: Tone[] = ["blue", "purple", "green", "orange", "pink"];

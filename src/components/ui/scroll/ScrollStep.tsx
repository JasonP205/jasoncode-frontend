"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { toneText, type Tone } from "../tones";

/**
 * One step in a pinned sequence: dim until it scrolls up to the middle of the
 * screen, then fully lit — and it stays lit, so the steps already covered read
 * as done. Pair with a sticky heading beside the list.
 */
export default function ScrollStep({
  index,
  tone,
  children,
}: {
  index: number;
  /** Colours the step number; steps usually walk through the tone cycle. */
  tone: Tone;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "center 0.55"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.22, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [24, 0]);

  return (
    <motion.li
      ref={ref}
      style={{ opacity, y }}
      className="scroll-fx border-t border-border pt-6 sm:pt-8"
    >
      <span
        className={cn(
          "block text-5xl font-semibold tracking-tight tabular-nums sm:text-6xl",
          toneText[tone],
        )}
      >
        {index}
      </span>
      <p className="mt-4 text-lg leading-relaxed text-foreground sm:text-xl">{children}</p>
    </motion.li>
  );
}

"use client";

import { motion, type HTMLMotionProps } from "motion/react";

/** Apple's ease-out: a quick start that settles slowly. */
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Brings content in once as it scrolls into view.
 *
 * - `rise` (default): fades up. For headers and text.
 * - `zoom`: fades up from 96% scale. For tiles and cards in a grid, where a
 *   slight scale reads as the tile arriving rather than the text moving.
 *
 * Never wrap a hero headline in this — it is the LCP element, and it would be
 * invisible until JavaScript runs. Scroll-linked effects live in `./scroll`.
 */
export default function Reveal({
  children,
  delay = 0,
  variant = "rise",
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; variant?: "rise" | "zoom" }) {
  return (
    <motion.div
      initial={
        variant === "zoom"
          ? { opacity: 0, y: 32, scale: 0.96 }
          : { opacity: 0, y: 32 }
      }
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

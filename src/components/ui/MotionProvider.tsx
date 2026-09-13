"use client";

import { MotionConfig } from "motion/react";

/**
 * Every section fades up once as it scrolls into view — the site's one motion
 * idea. `reducedMotion="user"` drops the movement (keeping the fade) for anyone
 * who has asked their OS for less motion.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

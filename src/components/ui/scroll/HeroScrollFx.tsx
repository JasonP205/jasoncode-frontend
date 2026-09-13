"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Apple's hero exit: as the page scrolls past, the hero drifts down slower
 * than the page, shrinks a touch and fades, so the next section appears to
 * slide over it.
 *
 * Every value is the identity at scroll 0, so the server-rendered hero is
 * fully visible before any JavaScript runs — the headline is the LCP element.
 * The outer box is measured and never transformed; only the inner one moves.
 */
export default function HeroScrollFx({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <div ref={ref}>
      <motion.div style={{ opacity, scale, y }} className={cn("scroll-fx", className)}>
        {children}
      </motion.div>
    </div>
  );
}

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Image parallax inside a fixed frame: while the frame crosses the viewport,
 * the picture travels a few percent in the opposite direction, so the page
 * feels layered. The picture is pre-scaled so its edges never show.
 *
 * `className` styles the frame (size, radius, background); children fill it,
 * e.g. a `next/image` with `fill`.
 */
export default function ParallaxMedia({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={{ y, scale: 1.1 }} className="scroll-fx absolute inset-0">
        {children}
      </motion.div>
    </div>
  );
}

"use client";

import { motion, type HTMLMotionProps } from "motion/react";

interface MotionDivProps extends HTMLMotionProps<"div"> {
  children?: React.ReactNode;
}

// Render on the server too: returning null until mount leaves the wrapped
// content out of the SSR HTML, so whole sections pop in after hydration —
// a large layout shift (CLS) and invisible content for crawlers.
export default function MotionDiv({ children, variants, ...props }: MotionDivProps) {
  return (
    <motion.div variants={variants} {...props}>
      {children}
    </motion.div>
  );
}

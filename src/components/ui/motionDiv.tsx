"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { useMounted } from "@/hooks/useMounted";

interface MotionDivProps extends HTMLMotionProps<"div"> {
  children?: React.ReactNode;
}

export default function MotionDiv({ children, variants, ...props }: MotionDivProps) {
  const mounted = useMounted();
  if (!mounted) return null;

  return (
    <motion.div variants={variants} {...props}>
      {children}
    </motion.div>
  );
}

"use client";

import { motion, type HTMLMotionProps } from "motion/react";

interface MotionDivProps extends HTMLMotionProps<"div"> {
  children?: React.ReactNode;
}

export default function MotionDiv({ children, variants, ...props }: MotionDivProps) {


  return (
    <motion.div variants={variants} {...props}>
      {children}
    </motion.div>
  );
}

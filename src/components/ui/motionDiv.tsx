"use client";

import { useEffect, useState } from "react";
import { motion, type HTMLMotionProps } from "motion/react";

interface MotionDivProps extends HTMLMotionProps<"div"> {
  children?: React.ReactNode;
}

export default function MotionDiv({ children, variants, ...props }: MotionDivProps) {
  const [mouted, setMouted] = useState(false)
  useEffect(()=>{
    if (!mouted) {
      setMouted(true)
    }
  },[])
  if (!mouted) {
    return null
  }

  return (
    <motion.div variants={variants} {...props}>
      {children}
    </motion.div>
  );
}

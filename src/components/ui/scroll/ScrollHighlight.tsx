"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * A sentence that lights up word by word as it scrolls through the viewport —
 * the AirPods-page effect. Use it for one statement per page at most.
 *
 * The full text is always in the DOM (only opacity changes), so it reads the
 * same to screen readers, crawlers and anyone with reduced motion.
 */
export default function ScrollHighlight({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  // Starts when the first line enters the lower part of the screen and
  // finishes as the last line reaches the middle — the eye is always reading
  // at the point where words are turning on.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.5"],
  });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => (
        <Word
          key={`${index}-${word}`}
          progress={scrollYProgress}
          range={[index / words.length, (index + 1) / words.length]}
        >
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <>
      <motion.span style={{ opacity }} className="scroll-fx">
        {children}
      </motion.span>{" "}
    </>
  );
}

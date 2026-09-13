import { useTransform, type MotionValue } from "motion/react";

type ScrubOptions = { ease?: (value: number) => number };

/**
 * `useTransform` over a 0–1 scroll progress, with both ends pinned.
 *
 * Motion hands opacity (and clip-path / filter) scrubs to a browser
 * ViewTimeline animation. When an input range starts after 0 or stops before
 * 1, the browser fills the gap with the element's first-render value — so a
 * layer that fades out at 0.7 quietly fades back in by 1. Repeating the first
 * and last outputs at 0 and 1 closes that gap.
 */
export function useScrub(
  progress: MotionValue<number>,
  input: readonly number[],
  output: readonly number[],
  options?: ScrubOptions,
): MotionValue<number>;
export function useScrub(
  progress: MotionValue<number>,
  input: readonly number[],
  output: readonly string[],
  options?: ScrubOptions,
): MotionValue<string>;
export function useScrub(
  progress: MotionValue<number>,
  input: readonly number[],
  output: readonly (number | string)[],
  options?: ScrubOptions,
): MotionValue<number> & MotionValue<string> {
  const inputRange = [...input];
  const outputRange = [...output];
  if (inputRange[0] > 0) {
    inputRange.unshift(0);
    outputRange.unshift(outputRange[0]);
  }
  if (inputRange[inputRange.length - 1] < 1) {
    inputRange.push(1);
    outputRange.push(outputRange[outputRange.length - 1]);
  }
  // The overloads above keep numbers and strings apart for callers.
  return useTransform(progress, inputRange, outputRange, options) as unknown as MotionValue<number> & MotionValue<string>;
}

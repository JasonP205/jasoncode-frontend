"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, easeIn, motion, useScroll, useTransform, type MotionStyle, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

export type DropletPalette = {
  colors: [string, string];
  shadow: string;
  shape: string;
};

// Shared with the whirlpool film, which picks these same drops up.
export const dropletPalettes: DropletPalette[] = [
  { colors: ["#36f0c0", "#168cff"], shadow: "#168cff", shape: "44% 56% 59% 41% / 48% 45% 55% 52%" },
  { colors: ["#ffb15c", "#ff477f"], shadow: "#ff477f", shape: "53% 47% 45% 55% / 42% 52% 48% 58%" },
  { colors: ["#ff63b8", "#8157ff"], shadow: "#a64dff", shape: "47% 53% 61% 39% / 57% 41% 59% 43%" },
  { colors: ["#8e6cff", "#287dff"], shadow: "#4f66ff", shape: "55% 45% 48% 52% / 43% 57% 43% 57%" },
  { colors: ["#45edac", "#ffb449"], shadow: "#67d990", shape: "42% 58% 52% 48% / 55% 46% 54% 45%" },
];

type Orb = {
  /** Centre, in % of the hero. */
  x: number;
  y: number;
  size: string;
  palette: number;
  /** Stagger for the idle float, in seconds. */
  delay: number;
  /** How late this drop answers the pull, 0–1. Further back = later. */
  lag: number;
};

const orbs: Orb[] = [
  { x: 10, y: 22, size: "size-14 sm:size-20", palette: 0, delay: 0, lag: 0 },
  { x: 89, y: 16, size: "size-10 sm:size-14", palette: 1, delay: 1.2, lag: 0.12 },
  { x: 17, y: 74, size: "hidden size-8 sm:block sm:size-10", palette: 2, delay: 2.1, lag: 0.2 },
  { x: 90, y: 80, size: "size-16 sm:size-24", palette: 3, delay: 0.6, lag: 0.06 },
  { x: 36, y: 92, size: "hidden size-5 sm:block", palette: 4, delay: 1.7, lag: 0.28 },
];

const particles = Array.from({ length: 12 }, (_, index) => {
  const angle = (index / 12) * Math.PI * 2;
  const distance = 42 + (index % 4) * 11;
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    size: 4 + (index % 3) * 2,
    delay: (index % 4) * 0.025,
  };
});

/** How long a popped drop stays gone before a new one condenses in its place. */
const RESPAWN_MS = 2600;

/**
 * Liquid colour drops for the hero. Each one wobbles and changes shape on its
 * own (CSS), pops when tapped and slowly condenses again, and — as the hero
 * scrolls away — is drawn down to the bottom centre, where the whirlpool film
 * below takes the drops over. Decorative; frozen for reduced motion.
 */
export default function FloatingOrbs({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  return (
    <div ref={ref} className={cn("pointer-events-none absolute inset-0 z-0", className)}>
      {orbs.map((orb, index) => (
        <OrbView key={index} orb={orb} index={index} progress={scrollYProgress} />
      ))}
    </div>
  );
}

/** The glass-and-colour body of a drop, filling its box. */
export function DropletBody({
  palette,
  delay = 0,
  className,
}: {
  palette: DropletPalette;
  delay?: number;
  className?: string;
}) {
  const style: CSSProperties = {
    borderRadius: palette.shape,
    animationDelay: `-${delay}s`,
    background: `radial-gradient(circle at 28% 22%, rgba(255,255,255,.98) 0 5%, rgba(255,255,255,.55) 6%, transparent 17%), radial-gradient(circle at 66% 74%, ${palette.colors[1]} 0%, transparent 58%), linear-gradient(145deg, color-mix(in oklab, ${palette.colors[0]} 88%, white), ${palette.colors[1]})`,
    boxShadow: `inset 8px 10px 18px rgba(255,255,255,.32), inset -10px -13px 22px rgba(0,0,0,.16), 0 22px 52px -14px ${palette.shadow}, 0 0 0 1px rgba(255,255,255,.12)`,
  };

  return (
    <span
      className={cn(
        "animate-orb-liquid absolute inset-0 block overflow-hidden border border-white/35 backdrop-blur-md",
        className,
      )}
      style={style}
    >
      <span className="absolute top-[13%] left-[18%] h-[27%] w-[36%] -rotate-[24deg] rounded-[50%] bg-linear-to-br from-white/75 to-white/5 blur-[0.5px]" />
      <span className="absolute right-[13%] bottom-[14%] size-[18%] rounded-full bg-white/12 blur-[1px]" />
      <span className="absolute inset-[8%] rounded-[inherit] border-t border-l border-white/24" />
      <span
        className="animate-orb-glint absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/45 to-transparent"
        style={{ animationDelay: `-${delay * 1.7}s` }}
      />
    </span>
  );
}

function OrbView({ orb, index, progress }: { orb: Orb; index: number; progress: MotionValue<number> }) {
  const [burst, setBurst] = useState(false);
  const palette = dropletPalettes[orb.palette];
  // Drawn towards the bottom centre as the hero leaves, each at its own pace.
  // They stop short of the hero's edge and are gone before reaching it: the
  // section clips its overflow, and a drop cut in half reads as a bug.
  const pull = useTransform(progress, [orb.lag * 0.5, 0.82 + orb.lag * 0.15], [0, 1], { ease: easeIn });
  const left = useTransform(pull, [0, 1], [`${orb.x}%`, "50%"]);
  const top = useTransform(pull, [0, 1], [`${orb.y}%`, "84%"]);
  const scale = useTransform(pull, [0, 1], [1, 0.45]);
  const opacity = useTransform(pull, [0.55, 0.95], [1, 0]);

  useEffect(() => {
    if (!burst) return;
    const timer = window.setTimeout(() => setBurst(false), RESPAWN_MS);
    return () => window.clearTimeout(timer);
  }, [burst]);

  return (
    <motion.div
      style={{ left, top, scale, opacity, "--ox": `${orb.x}%`, "--oy": `${orb.y}%` } as MotionStyle}
      className={cn(
        "scroll-fx pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 motion-reduce:top-(--oy)! motion-reduce:left-(--ox)!",
        orb.size,
      )}
    >
      {/* No entrance on first paint; after a pop, the new drop condenses in
          slowly with a jelly overshoot. */}
      <AnimatePresence initial={false}>
        {!burst && (
          <motion.button
            type="button"
            aria-label={`Pop color droplet ${index + 1}`}
            initial={{ opacity: 0, scale: 0, rotate: -30 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              transition: { type: "spring", stiffness: 70, damping: 8, mass: 1.1, opacity: { duration: 0.9 } },
            }}
            exit={{
              opacity: [1, 0.95, 0],
              scale: [1, 1.18, 1.42],
              rotate: [0, -4, 12],
              filter: ["saturate(1)", "saturate(1.5)", "saturate(0.75)"],
              transition: { duration: 0.82, ease: [0.16, 1, 0.3, 1] },
            }}
            onClick={() => setBurst(true)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scaleX: 1.18, scaleY: 0.84 }}
            style={{ borderRadius: palette.shape }}
            className="group relative block size-full cursor-pointer touch-manipulation border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
          >
            <DropletBody
              palette={palette}
              delay={orb.delay}
              className="transition-[filter] duration-500 group-hover:brightness-110 group-hover:saturate-125"
            />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {burst && (
          <motion.span
            aria-hidden
            initial={{ opacity: 0.75, scale: 0.4 }}
            animate={{ opacity: 0, scale: 2.25 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute inset-[-10%] rounded-full border border-white/55 shadow-[0_0_30px_var(--drop-shadow)]"
            style={{ "--drop-shadow": palette.shadow } as CSSProperties}
          />
        )}
      </AnimatePresence>

      {burst &&
        particles.map((particle, particleIndex) => (
          <motion.span
            key={particleIndex}
            aria-hidden
            initial={{ x: 0, y: 0, opacity: 0.95, scale: 1 }}
            animate={{
              x: particle.x,
              y: particle.y,
              opacity: [0.95, 0.75, 0],
              scale: [1, 0.8, 0.15],
            }}
            transition={{ duration: 1.25, delay: particle.delay, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute top-1/2 left-1/2 rounded-full border border-white/35 shadow-[inset_1px_1px_2px_rgba(255,255,255,.7),0_4px_14px_var(--drop-shadow)]"
            style={
              {
                width: particle.size,
                height: particle.size,
                marginLeft: -particle.size / 2,
                marginTop: -particle.size / 2,
                background: particleIndex % 2 ? palette.colors[0] : palette.colors[1],
                "--drop-shadow": palette.shadow,
              } as CSSProperties
            }
          />
        ))}

      {burst && (
        <motion.span
          aria-hidden
          initial={{ opacity: 0.9, scale: 0.7 }}
          animate={{ opacity: 0, scale: 1.7 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="pointer-events-none absolute inset-[18%] rounded-full bg-white/80"
        />
      )}
    </motion.div>
  );
}

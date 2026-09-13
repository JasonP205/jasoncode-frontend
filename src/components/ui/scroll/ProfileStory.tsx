"use client";

import { useId, useRef, type ReactNode } from "react";
import {
  motion,
  easeIn,
  easeInOut,
  easeOut,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ChevronRight, Eye, MessagesSquare, ShieldCheck, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { techStack, type Tech, type TechCategory } from "@/data/tech-stack";
import Icon from "@/components/ui/icon";
import { useFilm } from "./useFilm";
import { useScrub } from "./useScrub";

export type EducationEntry = {
  period: string;
  school: string;
  degree: string;
  description: string;
  /** The year stamped on the note. */
  year: string;
};

export type PromiseEntry = { title: string; desc: string };

type ProfileStoryProps = {
  kicker: string;
  heading: string;
  summary: string;
  educationHeading: string;
  education: EducationEntry[];
  /** Timeline labels while the notes play: start years, then "now". */
  milestones: string[];
  techHeading: string;
  techNote: string;
  categories: Record<TechCategory["id"], string>;
  promiseLabel: string;
  promiseHeading: string;
  promises: PromiseEntry[];
  cvLabel: string;
};

const vivid = ["#ff375f", "#ff9f0a", "#ffd60a", "#30d158", "#64d2ff", "#0a84ff", "#bf5af2"];
const spring = { stiffness: 150, damping: 22, mass: 0.6 };

/**
 * The storyboard, in scroll progress. One place to retime the film: every
 * scene reads its window from here.
 */
const T = {
  intro: [0.01, 0.04, 0.15, 0.18],
  rightRibbon: [0.03, 0.1],
  leftRibbon: [0.045, 0.115],
  tailLag: 0.028,
  stem: [0.1, 0.125],
  hook: [0.115, 0.14],
  inflate: [0.12, 0.15],
  drop: [0.13, 0.165],
  face: [0.175, 0.19, 0.655, 0.667],
  lift: [0.2, 0.235, 0.64, 0.665],
  rays: 0.215,
  glow: [0.265, 0.3, 0.42, 0.445],
  happy: [0.27, 0.28, 0.43, 0.44],
  statement: [0.285, 0.305, 0.425, 0.445],
  likeWords: [0.3, 0.365],
  likeRest: [0.355, 0.38, 0.425, 0.445],
  edu: [0.43, 0.45, 0.635, 0.655],
  dim: [0.445, 0.465, 0.64, 0.66],
  timeline: [0.44, 0.46, 0.645, 0.665],
  note: 0.45,
  noteGap: 0.1,
  launch: 0.672,
  sky: [0.69, 0.72],
  rise: [0.7, 0.75],
  tech: [0.73, 0.75, 0.8, 0.815],
  roll: [0.74, 0.785],
  tilt: [0.785, 0.803],
  fire: 0.806,
  fireworks: 0.807,
  fireworksGap: 0.003,
  flight: 0.022,
  stars: [0.905, 0.935],
  sink: [0.9, 0.935],
  promise: [0.905, 0.93],
  promiseItem: 0.925,
  promiseGap: 0.018,
  seamOut: [0.975, 1],
} as const;

/**
 * The profile as a second product film, straight after the services one.
 * Two ribbons in Jot's colours sweep in from either side and wind into the
 * J; a drop falls and becomes its full stop, and Jot wakes up. Light pours in
 * and he says what he likes; archive notes of his schooling rise out of Jot
 * and sink back. Then the J unwinds and shoots up into the sky, where a cannon
 * rolls out and fires the tech stack into the air, and the logos settle as
 * stars above the promises. The sky follows the site theme: day or night.
 *
 * Everything drawn is decorative (`aria-hidden`). The same content lives once
 * as real markup below the film — read by screen readers and crawlers, and
 * shown instead of the film to visitors who ask for reduced motion.
 */
export default function ProfileStory({
  kicker,
  heading,
  summary,
  educationHeading,
  education,
  milestones,
  techHeading,
  techNote,
  categories,
  promiseLabel,
  promiseHeading,
  promises,
  cvLabel,
}: ProfileStoryProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Fades in while the services film's "SEO" is still on screen, so the
  // ribbons are already flying as it goes.
  const { progress, frame } = useFilm(ref, 880, { enters: true });

  // The first sentence is Jot's; the rest runs as a caption.
  const [lead, ...rest] = summary.split(/(?<=\.)\s+/);
  const shake = useScrub(progress, [T.fire - 0.002, T.fire + 0.001, T.fire + 0.005, T.fire + 0.012], [0, 6, -4, 0]);

  return (
    <section data-anchor="skills" className="relative -mt-[100svh] text-foreground motion-reduce:mt-0">
      <div ref={ref} className="relative h-[880svh] motion-reduce:hidden">
        <motion.div style={frame} className="sticky top-0 h-svh min-h-[35rem] overflow-hidden bg-background">
          <div aria-hidden className="absolute inset-0">
            <Atmosphere progress={progress} />

            <motion.div style={{ y: shake }} className="absolute inset-0">
              <TechFireworks progress={progress} />
              <Ground progress={progress} />
            </motion.div>

            <RibbonJot progress={progress} />

            <div className="absolute inset-x-0 top-[18svh] bottom-[14svh] z-30 flex items-center justify-center">
              {education.map((item, index) => (
                <ArchiveNote
                  key={item.school}
                  progress={progress}
                  item={item}
                  index={index}
                  start={T.note + index * T.noteGap}
                />
              ))}
            </div>

            <Statement progress={progress} sentence={lead} />
            <Timeline progress={progress} milestones={milestones} />

            <FilmHeader progress={progress} range={T.intro}>
              <p className="kicker text-hue-orange">{kicker}</p>
              <p className="headline-section mt-2">{heading}</p>
            </FilmHeader>
            <FilmHeader progress={progress} range={T.edu}>
              <p className="headline-section">{educationHeading}</p>
            </FilmHeader>
            <FilmHeader progress={progress} range={T.tech}>
              <p className="headline-section">{techHeading}</p>
              <p className="mx-auto mt-2 max-w-xl text-[0.95rem] leading-relaxed text-foreground/60 sm:text-lg">
                {techNote}
              </p>
            </FilmHeader>

            <PromiseFinale progress={progress} label={promiseLabel} heading={promiseHeading} promises={promises} />

            <Caption progress={progress} range={T.likeRest}>
              {rest.join(" ")}
            </Caption>
          </div>

          <div className="absolute inset-x-5 bottom-[calc(4.9rem+env(safe-area-inset-bottom))] z-50 flex items-end gap-4 md:inset-x-8 md:bottom-7">
            <div aria-hidden className="min-w-0 flex-1">
              <ProgressRail labels={[kicker, educationHeading, techHeading, promiseLabel]} progress={progress} />
            </div>
            <Link
              href="/cv"
              className="group ml-auto inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background shadow-[0_8px_30px_rgb(0_0_0/0.2)] transition-transform hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground dark:shadow-[0_8px_30px_rgb(0_0_0/0.35)]"
            >
              {cvLabel}
              <ChevronRight className="ml-1 size-5 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="sr-only motion-reduce:not-sr-only">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8 sm:py-32">
          <p className="kicker text-hue-orange">{kicker}</p>
          <h2 className="headline-section mt-2 text-foreground">{heading}</h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">{summary}</p>

          <div className="mt-14 grid gap-14 lg:grid-cols-2">
            <div>
              <h3 className="headline-card text-foreground">{educationHeading}</h3>
              <ol className="mt-6 space-y-7">
                {education.map((item) => (
                  <li key={item.school} className="border-t border-border pt-5">
                    <p className="text-sm text-muted-foreground tabular-nums">{item.period}</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">{item.school}</p>
                    <p className="mt-1 text-foreground/80">{item.degree}</p>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{item.description}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="headline-card text-foreground">{techHeading}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{techNote}</p>
              <dl className="mt-6 space-y-5">
                {techStack.map((category) => (
                  <div key={category.id} className="border-t border-border pt-4">
                    <dt className="text-sm font-semibold text-muted-foreground">{categories[category.id]}</dt>
                    <dd className="mt-1 text-foreground">{category.items.map((tech) => tech.name).join(" · ")}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <p className="kicker mt-20 text-hue-green">{promiseLabel}</p>
          <h3 className="headline-section mt-2 text-foreground">{promiseHeading}</h3>
          <ul className="mt-8 grid gap-10 sm:grid-cols-3">
            {promises.map((item) => (
              <li key={item.title}>
                <h4 className="headline-card text-foreground">{item.title}</h4>
                <p className="mt-2 leading-relaxed text-muted-foreground">{item.desc}</p>
              </li>
            ))}
          </ul>

          <Link href="/cv" className="link-more mt-14 hidden text-lg motion-reduce:inline-flex">
            {cvLabel}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>

      {/* Contact sits on the band colour; fade the film into it. */}
      <div aria-hidden className="h-[clamp(7rem,24svh,14rem)] bg-linear-to-b from-background to-band" />
    </section>
  );
}

/* ───────────────────────── frame ───────────────────────── */

// Star field for the night sky, from a fixed seed so server and client agree.
const starField = (() => {
  let seed = 20513;
  const next = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const layer = (count: number, size: number) =>
    Array.from({ length: count }, () => {
      const x = (next() * 100).toFixed(1);
      const y = (next() * 78).toFixed(1);
      const alpha = (0.35 + next() * 0.65).toFixed(2);
      return `radial-gradient(${size}px ${size}px at ${x}% ${y}%, rgba(255,255,255,${alpha}), transparent)`;
    }).join(",");
  return { small: layer(70, 1.5), large: layer(18, 2.5) };
})();

function Atmosphere({ progress }: { progress: MotionValue<number> }) {
  const warm = useScrub(progress, [0, 0.2, 0.45, 0.66], [0.2, 0.42, 0.26, 0.12]);
  const cool = useScrub(progress, [0, 0.3, 0.55, 0.66], [0.18, 0.3, 0.36, 0.12]);
  // The camera follows the ribbon up: the sky slides down into place.
  const sky = useScrub(progress, T.sky, [0, 1]);
  const skyY = useScrub(progress, [T.sky[0], T.rise[1]], ["-14svh", "0svh"], { ease: easeOut });
  // As the frame scrolls out, its lower edge settles to the plain page
  // background, so the fade into Contact below meets it without a line.
  const bottomSeam = useScrub(progress, T.seamOut, [0, 1]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        style={{ opacity: warm }}
        className="absolute -top-[25%] -left-[10%] h-[70%] w-[70%] rounded-full bg-[#ffb36b] blur-[150px] dark:bg-[#ff7a1a]"
      />
      <motion.div
        style={{ opacity: cool }}
        className="absolute top-[30%] -right-[15%] h-[70%] w-[65%] rounded-full bg-[#b69cff] blur-[150px] dark:bg-[#7d45ff]"
      />
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_center,rgba(0,0,0,.25)_0.7px,transparent_0.8px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,transparent,black_22%,black_78%,transparent)] dark:[background-image:radial-gradient(circle_at_center,rgba(255,255,255,.2)_0.7px,transparent_0.8px)]" />

      <motion.div style={{ opacity: sky, y: skyY }} className="absolute inset-x-0 -top-[14svh] bottom-0">
        <SkyBackdrop />
      </motion.div>

      <motion.div
        style={{ opacity: bottomSeam }}
        className="absolute inset-x-0 bottom-0 z-30 h-[45%] bg-linear-to-t from-background to-transparent"
      />
    </div>
  );
}

/** Day sky in light mode, night sky in dark mode. */
function SkyBackdrop() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#4f9dff_0%,#95c8ff_38%,#d3e9ff_66%,#ffe3c6_100%)] dark:bg-[linear-gradient(to_bottom,#02030a_0%,#060a22_42%,#151238_74%,#2c1840_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[62%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,196,120,.75),rgba(255,160,120,.2)_42%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,128,80,.3),rgba(191,90,242,.12)_45%,transparent_72%)]" />

      <div className="absolute inset-0 hidden dark:block" style={{ backgroundImage: starField.small }} />
      <div className="animate-twinkle absolute inset-0 hidden dark:block" style={{ backgroundImage: starField.large }} />
      <div className="absolute inset-x-[-10%] top-[8%] hidden h-[40%] rotate-[-8deg] bg-[radial-gradient(ellipse_at_center,rgba(140,120,255,.14),transparent_70%)] blur-2xl dark:block" />

      <div className="dark:hidden">
        <span className="absolute top-[16%] left-[6%] h-[9%] w-[24%] rounded-[50%] bg-white/75 blur-xl" />
        <span className="absolute top-[12%] left-[14%] h-[8%] w-[12%] rounded-[50%] bg-white/80 blur-lg" />
        <span className="absolute top-[26%] right-[4%] h-[10%] w-[28%] rounded-[50%] bg-white/70 blur-xl" />
        <span className="absolute top-[22%] right-[16%] h-[8%] w-[11%] rounded-[50%] bg-white/80 blur-lg" />
        <span className="absolute top-[44%] left-[38%] h-[6%] w-[20%] rounded-[50%] bg-white/50 blur-xl" />
      </div>
    </>
  );
}

function FilmHeader({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: readonly [number, number, number, number];
  children: ReactNode;
}) {
  const opacity = useScrub(progress, range, [0, 1, 1, 0]);
  const y = useScrub(progress, range, [18, 0, 0, -14]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-x-5 top-[clamp(4.75rem,9svh,7rem)] z-40 mx-auto max-w-4xl text-center text-foreground sm:inset-x-8"
    >
      {children}
    </motion.div>
  );
}

function Caption({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: readonly [number, number, number, number];
  children: ReactNode;
}) {
  const opacity = useScrub(progress, range, [0, 1, 1, 0]);
  const y = useScrub(progress, range, [16, 0, 0, -12]);

  return (
    <motion.p
      style={{ opacity, y }}
      className="absolute inset-x-5 bottom-[calc(9rem+env(safe-area-inset-bottom))] z-40 mx-auto max-w-2xl text-center text-[0.95rem] leading-relaxed text-balance text-foreground/70 sm:text-lg md:bottom-24"
    >
      {children}
    </motion.p>
  );
}

function ProgressRail({ labels, progress }: { labels: string[]; progress: MotionValue<number> }) {
  const width = useScrub(progress, [0, 1], ["0%", "100%"]);

  return (
    <div className="w-full max-w-[34rem] sm:w-[min(52vw,34rem)]">
      <div className="relative h-px overflow-hidden bg-foreground/15">
        <motion.span
          style={{ width }}
          className="absolute inset-y-0 left-0 bg-linear-to-r from-[#ffa24c] via-[#ff4f9a] to-[#7c5cff]"
        />
      </div>
      <div className="mt-2 hidden grid-cols-4 gap-3 text-[0.68rem] font-medium text-foreground/50 sm:grid">
        {labels.map((label, index) => (
          <span key={label} className={cn("truncate", index === 3 && "text-right")}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── ribbon Jot ───────────────────────── */

// Jot's own geometry, on its 512 grid (see Jot.tsx): the J is one round-capped
// stroke and the full stop a circle. Everything else is drawn around it.
const J_STEM = "M 300 112 V 298";
const J_HOOK = "M 124 298 A 88 88 0 0 0 300 298";
const J_WHOLE = "M 300 112 V 298 A 88 88 0 0 1 124 298";
// Ribbons that arrive tangent to where the J begins: from the top right into
// the stem, from the bottom left into the hook. They meet at the bend.
const RIGHT_RIBBON = "M 1250 420 C 1000 560 760 520 640 330 C 560 200 470 -10 380 20 C 330 36 300 60 300 112";
const LEFT_RIBBON = "M -700 560 C -420 640 -260 180 -60 250 C 60 292 124 180 124 298";
// Leaving: from the hook tip straight up, with a flourish, out of the frame.
const LAUNCH_RIBBON = "M 124 298 C 124 150 10 -40 180 -260 C 330 -450 520 -560 360 -1500";
// Jot's centre on the grid, and where the grid sits in the 1600 × 1000 stage.
const STAGE = { cx: 800, cy: 500, jx: 265, jy: 250, scale: 1.1 };
const rayAngles = [200, 243, 287, 330, 15, 58, 102, 145];
const INK = "#1d1d1f";

function RibbonJot({ progress }: { progress: MotionValue<number> }) {
  const id = useId();
  const body = `${id}-body`;
  const dot = `${id}-dot`;
  // Jot rises and shrinks to make room for the sentence, dims behind the
  // notes, then comes back to centre before launching.
  const scale = useScrub(progress, T.lift, [1, 0.62, 0.62, 1]);
  const y = useScrub(progress, T.lift, ["0svh", "-17svh", "-17svh", "0svh"]);
  const opacity = useScrub(progress, T.dim, [1, 0.28, 0.28, 1]);
  const width = useScrub(progress, T.inflate, [58, 104]);
  const face = useScrub(progress, T.face, [0, 1, 1, 0]);
  const idle = useScrub(progress, T.happy, [1, 0, 0, 1]);
  const happy = useScrub(progress, T.happy, [0, 1, 1, 0]);
  const glowOpacity = useScrub(progress, T.glow, [0, 0.75, 0.3, 0]);
  const glowScale = useScrub(progress, [T.glow[0], T.glow[1]], [0.3, 1.2]);
  const launchWidth = useScrub(progress, [T.launch, T.launch + 0.04], [104, 44]);
  const lag = T.tailLag;
  const grid = `translate(${STAGE.cx - STAGE.jx * STAGE.scale} ${STAGE.cy - STAGE.jy * STAGE.scale}) scale(${STAGE.scale}) translate(-8 6)`;

  return (
    <motion.svg
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      style={{ scale, y, opacity }}
      className="absolute inset-0 z-20 size-full overflow-visible"
    >
      <defs>
        <linearGradient id={body} gradientUnits="userSpaceOnUse" x1="330" y1="70" x2="120" y2="430">
          <stop offset="0" stopColor="#ffa24c" />
          <stop offset="0.45" stopColor="#ff4f9a" />
          <stop offset="1" stopColor="#7c5cff" />
        </linearGradient>
        <linearGradient id={dot} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2ee6a8" />
          <stop offset="1" stopColor="#2f8bff" />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor="#ff4f9a" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#7c5cff" stopOpacity="0.25" />
          <stop offset="1" stopColor="#7c5cff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <motion.circle
        cx={STAGE.cx}
        cy={STAGE.cy}
        r="420"
        fill={`url(#${id}-glow)`}
        style={{ opacity: glowOpacity, scale: glowScale }}
      />
      {rayAngles.map((angle, index) => (
        <LightRay key={angle} progress={progress} angle={angle} index={index} />
      ))}

      <g transform={grid}>
        <Ribbon
          progress={progress}
          d={RIGHT_RIBBON}
          stroke={`url(#${body})`}
          head={T.rightRibbon}
          tail={[T.rightRibbon[0] + lag, T.rightRibbon[1] + lag]}
          width={58}
          sheen
        />
        <Ribbon
          progress={progress}
          d={LEFT_RIBBON}
          stroke={`url(#${body})`}
          head={T.leftRibbon}
          tail={[T.leftRibbon[0] + lag, T.leftRibbon[1] + lag]}
          width={58}
          sheen
        />
        <Ribbon progress={progress} d={J_STEM} stroke={`url(#${body})`} head={T.stem} until={T.launch} width={width} />
        <Ribbon progress={progress} d={J_HOOK} stroke={`url(#${body})`} head={T.hook} until={T.launch} width={width} />
        {/* At launch the two halves hand over to one J that unwinds from the
            top of the stem, feeding the ribbon that shoots up. */}
        <Ribbon
          progress={progress}
          d={J_WHOLE}
          stroke={`url(#${body})`}
          from={T.launch}
          tail={[T.launch, T.launch + 0.018]}
          width={104}
        />
        <Ribbon
          progress={progress}
          d={LAUNCH_RIBBON}
          stroke={`url(#${body})`}
          head={[T.launch, T.launch + 0.026]}
          tail={[T.launch + 0.018, T.launch + 0.04]}
          ease={easeIn}
          width={launchWidth}
          sheen
        />

        <motion.g style={{ opacity: face }} className="jot jot-animate" data-mood="idle">
          <ellipse cx="276" cy="94" rx="14" ry="9" fill="#fff" opacity=".45" transform="rotate(-20 276 94)" />
          <ellipse cx="264" cy="210" rx="11" ry="8" fill="#ff3d7f" opacity=".35" />
          <ellipse cx="336" cy="210" rx="11" ry="8" fill="#ff3d7f" opacity=".35" />
          <motion.g style={{ opacity: idle }}>
            <g className="jot-eyes">
              <ellipse cx="279" cy="182" rx="11" ry="16" fill={INK} />
              <ellipse cx="321" cy="182" rx="11" ry="16" fill={INK} />
              <circle cx="282.5" cy="176" r="3.6" fill="#fff" />
              <circle cx="324.5" cy="176" r="3.6" fill="#fff" />
            </g>
            <path d="M 286 212 Q 300 227 314 212" stroke={INK} strokeWidth="8" strokeLinecap="round" fill="none" />
          </motion.g>
          <motion.g style={{ opacity: happy }}>
            <path d="M 268 187 Q 279 172 290 187" stroke={INK} strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M 310 187 Q 321 172 332 187" stroke={INK} strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M 284 212 Q 300 234 316 212" stroke={INK} strokeWidth="8" strokeLinecap="round" fill="none" />
          </motion.g>
        </motion.g>

        <FullStop progress={progress} fill={`url(#${dot})`} />
      </g>
    </motion.svg>
  );
}

/**
 * One stroke of ribbon, drawn as a moving window along its path: the head
 * runs to the end over `head`, the tail follows over `tail`. Without a head
 * it starts fully drawn at `from`; without a tail it stays drawn until `until`.
 */
function Ribbon({
  progress,
  d,
  stroke,
  head,
  tail,
  from,
  until,
  width,
  ease = easeInOut,
  sheen = false,
}: {
  progress: MotionValue<number>;
  d: string;
  stroke: string;
  head?: readonly [number, number];
  tail?: readonly [number, number];
  from?: number;
  until?: number;
  width: number | MotionValue<number>;
  ease?: (value: number) => number;
  sheen?: boolean;
}) {
  const end = useScrub(progress, head ?? [0, 1], head ? [0, 1] : [1, 1], { ease });
  const start = useScrub(progress, tail ?? [0, 1], tail ? [0, 1] : [0, 0], { ease });
  const length = useTransform(() => Math.max(0, end.get() - start.get()));
  const on = head?.[0] ?? from ?? 0;
  const off = tail?.[1] ?? until ?? 1;
  // A zero-length dash still paints its round cap, so hide the stroke
  // outside its window rather than relying on the dash alone.
  const opacity = useScrub(progress, off < 1 ? [on, on + 0.001, off - 0.001, off] : [on, on + 0.001], off < 1 ? [0, 1, 1, 0] : [0, 1]);

  return (
    <motion.g style={{ opacity }}>
      <motion.path
        d={d}
        fill="none"
        stroke={stroke}
        strokeLinecap="round"
        style={{ strokeWidth: width, pathLength: length, pathOffset: start }}
      />
      {sheen && (
        <motion.path
          d={d}
          fill="none"
          stroke="#fff"
          strokeOpacity="0.4"
          strokeWidth="8"
          strokeLinecap="round"
          transform="translate(-10 -12)"
          style={{ pathLength: length, pathOffset: start }}
        />
      )}
    </motion.g>
  );
}

function LightRay({ progress, angle, index }: { progress: MotionValue<number>; angle: number; index: number }) {
  const start = T.rays + index * 0.006;
  const radians = (angle * Math.PI) / 180;
  const d = `M ${Math.round(STAGE.cx + Math.cos(radians) * 1500)} ${Math.round(STAGE.cy + Math.sin(radians) * 1500)} L ${STAGE.cx} ${STAGE.cy}`;
  const color = vivid[index % vivid.length];

  return (
    <>
      <Ribbon progress={progress} d={d} stroke={color} head={[start, start + 0.045]} tail={[start + 0.012, start + 0.055]} ease={easeIn} width={26} />
      <Ribbon progress={progress} d={d} stroke="#fff" head={[start, start + 0.045]} tail={[start + 0.012, start + 0.055]} ease={easeIn} width={5} />
    </>
  );
}

/** The drop that falls from above, lands as Jot's full stop, and leaves with the ribbon. */
function FullStop({ progress, fill }: { progress: MotionValue<number>; fill: string }) {
  const [d0, d1] = T.drop;
  const fall = useScrub(progress, [d0, d1], [-1150, 0], { ease: easeIn });
  const leave = useScrub(progress, [T.launch + 0.01, T.launch + 0.036], [0, -1800], { ease: easeIn });
  const y = useTransform(() => fall.get() + leave.get());
  const squash = [d0, d1 - 0.004, d1, d1 + 0.006, d1 + 0.014, T.launch + 0.01, T.launch + 0.02];
  const scaleX = useScrub(progress, squash, [0.72, 0.72, 1.32, 0.9, 1, 1, 0.7]);
  const scaleY = useScrub(progress, squash, [1.45, 1.45, 0.7, 1.12, 1, 1, 1.6]);
  const opacity = useScrub(progress, [d0, d0 + 0.003, T.launch + 0.03, T.launch + 0.036], [0, 1, 1, 0]);
  const trail = useScrub(progress, [d0, d0 + 0.006, d1 - 0.004, d1], [0, 0.7, 0.7, 0]);
  const ripple = useScrub(progress, [d1, d1 + 0.025], [1, 2.6]);
  const rippleOpacity = useScrub(progress, [d1 - 0.001, d1 + 0.002, d1 + 0.025], [0, 0.8, 0]);

  return (
    <>
      <motion.circle
        cx="412"
        cy="394"
        r="46"
        fill="none"
        stroke={fill}
        strokeWidth="6"
        style={{ scale: ripple, opacity: rippleOpacity }}
      />
      <motion.g style={{ y, opacity }}>
        <motion.rect x="396" y="190" width="32" height="200" rx="16" fill={fill} style={{ opacity: trail }} />
        <motion.g style={{ scaleX, scaleY }}>
          <circle cx="412" cy="394" r="46" fill={fill} />
          <circle cx="398" cy="378" r="10" fill="#fff" opacity=".55" />
        </motion.g>
      </motion.g>
    </>
  );
}

function Statement({ progress, sentence }: { progress: MotionValue<number>; sentence: string }) {
  const opacity = useScrub(progress, T.statement, [0, 1, 1, 0]);
  const y = useScrub(progress, T.statement, [24, 0, 0, -16]);
  const words = sentence.split(" ");

  return (
    <motion.p
      style={{ opacity, y }}
      className="statement absolute inset-x-5 top-[50svh] z-40 mx-auto max-w-3xl text-center text-foreground sm:inset-x-8"
    >
      {words.map((word, index) => (
        <LitWord key={index} progress={progress} index={index} count={words.length}>
          {word}
        </LitWord>
      ))}
    </motion.p>
  );
}

function LitWord({
  progress,
  index,
  count,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  count: number;
  children: string;
}) {
  const [from, to] = T.likeWords;
  const span = to - from;
  const start = from + (index / count) * span * 0.85;
  const opacity = useScrub(progress, [start, start + span * 0.18], [0.18, 1]);

  return (
    <>
      <motion.span style={{ opacity }}>{children}</motion.span>{" "}
    </>
  );
}

function Timeline({ progress, milestones }: { progress: MotionValue<number>; milestones: string[] }) {
  const opacity = useScrub(progress, T.timeline, [0, 1, 1, 0]);
  const fillFrom = T.note;
  const fillTo = T.note + (milestones.length - 1) * T.noteGap;
  const fill = useScrub(progress, [fillFrom, fillTo], [0, 1]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-x-10 bottom-[calc(9.5rem+env(safe-area-inset-bottom))] z-40 mx-auto h-1 max-w-lg md:bottom-28"
    >
      <span className="absolute inset-0 rounded-full bg-foreground/12" />
      <motion.span
        style={{ scaleX: fill }}
        className="absolute inset-0 origin-left rounded-full bg-linear-to-r from-[#ffa24c] via-[#ff4f9a] to-[#7c5cff]"
      />
      {milestones.map((label, index) => (
        <Milestone
          key={label}
          progress={progress}
          label={label}
          at={milestones.length > 1 ? index / (milestones.length - 1) : 0}
          reachedAt={fillFrom + index * T.noteGap}
        />
      ))}
    </motion.div>
  );
}

function Milestone({
  progress,
  label,
  at,
  reachedAt,
}: {
  progress: MotionValue<number>;
  label: string;
  at: number;
  reachedAt: number;
}) {
  const lit = useScrub(progress, [reachedAt - 0.006, reachedAt + 0.004], [0, 1]);
  const text = useScrub(progress, [reachedAt - 0.006, reachedAt + 0.004], [0.45, 1]);

  return (
    <div className="absolute top-1/2" style={{ left: `${at * 100}%` }}>
      <span className="absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-foreground/25 bg-background" />
      <motion.span
        style={{ opacity: lit }}
        className="absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff4f9a] shadow-[0_0_14px_#ff4f9a]"
      />
      <motion.span
        style={{ opacity: text }}
        // The end labels align inward so they never run off a narrow screen.
        className={cn(
          "absolute top-4 text-sm font-semibold whitespace-nowrap text-foreground tabular-nums",
          at === 0 ? "-translate-x-1.5" : at === 1 ? "-translate-x-[calc(100%-0.375rem)]" : "-translate-x-1/2",
        )}
      >
        {label}
      </motion.span>
    </div>
  );
}

/* ───────────────────────── archive ───────────────────────── */

function ArchiveNote({
  progress,
  item,
  index,
  start: s,
}: {
  progress: MotionValue<number>;
  item: EducationEntry;
  index: number;
  start: number;
}) {
  const lean = index % 2 ? 1 : -1;
  const keys = [s, s + 0.038, s + 0.078, s + 0.105];
  const scale = useSpring(useScrub(progress, keys, [0.12, 1, 1, 0.08]), spring);
  const rotate = useScrub(progress, keys, [12 * lean, 2.5 * lean, 2.5 * lean, -9 * lean]);
  // Out of Jot, who is waiting higher up the frame, and back into him.
  const y = useScrub(progress, keys, ["-14svh", "-2svh", "-2svh", "-14svh"]);
  const opacity = useScrub(progress, [s, s + 0.012, s + 0.09, s + 0.105], [0, 1, 1, 0]);

  // Written in order, like a hand filling the card in.
  const w = s + 0.028;
  const period = useScrub(progress, [w, w + 0.008], ["inset(-20% 100% -20% 0)", "inset(-20% 0% -20% 0)"]);
  const school = useScrub(progress, [w + 0.006, w + 0.02], ["inset(-25% 100% -25% 0)", "inset(-25% 0% -25% 0)"]);
  const underline = useScrub(progress, [w + 0.018, w + 0.028], [0, 1]);
  const degree = useScrub(progress, [w + 0.022, w + 0.032], ["inset(-20% 100% -20% 0)", "inset(-20% 0% -20% 0)"]);
  const description = useScrub(progress, [w + 0.03, w + 0.046], ["inset(-5% 0 100% 0)", "inset(-5% 0 -5% 0)"]);
  const stampScale = useScrub(progress, [s + 0.07, s + 0.076], [2.2, 1]);
  const stampOpacity = useScrub(progress, [s + 0.07, s + 0.073], [0, 1]);

  return (
    <motion.article
      style={{ scale, rotate, y, opacity }}
      className="absolute z-30 w-[min(88vw,32rem)] rounded-[6px] bg-[#f4efe2] px-7 pt-9 pb-8 text-[#2b241b] shadow-[0_50px_100px_-25px_rgb(0_0_0/.45)] sm:px-11 sm:pt-11 sm:pb-10 dark:shadow-[0_50px_100px_-25px_rgb(0_0_0/.85)]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[6px] bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_calc(1.75rem-1px),rgba(70,100,170,.14)_calc(1.75rem-1px),rgba(70,100,170,.14)_1.75rem)] bg-[length:100%_1.75rem] bg-[position:0_1.1rem]" />
      <span className="absolute inset-y-0 left-4 w-px bg-[#e36a6a]/45 sm:left-7" />
      <span className="absolute -top-3 left-1/2 h-7 w-28 -translate-x-1/2 -rotate-3 bg-[#f6d27a]/75 shadow-sm" />
      <motion.span
        style={{ scale: stampScale, opacity: stampOpacity }}
        className="absolute top-5 right-5 flex size-16 -rotate-12 items-center justify-center rounded-full border-[3px] border-double border-[#cc3b3b]/80 text-[0.95rem] font-bold text-[#cc3b3b]/85 tabular-nums sm:size-20 sm:text-lg"
      >
        {item.year}
      </motion.span>

      <motion.p style={{ clipPath: period }} className="relative font-mono text-[0.7rem] tracking-[0.14em] text-[#6b5d49] tabular-nums sm:text-xs">
        {String(index + 1).padStart(2, "0")} · {item.period}
      </motion.p>
      <motion.p
        style={{ clipPath: school }}
        className="relative mt-3 pr-16 text-[clamp(1.35rem,1rem+1.8vw,2rem)] leading-[1.2] font-semibold tracking-[-0.02em] sm:pr-20"
      >
        {item.school}
      </motion.p>
      <svg viewBox="0 0 220 12" className="relative mt-1 h-3 w-40 overflow-visible sm:w-52" aria-hidden>
        <motion.path
          d="M2 8 C 40 2, 70 11, 110 6 S 180 3, 218 7"
          fill="none"
          stroke="#ff9f0a"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ pathLength: underline }}
        />
      </svg>
      <motion.p style={{ clipPath: degree }} className="relative mt-3 font-medium text-[#3d3326]">
        {item.degree}
      </motion.p>
      <motion.p style={{ clipPath: description }} className="relative mt-3 text-[0.95rem] leading-7 text-[#4e4436]">
        {item.description}
      </motion.p>
    </motion.article>
  );
}

/* ───────────────────────── hill & cannon ───────────────────────── */

// Parabolic hills (plain arithmetic, so server and client draw the same path).
const hill = (x: number, base: number, amp: number, centre: number, reach: number) =>
  base - amp * Math.max(0, 1 - ((x - centre) / reach) ** 2);

const frontHillPath = (() => {
  let d = "M0 300";
  for (let x = 0; x <= 1440; x += 8) {
    const y = hill(x, 175, 100, 720, 900);
    const blade = 7 + ((x * 7919) % 11);
    d += ` L${x} ${y.toFixed(1)} L${x + 4} ${(y - blade).toFixed(1)}`;
  }
  return `${d} L1440 ${hill(1440, 175, 100, 720, 900).toFixed(1)} L1440 300 Z`;
})();

const backHillPath = (() => {
  let d = "M0 300";
  for (let x = 0; x <= 1440; x += 24) {
    const y = Math.min(hill(x, 170, 110, 330, 760), hill(x, 185, 95, 1150, 700));
    d += ` L${x} ${y.toFixed(1)}`;
  }
  return `${d} L1440 300 Z`;
})();

function BackHill({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 1440 300" preserveAspectRatio="none" className={className}>
      <path d={backHillPath} className="fill-[#8fcb7b] dark:fill-[#0d2419]" />
    </svg>
  );
}

function FrontHill({ className }: { className: string }) {
  const id = useId();

  return (
    <svg viewBox="0 0 1440 300" preserveAspectRatio="none" className={className}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="[stop-color:#6fc24f] dark:[stop-color:#1f6a3f]" />
          <stop offset="0.35" className="[stop-color:#3f9a3a] dark:[stop-color:#0f3a23]" />
          <stop offset="1" className="[stop-color:#1f5f26] dark:[stop-color:#04110a]" />
        </linearGradient>
      </defs>
      <path d={frontHillPath} fill={`url(#${id})`} />
    </svg>
  );
}

function Ground({ progress }: { progress: MotionValue<number> }) {
  const opacity = useScrub(progress, T.sky, [0, 1]);
  const y = useScrub(progress, [T.rise[0], T.rise[1], T.sink[0], T.sink[1]], ["34svh", "0svh", "0svh", "9svh"], {
    ease: easeOut,
  });

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 bottom-0 z-20 h-[30svh]">
      <BackHill className="absolute inset-0 size-full" />
      <Cannon progress={progress} />
      <FrontHill className="absolute inset-0 z-20 size-full" />
      <MuzzleBlast progress={progress} />
    </motion.div>
  );
}

// Once tilted, the cannon's muzzle sits 38.4svh above the frame's bottom and
// on its centre line — the logos launch from exactly there.
const muzzle = "left-1/2 bottom-[38.4svh]";
const MUZZLE_TOP = 61.6; // the same point, in svh from the top

function Cannon({ progress }: { progress: MotionValue<number> }) {
  const [r0, r1] = T.roll;
  const f = T.fire;
  const step = (r1 - r0) / 4;
  const drive = [r0, r1, f - 0.001, f + 0.004, f + 0.022];
  const x = useScrub(progress, drive, ["-62vw", "0vw", "0vw", "-2.4vw", "0vw"]);
  const wheel = useScrub(progress, drive, [-1080, 0, 0, -40, 0]);
  // Rolling over the turf: a hop and a rock, then a nose-up kick on firing.
  const y = useScrub(progress, [r0, r0 + step, r0 + step * 2, r0 + step * 3, r1], ["0svh", "-1.4svh", "0svh", "-0.6svh", "0svh"]);
  const rock = useScrub(
    progress,
    [r0, r0 + step, r0 + step * 2, r0 + step * 3, r1, f, f + 0.004, f + 0.02],
    [-4, 3, -2, 1.5, 0, 0, 2.5, 0],
  );
  const scale = useSpring(useScrub(progress, [r0, r1], [0.82, 1]), spring);
  const tilt = useSpring(useScrub(progress, T.tilt, [0, -62]), { stiffness: 210, damping: 20, mass: 0.5 });

  return (
    <motion.div
      style={{ x, y, rotate: rock, scale }}
      className="absolute bottom-[66%] left-[calc(50%-4.75svh)] z-10 aspect-[240/200] h-[22svh] -translate-x-1/2"
    >
      <svg viewBox="0 0 240 200" className="size-full overflow-visible">
        <defs>
          <linearGradient id="profile-metal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2b2e36" />
            <stop offset="0.16" stopColor="#dde1ea" />
            <stop offset="0.3" stopColor="#7b818f" />
            <stop offset="0.62" stopColor="#2a2d35" />
            <stop offset="0.85" stopColor="#4a4f5c" />
            <stop offset="1" stopColor="#16181d" />
          </linearGradient>
          <linearGradient id="profile-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff1a8" />
            <stop offset="0.35" stopColor="#ffd60a" />
            <stop offset="0.7" stopColor="#b8860b" />
            <stop offset="1" stopColor="#6b4e06" />
          </linearGradient>
          <linearGradient id="profile-accent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff9db4" />
            <stop offset="0.4" stopColor="#ff375f" />
            <stop offset="1" stopColor="#7a0e2a" />
          </linearGradient>
          <linearGradient id="profile-wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b87342" />
            <stop offset="0.5" stopColor="#7d4724" />
            <stop offset="1" stopColor="#4a2812" />
          </linearGradient>
          <linearGradient id="profile-wood-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5e351b" />
            <stop offset="1" stopColor="#2c170a" />
          </linearGradient>
          <radialGradient id="profile-hub" cx="0.38" cy="0.35" r="0.7">
            <stop offset="0" stopColor="#f4f6fa" />
            <stop offset="0.4" stopColor="#9aa0ad" />
            <stop offset="1" stopColor="#23262d" />
          </radialGradient>
          <filter id="profile-soft" x="-20%" y="-200%" width="140%" height="500%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        <ellipse cx="116" cy="192" rx="100" ry="9" fill="#000" opacity="0.32" filter="url(#profile-soft)" />

        {/* Far wheel, higher and narrower: it sits further back */}
        <g transform="translate(150 140) scale(0.78 1)" opacity="0.92">
          <circle r="36" fill="none" stroke="#24150b" strokeWidth="9" />
          <circle r="40" fill="none" stroke="#1d1f25" strokeWidth="3" />
          <motion.g style={{ rotate: wheel }}>
            <circle r="36" fill="none" />
            {[0, 36, 72, 108, 144].map((spoke) => (
              <rect key={spoke} x="-2.4" y="-33" width="4.8" height="66" rx="2" fill="#3a2212" transform={`rotate(${spoke})`} />
            ))}
            <circle r="8" fill="#1b1d23" />
          </motion.g>
        </g>

        {/* Far cheek and axle */}
        <path d="M44 176 L112 110 L140 106 L160 138 L150 160 L60 184 Z" transform="translate(14 -10)" fill="url(#profile-wood-far)" />
        <path d="M100 146 L150 136 L150 146 L100 156 Z" fill="#1d1f25" />

        {/* Barrel. The invisible rect centres the group's box on the trunnion
            (120, 112), so motion's default origin is the pivot. */}
        <motion.g style={{ rotate: tilt }}>
          <rect x="20" y="88" width="200" height="48" fill="none" />
          <circle cx="52" cy="112" r="9" fill="url(#profile-hub)" />
          <path d="M60 92 Q55 112 60 132 L210 124 L210 100 Z" fill="url(#profile-metal)" />
          <path d="M64 89 L80 90 L80 134 L64 135 Q58 112 64 89 Z" fill="url(#profile-metal)" />
          <path d="M128 94 L137 94.5 L137 129.5 L128 130 Z" fill="url(#profile-gold)" />
          <path d="M180 96.5 L190 97 L190 127 L180 127.5 Z" fill="url(#profile-accent)" />
          <path d="M196 96 L212 97 L212 127 L196 128 Z" fill="url(#profile-metal)" />
          <ellipse cx="212" cy="112" rx="5" ry="15" fill="url(#profile-metal)" />
          <ellipse cx="213" cy="112" rx="3" ry="9.5" fill="#050507" />
          <path d="M72 99.5 L204 104" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
        </motion.g>

        {/* Near cheek, straps and trunnion cap */}
        <path d="M44 176 L112 110 L140 106 L160 138 L150 160 L60 184 Z" fill="url(#profile-wood)" />
        <path d="M44 176 L112 110 L140 106" fill="none" stroke="#e8ad7a" strokeOpacity="0.65" strokeWidth="2" strokeLinejoin="round" />
        <path d="M78 150 L92 136 L99 142 L85 156 Z" fill="#2a2c33" />
        <path d="M58 170 L70 158 L77 164 L65 176 Z" fill="#2a2c33" />
        {[
          [88, 142],
          [67, 164],
        ].map(([cx, cy]) => (
          <circle key={cx} cx={cx} cy={cy} r="2.2" fill="url(#profile-hub)" />
        ))}
        <circle cx="120" cy="112" r="10" fill="url(#profile-hub)" />
        <circle cx="120" cy="112" r="4" fill="url(#profile-gold)" />

        {/* Near wheel, seen at three-quarters: an ellipse with a visible tread */}
        <g transform="translate(100 150) scale(0.86 1)">
          <circle cx="-5" r="40" fill="none" stroke="#2a180c" strokeWidth="10" />
          <circle r="40" fill="none" stroke="url(#profile-wood)" strokeWidth="9" />
          <circle r="44.5" fill="none" stroke="url(#profile-metal)" strokeWidth="3" />
          <motion.g style={{ rotate: wheel }}>
            <circle r="40" fill="none" />
            {[0, 36, 72, 108, 144].map((spoke) => (
              <rect key={spoke} x="-2.6" y="-37" width="5.2" height="74" rx="2" fill="url(#profile-wood)" transform={`rotate(${spoke})`} />
            ))}
            <circle r="11" fill="url(#profile-hub)" />
            <circle r="4.5" fill="url(#profile-gold)" />
          </motion.g>
        </g>
      </svg>
    </motion.div>
  );
}

function MuzzleBlast({ progress }: { progress: MotionValue<number> }) {
  const f = T.fire;
  const flashScale = useScrub(progress, [f - 0.001, f + 0.003, f + 0.016], [0.2, 1.4, 0.6]);
  const flashOpacity = useScrub(progress, [f - 0.001, f + 0.002, f + 0.016], [0, 1, 0]);

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {[0, 1, 2].map((puff) => (
        <SmokePuff key={puff} progress={progress} index={puff} />
      ))}
      <motion.span
        style={{ scale: flashScale, opacity: flashOpacity }}
        className={cn(
          "absolute size-[18svh] -translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle,#fff_0%,#ffe27a_22%,rgba(255,159,10,.45)_45%,transparent_70%)]",
          muzzle,
        )}
      />
    </div>
  );
}

function SmokePuff({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const f = T.fire + index * 0.002;
  const x = useScrub(progress, [f, f + 0.045], ["0vw", `${(index - 1) * 3.5}vw`]);
  const y = useScrub(progress, [f, f + 0.045], ["0svh", `${-5 - index * 3}svh`]);
  const scale = useScrub(progress, [f, f + 0.045], [0.3, 1.8 + index * 0.3]);
  const opacity = useScrub(progress, [f, f + 0.004, f + 0.045], [0, 0.6, 0]);

  return (
    <motion.span
      style={{ x, y, scale, opacity }}
      className={cn("absolute size-[9svh] -translate-x-1/2 translate-y-1/2 rounded-full bg-white/80 blur-xl dark:bg-[#d9d4e8]", muzzle)}
    />
  );
}

/* ───────────────────────── fireworks ───────────────────────── */

// Where each logo bursts, in % of the frame — clear of the muzzle below.
const skyTargets: [number, number][] = [
  [10, 27], [30, 23], [50, 26], [70, 22], [90, 28],
  [20, 37], [40, 34], [60, 36], [80, 33],
  [7, 47], [25, 46], [43, 49], [57, 44], [75, 48], [93, 43],
  [15, 57], [33, 56], [67, 57], [85, 55],
];
// Launch order hops around the sky so one category never bunches up.
const launchOrder = [2, 7, 12, 0, 16, 5, 10, 18, 3, 14, 8, 1, 17, 11, 6, 15, 4, 13, 9];

// Each logo glows in its own brand colour; black-and-white marks borrow one.
const brandGlow: Record<string, string> = {
  "Next.js": "#bf5af2",
  React: "#61dafb",
  TypeScript: "#3178c6",
  "Tailwind CSS": "#38bdf8",
  "React Native": "#61dafb",
  "Node.js": "#5fa04e",
  NestJS: "#e0234e",
  Express: "#ffd60a",
  "Socket.IO": "#30d158",
  PHP: "#777bb4",
  PostgreSQL: "#4169e1",
  MySQL: "#f29111",
  MongoDB: "#47a248",
  SQLite: "#0f80cc",
  Docker: "#2496ed",
  GitHub: "#ff375f",
  Git: "#f05032",
  Vercel: "#64d2ff",
  Render: "#46e3b7",
};

const fireworks = techStack.flatMap((category) =>
  category.items.map((tech) => ({ ...tech, key: `${category.id}-${tech.name}` })),
);

function TechFireworks({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {fireworks.map((tech, index) => (
        <TechStar
          key={tech.key}
          progress={progress}
          tech={tech}
          index={index}
          target={skyTargets[launchOrder[index % launchOrder.length] % skyTargets.length]}
        />
      ))}
    </div>
  );
}

const sparkle = "M12 0C12.6 6.6 17.4 11.4 24 12C17.4 12.6 12.6 17.4 12 24C11.4 17.4 6.6 12.6 0 12C6.6 11.4 11.4 6.6 12 0Z";

function TechStar({
  progress,
  tech,
  index,
  target: [tx, ty],
}: {
  progress: MotionValue<number>;
  tech: Tech;
  index: number;
  target: [number, number];
}) {
  const s = T.fireworks + index * T.fireworksGap;
  const arrive = s + T.flight;
  const [star0, star1] = T.stars;
  // Out of the muzzle on a rising arc, then eased a little further out so the
  // stars leave room for the promises.
  const x = useScrub(progress, [s, arrive, star0, star1], ["0vw", `${tx - 50}vw`, `${tx - 50}vw`, `${(tx - 50) * 1.12}vw`]);
  const y = useScrub(progress, [s, arrive], ["0svh", `${ty - MUZZLE_TOP}svh`], { ease: easeOut });
  const shell = useScrub(progress, [s, s + 0.003, arrive - 0.003, arrive], [0, 1, 1, 0]);
  const burstScale = useScrub(progress, [arrive - 0.002, arrive + 0.02], [0.3, 2.4]);
  const burstOpacity = useScrub(progress, [arrive - 0.002, arrive + 0.002, arrive + 0.02], [0, 0.95, 0]);
  const chipScale = useScrub(progress, [arrive - 0.003, arrive + 0.005, arrive + 0.014, star0, star1], [0.2, 1.3, 1, 1, 0.46]);
  const chipOpacity = useScrub(progress, [arrive - 0.003, arrive + 0.003, star0, star1], [0, 1, 1, 0.4]);
  const plate = useScrub(progress, T.stars, [1, 0]);
  const glow = brandGlow[tech.name] ?? vivid[index % vivid.length];
  const delay = `${(index * 0.37) % 3}s`;

  return (
    <motion.div style={{ x, y }} className={cn("absolute size-0", muzzle)}>
      <motion.span
        style={{ opacity: shell, background: glow, boxShadow: `0 0 18px 6px ${glow}` }}
        className="absolute -top-2 -left-2 size-4 rounded-full ring-2 ring-white/80"
      />
      <motion.span
        style={{ scale: burstScale, opacity: burstOpacity, borderColor: glow }}
        className="absolute -top-10 -left-10 size-20 rounded-full border-[3px]"
      />
      <motion.span
        style={{
          scale: burstScale,
          opacity: burstOpacity,
          background: `repeating-conic-gradient(${glow} 0deg 6deg, transparent 6deg 36deg)`,
        }}
        className="absolute -top-18 -left-18 size-36 rounded-full [mask-image:radial-gradient(circle,transparent_38%,black_40%,black_66%,transparent_68%)]"
      />
      <motion.div
        style={{ scale: chipScale, opacity: chipOpacity }}
        className="absolute -top-7 -left-7 size-14 sm:-top-9 sm:-left-9 sm:size-18"
      >
        <span
          className="animate-twinkle absolute -inset-5 rounded-full blur-xl"
          style={{ background: glow, animationDelay: delay }}
        />
        <motion.span
          style={{ opacity: plate }}
          className="absolute inset-0 rounded-[30%] bg-white shadow-[0_12px_30px_-10px_rgba(0,0,0,.35)] ring-1 ring-black/5 dark:bg-white/12 dark:shadow-none dark:ring-white/30 dark:backdrop-blur-sm"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <Icon
            icon={tech.icon}
            className={cn(
              "size-8 sm:size-10",
              tech.mono && "dark:invert",
              tech.tint && "text-[#1d1d1f] dark:text-white",
            )}
            style={{ filter: `drop-shadow(0 0 10px ${glow})` }}
          />
        </span>
        <svg
          viewBox="0 0 24 24"
          className="animate-twinkle absolute -top-2.5 -right-2.5 size-4 sm:size-5"
          style={{ color: glow, animationDelay: delay }}
        >
          <path d={sparkle} fill="currentColor" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

/* ───────────────────────── promises ───────────────────────── */

const promiseIcons: LucideIcon[] = [MessagesSquare, Eye, ShieldCheck];
const promiseTones = [
  { text: "text-hue-blue", glow: "bg-hue-blue/30" },
  { text: "text-hue-purple", glow: "bg-hue-purple/30" },
  { text: "text-hue-green", glow: "bg-hue-green/30" },
];

function PromiseFinale({
  progress,
  label,
  heading,
  promises,
}: {
  progress: MotionValue<number>;
  label: string;
  heading: string;
  promises: PromiseEntry[];
}) {
  const opacity = useScrub(progress, T.promise, [0, 1]);
  const y = useScrub(progress, T.promise, [22, 0]);

  return (
    <div className="absolute inset-x-5 top-[clamp(4.75rem,9svh,7rem)] z-40 mx-auto max-w-5xl text-foreground sm:inset-x-8">
      <motion.div style={{ opacity, y }} className="text-center">
        <p className="kicker text-hue-green">{label}</p>
        <p className="headline-section mt-2">{heading}</p>
      </motion.div>
      <ul className="mt-6 grid gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-8">
        {promises.map((item, index) => (
          <PromiseStar key={item.title} progress={progress} item={item} index={index} />
        ))}
      </ul>
    </div>
  );
}

function PromiseStar({ progress, item, index }: { progress: MotionValue<number>; item: PromiseEntry; index: number }) {
  const s = T.promiseItem + index * T.promiseGap;
  const opacity = useScrub(progress, [s, s + 0.022], [0, 1]);
  const y = useScrub(progress, [s, s + 0.022], [22, 0]);
  const glow = useScrub(progress, [s + 0.008, s + 0.026], [0, 1]);
  const PromiseIcon = promiseIcons[index % promiseIcons.length];
  const tone = promiseTones[index % promiseTones.length];

  return (
    <motion.li style={{ opacity, y }} className="flex gap-3.5 sm:flex-col sm:gap-0">
      <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-white/70 ring-1 ring-black/5 sm:size-12 dark:bg-white/8 dark:ring-white/20">
        <motion.span style={{ opacity: glow }} className={cn("absolute -inset-3 rounded-full blur-lg", tone.glow)} />
        <PromiseIcon className={cn("relative size-5", tone.text)} />
      </span>
      <div className="min-w-0 sm:mt-4">
        <p className="text-[1.02rem] leading-snug font-semibold sm:headline-card">{item.title}</p>
        <p className="mt-1 text-[0.82rem] leading-relaxed text-foreground/65 sm:mt-2 sm:text-[0.95rem]">{item.desc}</p>
      </div>
    </motion.li>
  );
}

"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { motion, easeIn, easeInOut, easeOut, useSpring, useTransform, type MotionStyle, type MotionValue } from "motion/react";
import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { DropletBody, dropletPalettes } from "./FloatingOrbs";
import { useFilm } from "./useFilm";
import { useScrub } from "./useScrub";
import { useMounted } from "@/hooks/useMounted";

export type FeaturedProject = {
  id: string;
  title: string;
  tagline: string;
  image: { src: string; alt?: string };
};

type WorkStoryProps = {
  label: string;
  heading: string;
  subtitle: string;
  viewAll: string;
  projects: FeaturedProject[];
};

/** Film wrapper height, in svh. */
const HEIGHT = 500;

/**
 * The storyboard, in scroll progress. One place to retime the film: every
 * scene reads its window from here.
 */
const T = {
  header: [0, 0.04, 0.72, 0.76],
  drops: [0, 0.2],
  vortex: [0, 0.14],
  shots: 0.04,
  shotGap: 0.013,
  shotLength: 0.16,
  push: [0.27, 0.35],
  split: [0.35, 0.395],
  burst: 0.395,
  hold: [0.44, 0.74],
  crack: [0.74, 0.79],
  shatter: 0.795,
  fall: 0.17,
} as const;

/** The whirlpool's resting tilt, and how far it tips when pressed down. */
const TILT = { rest: 55, pressed: 68 };

// Drops arrive from beyond the top and sides of the frame — the hero's drops,
// carrying on. Positions are on the whirlpool's own plane, in units of its
// width (`--vs`), as an angle and a distance from its centre.
const filmDrops = [
  { angle: -90, radius: 2.5, size: "size-12 sm:size-16", palette: 0, lag: 0 },
  { angle: -122, radius: 2.7, size: "size-9 sm:size-12", palette: 1, lag: 0.012 },
  { angle: -58, radius: 2.6, size: "size-14 sm:size-20", palette: 3, lag: 0.006 },
  { angle: -152, radius: 2.4, size: "size-8 sm:size-10", palette: 2, lag: 0.02 },
  { angle: -26, radius: 2.45, size: "size-10 sm:size-14", palette: 4, lag: 0.016 },
  { angle: -104, radius: 2.9, size: "size-6 sm:size-8", palette: 1, lag: 0.026 },
  { angle: -74, radius: 3, size: "size-7 sm:size-9", palette: 0, lag: 0.03 },
];

const swirlShots = [
  { src: "/project-screenshots/bamboo/hero-section.jpg", ratio: 1.5 },
  { src: "/project-screenshots/gohike/home-beautified.png", ratio: 0.49 },
  { src: "/project-screenshots/l3go/home.png", ratio: 1.76 },
  { src: "/project-screenshots/tlux/tlux.png", ratio: 1.76 },
  { src: "/project-screenshots/gohike/map-beautified.png", ratio: 0.49 },
  { src: "/project-screenshots/chap/home.png", ratio: 1.76 },
  { src: "/project-screenshots/bamboo/menu.png", ratio: 1.76 },
  { src: "/project-screenshots/l3go/glass-wall.jpg", ratio: 1.5 },
  { src: "/project-screenshots/gohike/analytics-beautified.png", ratio: 0.49 },
  { src: "/project-screenshots/bamboo/manager.png", ratio: 1.78 },
];

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
/** A length in units of the whirlpool's width. */
const vs = (units: number) => `calc(var(--vs) * ${units.toFixed(4)})`;

/**
 * Where something circling into the whirlpool is at phase `t`: an inward
 * spiral on the water's plane that dives down the funnel at the end.
 */
function orbit(angle: number, radius: number, t: number, turns: number) {
  const eased = easeInOut(t);
  const r = radius * (1 - eased) + 0.02;
  const a = (angle * Math.PI) / 180 + eased * turns * Math.PI * 2;
  return {
    x: r * Math.cos(a),
    y: r * Math.sin(a),
    z: -CORE_DEPTH * easeIn(clamp01((t - 0.6) / 0.4)),
  };
}

/**
 * The work, as a film between the hero and the services. The hero's colour
 * drops circle into a whirlpool of liquid glass and dive down its funnel,
 * pulling screenshots of the projects in after them; pressed down, it splits
 * into three drops that burst open as the three featured projects. Scroll on
 * and the tiles crack and fall away — still falling as the services film
 * fades in over them.
 *
 * The heading and the three tiles are real content and real links. Focusing a
 * tile scrolls the film to where the tiles are standing, and with reduced
 * motion the section is a plain heading and grid.
 */
export default function WorkStory({ label, heading, subtitle, viewAll, projects }: WorkStoryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { progress, frame } = useFilm(ref, HEIGHT, { leaves: true });

  // Keyboard users land on a tile that may still be a drop or already dust:
  // bring the film to the moment the tiles are standing.
  function revealTiles() {
    const film = ref.current;
    if (!film || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const current = progress.get();
    if (current > T.burst + 0.03 && current < T.crack[0]) return;
    const top = film.getBoundingClientRect().top + window.scrollY;
    const travel = film.offsetHeight - window.innerHeight;
    // `progress` finishes half an overlap before the wrapper does.
    const share = 1 - 50 / (HEIGHT - 100);
    window.scrollTo({ top: top + (T.hold[0] + 0.04) * share * travel, behavior: "instant" });
  }

  const linkOpacity = useScrub(progress, [T.burst + 0.02, T.burst + 0.035, T.crack[0], T.crack[0] + 0.012], [0, 1, 1, 0]);
  const linkPointer = useTransform(progress, (value) => (value > T.burst + 0.02 && value < T.crack[0] ? "auto" : "none"));
  if (!useMounted()) {
    return null;
  }
  return (
    <section data-anchor="projects" className="relative bg-background text-foreground">
      <div ref={ref} className="relative h-[500svh] motion-reduce:h-auto">
        <motion.div
          style={frame}
          className="sticky top-0 h-svh min-h-[35rem] overflow-hidden [--vs:min(84vw,66svh)] motion-reduce:static motion-reduce:h-auto motion-reduce:overflow-visible motion-reduce:px-4 motion-reduce:py-20"
        >
          <div aria-hidden className="absolute inset-0 motion-reduce:hidden">
            <Whirlpool progress={progress} />
          </div>

          <Header progress={progress} label={label} heading={heading} subtitle={subtitle} />

          <div className="absolute top-[56svh] left-1/2 z-30 w-[min(72rem,calc(100vw-2.5rem),150svh)] -translate-x-1/2 -translate-y-1/2 [--cw:calc((min(72rem,100vw-2.5rem,150svh)-3rem)/3)] motion-reduce:static motion-reduce:mx-auto motion-reduce:mt-12 motion-reduce:translate-none">
            <ul className="grid gap-3 sm:grid-cols-3 sm:gap-6">
              {projects.map((project, index) => (
                <TileSlot key={project.id} progress={progress} project={project} index={index} onFocus={revealTiles} />
              ))}
            </ul>
            <motion.div
              style={{ opacity: linkOpacity, pointerEvents: linkPointer }}
              className="scroll-fx absolute top-full left-0 mt-6 w-full text-center motion-reduce:static motion-reduce:mt-10"
            >
              <Link href="/library/projects" onFocus={revealTiles} className="link-more text-lg">
                {viewAll}
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Header({
  progress,
  label,
  heading,
  subtitle,
}: {
  progress: MotionValue<number>;
  label: string;
  heading: string;
  subtitle: string;
}) {
  const opacity = useScrub(progress, T.header, [0, 1, 1, 0]);
  const y = useScrub(progress, T.header, [20, 0, 0, -16]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="scroll-fx absolute inset-x-5 top-[clamp(4.75rem,9svh,7rem)] z-40 mx-auto max-w-4xl text-center sm:inset-x-8 motion-reduce:static"
    >
      <p className="kicker text-hue-blue">{label}</p>
      <h2 className="headline-section mt-2 text-foreground">{heading}</h2>
      <p className="lede mx-auto mt-3 hidden max-w-2xl lg:block motion-reduce:block">{subtitle}</p>
    </motion.div>
  );
}

/* ───────────────────────── whirlpool ───────────────────────── */

const SPECTRUM = "#36f0c0, #22d3ee, #168cff, #8157ff, #ff63b8, #ffb15c, #fde047, #36f0c0";
const CORE_DEPTH = 0.36;

// Seven rings of coloured glass, stepping down into the funnel. Each band is
// wide enough to tuck under the ring above it, so the funnel reads as one
// continuous wall. Plain arithmetic and fixed strings: same markup on server
// and client.
const funnel = Array.from({ length: 7 }, (_, step) => {
  const radius = 1 - step * 0.12;
  const band = Math.min(48, Math.round((0.12 / radius) * 130));
  const inner = 100 - band;
  return {
    radius: Number(radius.toFixed(2)),
    depth: vs(-step * 0.05),
    spin: (step % 2 ? -1 : 1) * (320 + step * 150),
    colours: `conic-gradient(from ${step * 51}deg, ${SPECTRUM})`,
    mask: `radial-gradient(closest-side, transparent ${inner - 3}%, #000 ${inner}%, #000 96%, transparent 100%)`,
    // The inner lip in shadow and a bright outer edge: what makes it glass.
    edges: `radial-gradient(closest-side, transparent ${inner - 1}%, rgba(24,10,80,.34) ${inner + 2}%, transparent ${inner + 8}%, transparent 94%, rgba(255,255,255,.95) 97.5%, transparent 100%)`,
  };
});
// Light sits still while the water turns: two highlights, upper left and lower right.
const SPECULAR =
  "conic-gradient(from -70deg, transparent 0 4%, rgba(255,255,255,.95) 10%, transparent 18%, transparent 52%, rgba(255,255,255,.5) 60%, transparent 68%)";
// Half-circles of shrinking radius, alternating sides: a spiral arm drawn with
// plain arcs.
const SPIRAL_ARM =
  "M 92 0 A 83 83 0 0 1 -74 0 A 66 66 0 0 1 58 0 A 51.5 51.5 0 0 1 -45 0 A 39.5 39.5 0 0 1 34 0 A 29.5 29.5 0 0 1 -25 0 A 21 21 0 0 1 17 0 A 14 14 0 0 1 -11 0";

function Whirlpool({ progress }: { progress: MotionValue<number> }) {
  const [split0, split1] = T.split;
  // One value sizes every ring and the core, so the funnel grows and
  // collapses as a whole while the drops and shots keep their own scale.
  const form = useScrub(progress, [0, T.vortex[1], split0, split1], [0.3, 1, 1, 0], { ease: easeInOut });
  const y = useScrub(progress, T.push, ["0svh", "10svh"], { ease: easeInOut });
  const tilt = useScrub(progress, [T.push[0], T.push[1]], [TILT.rest, TILT.pressed], { ease: easeInOut });
  const lens = useTransform(tilt, (degrees) => Math.cos((degrees * Math.PI) / 180));
  const surfaceSpin = useScrub(progress, [0, split1], [0, -520]);
  const auraSpin = useScrub(progress, [0, split1], [0, 160]);
  const auraOpacity = useScrub(progress, [0, 0.06, split0, split1 + 0.02], [0.45, 1, 1, 0]);
  const flash = useScrub(progress, [split0 - 0.01, split0 + 0.012, split1 + 0.01], [0, 1, 0]);

  return (
    <motion.div
      style={{ y }}
      className="absolute top-[50svh] left-1/2 size-(--vs) -translate-x-1/2 -translate-y-1/2 [perspective:calc(var(--vs)*3)]"
    >
      <motion.div
        style={{ opacity: auraOpacity, rotate: auraSpin, scale: form }}
        className="absolute inset-[-38%] rounded-full bg-[radial-gradient(circle_at_30%_35%,rgba(54,240,192,.7),transparent_42%),radial-gradient(circle_at_72%_30%,rgba(255,99,184,.62),transparent_44%),radial-gradient(circle_at_64%_74%,rgba(129,87,255,.7),transparent_48%),radial-gradient(circle_at_28%_70%,rgba(255,177,92,.6),transparent_44%)] blur-3xl"
      />

      <motion.div style={{ rotateX: tilt, transformStyle: "preserve-3d" }} className="absolute inset-0">
        {funnel.map((ring, step) => (
          <GlassRing key={step} progress={progress} form={form} ring={ring} />
        ))}
        <Core progress={progress} form={form} />

        <motion.div style={{ z: 1, scale: form }} className="absolute inset-0">
          <motion.svg style={{ rotate: surfaceSpin }} viewBox="-100 -100 200 200" className="absolute inset-0 size-full">
            {[0, 90, 180, 270].map((turn) => (
              <g key={turn} transform={`rotate(${turn})`}>
                <path d={SPIRAL_ARM} fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="2.4" strokeLinecap="round" />
                <path d={SPIRAL_ARM} fill="none" stroke="#ff63b8" strokeOpacity="0.35" strokeWidth="1.4" strokeLinecap="round" transform="rotate(10) scale(0.96)" />
              </g>
            ))}
          </motion.svg>
        </motion.div>

        {filmDrops.map((drop, index) => (
          <DiveDrop key={index} progress={progress} drop={drop} index={index} />
        ))}
        {swirlShots.map((shot, index) => (
          <DiveShot key={shot.src} progress={progress} shot={shot} index={index} />
        ))}

        <motion.div
          style={{ z: vs(-CORE_DEPTH + 0.02), opacity: flash, scale: form }}
          className="absolute inset-[18%] rounded-full bg-[radial-gradient(closest-side,#fff,rgba(207,250,254,.9)_30%,rgba(129,87,255,.5)_60%,transparent)] blur-md"
        />
      </motion.div>

      {/* The glass surface itself: a dome of light over the water, squashed
          to the same tilt as the rings below. */}
      <motion.div
        style={{ scaleY: lens, scale: form }}
        className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_32%_20%,rgba(255,255,255,.75),rgba(255,255,255,.12)_28%,transparent_42%),radial-gradient(ellipse_at_70%_88%,rgba(255,255,255,.35),transparent_30%)] shadow-[inset_0_3px_2px_rgba(255,255,255,.95),inset_0_-18px_44px_rgba(255,255,255,.22),0_40px_90px_-30px_rgba(129,87,255,.6)] ring-1 ring-white/60"
      />
    </motion.div>
  );
}

function GlassRing({
  progress,
  form,
  ring,
}: {
  progress: MotionValue<number>;
  form: MotionValue<number>;
  ring: (typeof funnel)[number];
}) {
  const scale = useTransform(form, (value) => ring.radius * value);
  const rotate = useScrub(progress, [0, T.split[1]], [0, ring.spin]);

  return (
    <motion.div style={{ z: ring.depth, scale }} className="absolute inset-0">
      <motion.div
        style={{ rotate, background: ring.colours, maskImage: ring.mask, WebkitMaskImage: ring.mask }}
        className="absolute inset-0 rounded-full opacity-90 saturate-150"
      />
      <div
        style={{ background: SPECULAR, maskImage: ring.mask, WebkitMaskImage: ring.mask }}
        className="absolute inset-0 rounded-full"
      />
      <div style={{ background: ring.edges }} className="absolute inset-0 rounded-full" />
    </motion.div>
  );
}

function Core({ progress, form }: { progress: MotionValue<number>; form: MotionValue<number> }) {
  const scale = useTransform(form, (value) => 0.3 * value);
  const spin = useScrub(progress, [0, T.split[1]], [0, -1100]);
  const glow = useScrub(progress, [T.push[0], T.push[1]], [0.75, 1]);

  return (
    <motion.div style={{ z: vs(-CORE_DEPTH), scale }} className="absolute inset-0">
      <motion.div
        style={{ opacity: glow }}
        className="absolute inset-[-30%] rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,.85),rgba(129,87,255,.45)_55%,transparent)] blur-xl"
      />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,#ffffff_0%,#cffafe_16%,#22d3ee_34%,#8157ff_64%,#4c1d95_88%,transparent_100%)]" />
      <motion.div
        style={{ rotate: spin }}
        className="absolute inset-0 rounded-full bg-[repeating-conic-gradient(rgba(255,255,255,.6)_0deg_4deg,transparent_4deg_24deg)] [mask-image:radial-gradient(closest-side,transparent_16%,#000_42%,transparent_94%)]"
      />
    </motion.div>
  );
}

function DiveDrop({
  progress,
  drop,
  index,
}: {
  progress: MotionValue<number>;
  drop: (typeof filmDrops)[number];
  index: number;
}) {
  const start = T.drops[0] + drop.lag;
  const end = T.drops[1] + drop.lag * 2;
  const phase = (value: number) => clamp01((value - start) / (end - start));
  const x = useTransform(progress, (value) => vs(orbit(drop.angle, drop.radius, phase(value), 1.15).x));
  const y = useTransform(progress, (value) => vs(orbit(drop.angle, drop.radius, phase(value), 1.15).y));
  const z = useTransform(progress, (value) => vs(orbit(drop.angle, drop.radius, phase(value), 1.15).z));
  const scale = useTransform(progress, (value) => 1 - 0.65 * easeIn(phase(value)));
  const opacity = useScrub(progress, [end - 0.02, end], [1, 0]);
  // Each drop leaves a ring on the water where it goes under.
  const ripple = useScrub(progress, [end - 0.012, end + 0.03], [0.08, 0.95], { ease: easeOut });
  const rippleOpacity = useScrub(progress, [end - 0.013, end - 0.008, end + 0.03], [0, 0.9, 0]);
  const palette = dropletPalettes[drop.palette];

  return (
    <>
      <motion.div
        style={{ z: 2, scale: ripple, opacity: rippleOpacity, boxShadow: `0 0 28px ${palette.shadow}, inset 0 0 18px ${palette.colors[0]}` }}
        className="absolute inset-0 rounded-full border-[length:calc(var(--vs)*0.006)] border-white/90"
      />
      <motion.div style={{ x, y, z, scale, transformStyle: "preserve-3d" }} className="absolute top-1/2 left-1/2">
        {/* Stood upright again, so a drop stays round on the tilted water. */}
        <motion.div
          style={{ opacity, rotateX: -TILT.rest }}
          className={`relative -translate-x-1/2 -translate-y-full ${drop.size}`}
        >
          <DropletBody palette={palette} delay={index * 0.7} />
        </motion.div>
      </motion.div>
    </>
  );
}

function DiveShot({
  progress,
  shot,
  index,
}: {
  progress: MotionValue<number>;
  shot: (typeof swirlShots)[number];
  index: number;
}) {
  const start = T.shots + index * T.shotGap;
  const end = start + T.shotLength;
  // In from beyond the top and the sides, never from the viewer's side.
  const angle = -165 + index * 16.5;
  const phase = (value: number) => clamp01((value - start) / (end - start));
  const x = useTransform(progress, (value) => vs(orbit(angle, 2.3, phase(value), 0.85).x));
  const y = useTransform(progress, (value) => vs(orbit(angle, 2.3, phase(value), 0.85).y));
  const z = useTransform(progress, (value) => vs(orbit(angle, 2.3, phase(value), 0.85).z + 0.01));
  const scale = useTransform(progress, (value) => 1 - 0.85 * easeIn(phase(value)));
  const rotate = useTransform(progress, (value) => angle + 90 + easeInOut(phase(value)) * 300);
  const opacity = useScrub(progress, [start, start + 0.01, end - 0.02, end], [0, 1, 1, 0]);

  return (
    <motion.div style={{ x, y, z, rotate, scale, transformStyle: "preserve-3d" }} className="absolute top-1/2 left-1/2">
      {/* Half raised off the water, so the screenshot still reads. */}
      <motion.div
        style={{ opacity, rotateX: -32, aspectRatio: String(shot.ratio) }}
        className="relative h-[calc(var(--vs)*0.2)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-band shadow-[0_18px_40px_-12px_rgb(0_0_0/0.4)] ring-1 ring-white/50"
      >
        <Image src={shot.src} alt="" fill sizes="(max-width: 640px) 30vw, 18vw" className="object-cover object-top" />
        <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.45),transparent_40%)]" />
      </motion.div>
    </motion.div>
  );
}

/* ───────────────────────── tiles ───────────────────────── */

// Seven wedges meeting at an impact point (58%, 42%): how a pane breaks.
const IMPACT = { x: 58, y: 42 };
const shards = [
  { points: "0% 0%, 45% 0%, 58% 42%, 0% 30%", cx: 26, cy: 18 },
  { points: "45% 0%, 100% 0%, 100% 20%, 58% 42%", cx: 76, cy: 15 },
  { points: "100% 20%, 100% 65%, 58% 42%", cx: 86, cy: 42 },
  { points: "100% 65%, 100% 100%, 70% 100%, 58% 42%", cx: 82, cy: 77 },
  { points: "70% 100%, 35% 100%, 58% 42%", cx: 54, cy: 80 },
  { points: "35% 100%, 0% 100%, 0% 70%, 58% 42%", cx: 23, cy: 78 },
  { points: "0% 70%, 0% 30%, 58% 42%", cx: 19, cy: 47 },
];
// The same seams, drawn as jagged cracks first, with a few short branches.
const cracks = [
  "M58 42 L50 19 L45 0",
  "M58 42 L80 29 L100 20",
  "M58 42 L81 55 L100 65",
  "M58 42 L67 71 L70 100",
  "M58 42 L45 70 L35 100",
  "M58 42 L29 57 L0 70",
  "M58 42 L31 37 L0 30",
  "M50 19 L38 13",
  "M81 55 L91 47",
  "M45 70 L54 83",
];
// Tile order → drop colours: blue-green, pink-violet, orange-pink.
const tilePalettes = [0, 2, 1];

function TileSlot({
  progress,
  project,
  index,
  onFocus,
}: {
  progress: MotionValue<number>;
  project: FeaturedProject;
  index: number;
  onFocus: () => void;
}) {
  const burst = T.burst + index * 0.006;
  const shatter = T.shatter + index * 0.012;
  const [crack0, crack1] = T.crack;
  const palette = dropletPalettes[tilePalettes[index % tilePalettes.length]];

  // The drop rises out of the whirlpool's core to this tile's place, then bursts.
  const split = useScrub(progress, T.split, [0, 1], { ease: easeOut });
  const blobScale = useScrub(progress, [T.split[0], T.split[1], burst, burst + 0.008], [0.3, 0.9, 1.2, 1.7]);
  const blobOpacity = useScrub(progress, [T.split[0], T.split[0] + 0.008, burst, burst + 0.008], [0, 1, 1, 0]);
  const ringScale = useScrub(progress, [burst, burst + 0.03], [0.4, 3.4], { ease: easeOut });
  const ringOpacity = useScrub(progress, [burst - 0.001, burst + 0.003, burst + 0.03], [0, 0.85, 0]);

  const tileScale = useSpring(useScrub(progress, [burst, burst + 0.022], [0.35, 1]), { stiffness: 220, damping: 15, mass: 0.6 });
  const tileOpacity = useScrub(progress, [burst, burst + 0.006, shatter - 0.001, shatter], [0, 1, 1, 0]);
  const float = useScrub(progress, T.hold, [10 + index * 4, -10 - index * 4]);
  const shake = useScrub(progress, [crack0, crack0 + 0.004, crack0 + 0.008, crack0 + 0.012, crack0 + 0.016, crack1], [0, -4, 4, -3, 2, 0]);
  const pointerEvents = useTransform(progress, (value) => (value > burst + 0.01 && value < shatter ? "auto" : "none"));
  const crackOpacity = useScrub(progress, [crack0, crack0 + 0.002, shatter - 0.001, shatter], [0, 1, 1, 0]);

  return (
    <li
      className="relative h-[7.5rem] [--sx:0px] [--sy:calc(var(--k)*8.25rem)] sm:h-auto sm:[--sx:calc(var(--k)*(var(--cw)+1.5rem))] sm:[--sy:0px] motion-reduce:h-auto"
      style={{ "--k": index - 1 } as CSSProperties}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center motion-reduce:hidden">
        <motion.div
          style={{ "--split": split } as MotionStyle}
          className="relative size-16 [transform:translate(calc(var(--sx)*(var(--split)-1)),calc(var(--sy)*(var(--split)-1)+(1-var(--split))*(4svh+var(--vs)*0.3)))] sm:size-24"
        >
          <motion.div style={{ scale: blobScale, opacity: blobOpacity }} className="absolute inset-0">
            <DropletBody palette={palette} delay={index} />
          </motion.div>
          <motion.span
            style={{ scale: ringScale, opacity: ringOpacity, borderColor: palette.colors[0], boxShadow: `0 0 40px ${palette.shadow}` }}
            className="absolute inset-0 rounded-full border-4"
          />
          {Array.from({ length: 10 }, (_, spark) => (
            <Spark key={spark} progress={progress} index={spark} burst={burst} color={palette.colors[spark % 2]} />
          ))}
        </motion.div>
      </div>

      <motion.div style={{ scale: tileScale, opacity: tileOpacity, y: float, x: shake, pointerEvents }} className="scroll-fx relative h-full">
        <Link
          href={`/library/projects/${project.id}`}
          onFocus={onFocus}
          className="group flex h-full gap-3 rounded-[1.4rem] bg-band p-2 shadow-[0_24px_60px_-24px_rgb(0_0_0/0.35)] ring-1 ring-foreground/5 transition-shadow focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground sm:block sm:rounded-[1.75rem] sm:p-2.5"
        >
          <TileFace project={project} />
        </Link>
        <motion.svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ opacity: crackOpacity }}
          className="pointer-events-none absolute inset-0 size-full overflow-visible motion-reduce:hidden"
        >
          {cracks.map((d, crack) => (
            <Crack key={crack} progress={progress} d={d} index={crack} />
          ))}
        </motion.svg>
      </motion.div>

      <div aria-hidden className="pointer-events-none absolute inset-0 motion-reduce:hidden">
        {shards.map((shard, piece) => (
          <Shard key={piece} progress={progress} shard={shard} index={piece} start={shatter}>
            <TileFace project={project} decorative />
          </Shard>
        ))}
      </div>
    </li>
  );
}

function TileFace({ project, decorative = false }: { project: FeaturedProject; decorative?: boolean }) {
  const Title = decorative ? "p" : "h3";

  return (
    <>
      <div className="relative aspect-16/10 h-full shrink-0 overflow-hidden rounded-[1rem] bg-background sm:h-auto sm:w-full sm:rounded-[1.25rem]">
        <Image
          src={project.image.src}
          alt={decorative ? "" : project.image.alt || project.title}
          fill
          sizes="(max-width: 640px) 40vw, 30vw"
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
      <div className="min-w-0 self-center pr-2 sm:px-3.5 sm:pt-5 sm:pb-4">
        <Title className="text-[1.02rem] leading-snug font-semibold text-foreground sm:headline-card">{project.title}</Title>
        <p className="mt-1 text-[0.82rem] leading-relaxed text-muted-foreground sm:mt-1.5 sm:text-base">{project.tagline}</p>
      </div>
    </>
  );
}

function Spark({ progress, index, burst, color }: { progress: MotionValue<number>; index: number; burst: number; color: string }) {
  const angle = (index / 10) * Math.PI * 2;
  const distance = 70 + (index % 3) * 26;
  const x = useScrub(progress, [burst, burst + 0.03], [0, Math.round(Math.cos(angle) * distance)], { ease: easeOut });
  const y = useScrub(progress, [burst, burst + 0.03], [0, Math.round(Math.sin(angle) * distance)], { ease: easeOut });
  const opacity = useScrub(progress, [burst - 0.001, burst + 0.002, burst + 0.03], [0, 1, 0]);

  return (
    <motion.span
      style={{ x, y, opacity, background: color, boxShadow: `0 0 12px ${color}` }}
      className="absolute top-1/2 left-1/2 -mt-1 -ml-1 size-2 rounded-full"
    />
  );
}

function Crack({ progress, d, index }: { progress: MotionValue<number>; d: string; index: number }) {
  const start = T.crack[0] + (index < 7 ? index * 0.004 : 0.03 + (index - 7) * 0.003);
  const length = useScrub(progress, [start, start + 0.016], [0, 1], { ease: easeOut });

  return (
    <>
      <motion.path d={d} fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth="3" vectorEffect="non-scaling-stroke" style={{ pathLength: length }} />
      <motion.path d={d} fill="none" stroke="#fff" strokeWidth="1.5" vectorEffect="non-scaling-stroke" style={{ pathLength: length }} />
    </>
  );
}

function Shard({
  progress,
  shard,
  index,
  start,
  children,
}: {
  progress: MotionValue<number>;
  shard: (typeof shards)[number];
  index: number;
  start: number;
  children: ReactNode;
}) {
  // Pieces near the impact go first; each one parts a little, then drops.
  const distance = Math.hypot(shard.cx - IMPACT.x, shard.cy - IMPACT.y);
  const delay = start + distance * 0.0002 + index * 0.003;
  const end = delay + T.fall;
  const drift = ((shard.cx - IMPACT.x) * 0.14).toFixed(2);
  const x = useScrub(progress, [delay, delay + 0.008, end], ["0vw", `${(Number(drift) * 0.25).toFixed(2)}vw`, `${drift}vw`]);
  const y = useScrub(progress, [delay, delay + 0.008, end], ["0svh", `${((shard.cy - IMPACT.y) * 0.04).toFixed(2)}svh`, `${75 + ((index * 17) % 35)}svh`], {
    ease: easeIn,
  });
  const rotate = useScrub(progress, [delay, end], [0, (index % 2 ? 1 : -1) * (25 + index * 11)]);
  const opacity = useScrub(progress, [start - 0.001, start, end - 0.03, end], [0, 1, 1, 0]);

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        opacity,
        clipPath: `polygon(${shard.points})`,
        transformOrigin: `${shard.cx}% ${shard.cy}%`,
      }}
      className="absolute inset-0 flex gap-3 rounded-[1.4rem] bg-band p-2 sm:block sm:rounded-[1.75rem] sm:p-2.5"
    >
      {children}
      <span className="absolute inset-0 rounded-[inherit] ring-1 ring-white/50 ring-inset" />
    </motion.div>
  );
}

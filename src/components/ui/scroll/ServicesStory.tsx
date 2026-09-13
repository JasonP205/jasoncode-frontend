"use client";

import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ChevronRight, Globe2, Layers3, MousePointer2, Search, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useFilm } from "./useFilm";

type Chapter = {
  eyebrow: string;
  title: string;
  description: string;
};

type ServicesStoryProps = {
  label: string;
  heading: string;
  chapters: Chapter[];
  progressLabels: string[];
  speedUnit: string;
  mergeLabel: string;
  seoBurst: [string, string];
  cta: string;
};

const spring = { stiffness: 145, damping: 20, mass: 0.58 };
const vivid = ["#ff375f", "#ff9f0a", "#ffd60a", "#30d158", "#64d2ff", "#0a84ff", "#bf5af2"];

/**
 * One continuous, scroll-scrubbed product film. The visual material is never
 * replaced without a reason: colour ribbons become pages, page modules become
 * an ad, and the same modules burst outward to draw the performance watch.
 */
export default function ServicesStory({
  label,
  heading,
  chapters,
  progressLabels,
  speedUnit,
  mergeLabel,
  seoBurst,
  cta,
}: ServicesStoryProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Fades in over the work film's falling shards; hands over to the profile
  // film while "SEO" is still on screen.
  const { progress: scrollYProgress, frame } = useFilm(ref, 520, { enters: true, leaves: true });

  const isVietnamese = speedUnit === "điểm hiệu năng";
  // Motion hands these `opacity` scrubs to a browser ViewTimeline animation.
  // When an input range stops short of 1, the browser fills the tail with the
  // element's first-render value — a layer that ends at a different opacity
  // than it starts at must pin that value at 1, or it fades back in.
  const introOpacity = useTransform(scrollYProgress, [0, 0.035, 0.2, 0.27], [0, 1, 1, 0]);
  const phoneOpacity = useTransform(scrollYProgress, [0, 0.035, 0.6, 0.69, 1], [0.25, 1, 1, 0, 0]);
  const phoneScale = useSpring(
    useTransform(scrollYProgress, [0, 0.08, 0.58, 0.68], [0.62, 1, 1, 0.56]),
    spring,
  );
  const phoneY = useTransform(scrollYProgress, [0, 0.08, 0.58, 0.68], [80, 0, 0, 34]);
  const watchOpacity = useTransform(scrollYProgress, [0.615, 0.69, 0.835, 0.89], [0, 1, 1, 0]);
  const watchScale = useSpring(
    useTransform(scrollYProgress, [0.61, 0.7, 0.83, 0.9], [0.18, 1, 1.03, 1.45]),
    { stiffness: 190, damping: 18, mass: 0.52 },
  );

  return (
    <section id="services" className="relative -mt-[100svh] text-foreground motion-reduce:mt-0">
      <div ref={ref} className="relative h-[520svh]">
        <motion.div style={frame} className="sticky top-0 h-svh min-h-[35rem] overflow-hidden bg-background">
          <FilmAtmosphere progress={scrollYProgress} />

          <motion.header
            style={{ opacity: introOpacity }}
            className="absolute inset-x-5 top-[clamp(4.75rem,9svh,7rem)] z-30 text-center sm:inset-x-8"
          >
            <p className="font-mono text-[0.65rem] font-medium tracking-[0.18em] text-foreground/50 uppercase sm:text-xs">
              {label} · iPhone 17
            </p>
            <h2 className="mx-auto mt-3 max-w-4xl text-[clamp(1.85rem,1.2rem+2.7vw,4rem)] leading-[1.02] font-semibold tracking-[-0.055em] text-foreground">
              {heading}
            </h2>
          </motion.header>

          <div
            aria-hidden
            className="absolute inset-x-0 top-[18svh] bottom-[23svh] z-10 flex items-center justify-center motion-reduce:hidden sm:top-[20svh] sm:bottom-[21svh]"
          >
            <ColorStreams progress={scrollYProgress} labels={progressLabels} />

            <motion.div
              style={{ opacity: phoneOpacity, scale: phoneScale, y: phoneY }}
              className="absolute z-20"
            >
              <IPhone17 label={isVietnamese ? "iPhone 17 của Phúc" : "Phúc’s iPhone 17"}>
                <ManyPagesScene progress={scrollYProgress} isVietnamese={isVietnamese} />
                <LandingScene progress={scrollYProgress} mergeLabel={mergeLabel} isVietnamese={isVietnamese} />
              </IPhone17>
            </motion.div>

            <MorphFragments progress={scrollYProgress} />

            <motion.div
              style={{ opacity: watchOpacity, scale: watchScale }}
              className="absolute z-30"
            >
              <PerformanceWatch progress={scrollYProgress} speedUnit={speedUnit} />
            </motion.div>

            <SeoFinale progress={scrollYProgress} lines={seoBurst} />
          </div>

          <div
            aria-hidden
            className="absolute inset-x-5 top-[22svh] bottom-[24svh] hidden items-center justify-center motion-reduce:flex"
          >
            <div className="grid w-full max-w-3xl grid-cols-[1fr_auto_1fr] items-center gap-5">
              <div className="mx-auto h-48 w-24 rounded-[2rem] border-2 border-foreground/40 bg-[#101014] p-2">
                <div className="flex h-full flex-col gap-2 rounded-[1.45rem] bg-white p-3">
                  <span className="h-14 rounded-xl bg-linear-to-br from-[#7857ff] to-[#ff467e]" />
                  <span className="h-5 rounded-lg bg-[#22c990]" />
                  <span className="h-10 rounded-lg bg-[#ff9f0a]" />
                </div>
              </div>
              <span className="text-xl text-foreground/35">→</span>
              <div className="mx-auto flex size-40 items-center justify-center rounded-[2.8rem] border-4 border-foreground/40 bg-[#111116] text-5xl font-semibold text-white tabular-nums shadow-2xl">
                100
              </div>
            </div>
          </div>

          <div
            aria-hidden
            className="absolute inset-x-5 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-40 mx-auto h-[6.7rem] max-w-2xl text-center motion-reduce:hidden md:bottom-12"
          >
            {chapters.slice(0, 3).map((chapter, index) => (
              <ChapterCopy key={chapter.eyebrow} chapter={chapter} index={index} progress={scrollYProgress} />
            ))}
          </div>

          <div className="absolute inset-x-5 bottom-[calc(1.2rem+env(safe-area-inset-bottom))] z-50 flex items-end gap-4 md:inset-x-8 md:bottom-7">
            <div aria-hidden className="min-w-0 flex-1 motion-reduce:hidden">
              <ProgressRail labels={progressLabels} progress={scrollYProgress} />
            </div>
            <Link
              href="/services"
              className="group ml-auto inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background shadow-[0_8px_30px_rgb(0_0_0/0.2)] transition-transform hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground sm:h-auto dark:shadow-[0_8px_30px_rgb(0_0_0/0.35)] sm:w-auto sm:px-5 sm:py-3"
            >
              <span className="sr-only sm:not-sr-only">{cta}</span>
              <ChevronRight className="size-5 transition-transform group-hover:translate-x-0.5 sm:ml-1" aria-hidden />
            </Link>
          </div>

          <div className="sr-only">
            <ol>
              {chapters.slice(0, 3).map((chapter) => (
                <li key={chapter.eyebrow}>
                  <h3>{chapter.title}</h3>
                  <p>{chapter.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FilmAtmosphere({ progress }: { progress: MotionValue<number> }) {
  const purple = useTransform(progress, [0, 0.25, 0.5, 0.8, 1], [0.18, 0.42, 0.16, 0.3, 0.08]);
  const blue = useTransform(progress, [0, 0.3, 0.55, 0.82, 1], [0.24, 0.1, 0.38, 0.18, 0.06]);
  const flareScale = useTransform(progress, [0.82, 1], [0.35, 2.4]);
  const flareOpacity = useTransform(progress, [0.82, 0.92, 1], [0, 0.22, 0.05]);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <motion.div
        style={{ opacity: purple }}
        className="absolute -top-[30%] left-[5%] h-[70%] w-[75%] rounded-full bg-[#a78bfa] blur-[140px] dark:bg-[#7d45ff]"
      />
      <motion.div
        style={{ opacity: blue }}
        className="absolute -right-[15%] top-[18%] h-[72%] w-[65%] rounded-full bg-[#60a5fa] blur-[150px] dark:bg-[#007aff]"
      />
      <motion.div
        style={{ scale: flareScale, opacity: flareOpacity }}
        className="absolute left-1/2 top-1/2 size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c4b5fd] blur-[120px] dark:bg-white"
      />
      <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_center,rgba(0,0,0,.22)_0.7px,transparent_0.8px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,transparent,black_22%,black_78%,transparent)] dark:[background-image:radial-gradient(circle_at_center,rgba(255,255,255,.2)_0.7px,transparent_0.8px)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--background)_20%,transparent),transparent_18%,transparent_74%,color-mix(in_oklab,var(--background)_92%,transparent))]" />
    </div>
  );
}

function IPhone17({ label, children }: { label: string; children: ReactNode }) {
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const glareX = useMotionValue("50%");
  const glareY = useMotionValue("18%");
  const rotateX = useSpring(rawRotateX, { stiffness: 250, damping: 25, mass: 0.55 });
  const rotateY = useSpring(rawRotateY, { stiffness: 250, damping: 25, mass: 0.55 });
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,.5), rgba(255,255,255,.08) 24%, transparent 52%)`;

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    rawRotateY.set((x - 0.5) * 11);
    rawRotateX.set((0.5 - y) * 8);
    glareX.set(`${Math.round(x * 100)}%`);
    glareY.set(`${Math.round(y * 100)}%`);
  }

  function resetTilt() {
    rawRotateX.set(0);
    rawRotateY.set(0);
  }

  return (
    <div className="relative [perspective:1100px]">
      <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[0.58rem] font-medium tracking-[0.16em] text-foreground/50 uppercase">
        {label}
      </span>
      <motion.div
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        onPointerCancel={resetTilt}
        whileHover={{ scale: 1.015 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", aspectRatio: "71.5 / 149.6" }}
        className="group relative h-[min(51svh,32rem)] cursor-grab rounded-[2.8rem] bg-linear-to-br from-[#fafafa] via-[#c7c8cc] to-[#63656a] p-[3px] shadow-[0_45px_100px_-24px_rgb(0_0_0/.5),0_0_0_1px_rgb(255_255_255/.28),inset_1px_1px_2px_rgb(255_255_255/.95)] active:cursor-grabbing dark:shadow-[0_45px_100px_-24px_rgb(0_0_0/.85),0_0_0_1px_rgb(255_255_255/.28),inset_1px_1px_2px_rgb(255_255_255/.95)] sm:rounded-[3.25rem]"
      >
        <div className="relative size-full rounded-[2.62rem] bg-[#08080a] p-[5px] shadow-[inset_0_0_0_1px_rgb(0_0_0/.85)] sm:rounded-[3.05rem] sm:p-[6px]">
          <div className="relative size-full overflow-hidden rounded-[2.32rem] bg-[#09090c] sm:rounded-[2.7rem]">
            <div className="absolute top-[1.65%] left-1/2 z-50 flex h-[4.8%] w-[31%] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-[8%] shadow-[inset_0_1px_1px_rgb(255_255_255/.12)]">
              <span className="size-[0.28rem] rounded-full bg-[#151a28] ring-1 ring-[#2a3550]" />
            </div>
            {children}
            <span className="absolute bottom-[1.2%] left-1/2 z-50 h-[0.75%] w-[34%] -translate-x-1/2 rounded-full bg-white/85" />
          </div>
        </div>
        <motion.span
          style={{ background: glare, translateZ: 18 }}
          className="pointer-events-none absolute inset-[3px] z-[60] rounded-[2.7rem] opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-60 sm:rounded-[3.1rem]"
        />
        <span className="absolute -right-[3px] top-[25%] h-[14%] w-[3px] rounded-r-full bg-linear-to-b from-white to-[#83858a]" />
        <span className="absolute -left-[3px] top-[20%] h-[8%] w-[3px] rounded-l-full bg-linear-to-b from-white to-[#83858a]" />
        <span className="absolute -left-[3px] top-[32%] h-[13%] w-[3px] rounded-l-full bg-linear-to-b from-white to-[#83858a]" />
        <span className="absolute -left-[3px] top-[48%] h-[13%] w-[3px] rounded-l-full bg-linear-to-b from-white to-[#83858a]" />
      </motion.div>
    </div>
  );
}

function ManyPagesScene({ progress, isVietnamese }: { progress: MotionValue<number>; isVietnamese: boolean }) {
  const opacity = useTransform(progress, [0.035, 0.085, 0.245, 0.3], [0, 1, 1, 0]);
  const titleY = useTransform(progress, [0.07, 0.14], [24, 0]);
  const titleScale = useTransform(progress, [0.07, 0.14], [0.78, 1]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_50%_5%,#34305f_0%,#11111a_43%,#07070a_100%)]"
    >
      <div className="absolute inset-x-[10%] top-[10%] flex items-center justify-between text-[0.42rem] font-semibold tracking-[0.08em] text-white/55 uppercase">
        <span>J.</span>
        <span className="h-px w-[42%] bg-white/15" />
        <Globe2 className="size-3" />
      </div>
      <div className="absolute inset-x-0 top-[18%] h-[49%]">
        <PageCard progress={progress} index={0} className="left-[8%] top-[24%] -rotate-9" tone="bg-[#ff375f]" />
        <PageCard progress={progress} index={1} className="right-[7%] top-[15%] rotate-8" tone="bg-[#0a84ff]" />
        <PageCard progress={progress} index={2} className="left-[25%] top-[3%] rotate-1" tone="bg-[#bf5af2]" featured />
        <PageCard progress={progress} index={3} className="left-[5%] top-[58%] rotate-6" tone="bg-[#30d158]" />
        <PageCard progress={progress} index={4} className="right-[5%] top-[56%] -rotate-7" tone="bg-[#ff9f0a]" />
      </div>
      <motion.div style={{ y: titleY, scale: titleScale }} className="absolute inset-x-[8%] bottom-[9%] text-center">
        <span className="mx-auto mb-2 flex size-8 items-center justify-center rounded-full bg-white text-black">
          <Layers3 className="size-4" />
        </span>
        <p className="text-[clamp(0.96rem,2.5vw,1.25rem)] leading-[1.02] font-semibold tracking-[-0.055em] text-white">
          {isVietnamese ? "Website với nhiều trang." : "A website with many pages."}
        </p>
        <p className="mt-1 text-[0.48rem] tracking-[0.08em] text-white/45 uppercase">
          About · Work · Services · Contact
        </p>
      </motion.div>
    </motion.div>
  );
}

function PageCard({
  progress,
  index,
  className,
  tone,
  featured = false,
}: {
  progress: MotionValue<number>;
  index: number;
  className: string;
  tone: string;
  featured?: boolean;
}) {
  const start = 0.045 + index * 0.012;
  const y = useSpring(useTransform(progress, [start, start + 0.09], [120 + index * 14, 0]), spring);
  const scale = useSpring(useTransform(progress, [start, start + 0.09], [0.42, 1]), spring);
  const rotateY = useTransform(progress, [start, start + 0.1], [46, 0]);

  return (
    <motion.div
      style={{ y, scale, rotateY }}
      className={`absolute h-[43%] w-[38%] rounded-[0.8rem] border border-white/15 bg-[#f7f7f8] p-[5%] shadow-[0_18px_45px_rgb(0_0_0/.5)] ${className} ${featured ? "z-10" : ""}`}
    >
      <span className={`block h-[34%] rounded-[0.4rem] ${tone}`} />
      <span className="mt-[10%] block h-[5%] w-[78%] rounded-full bg-[#16161a]" />
      <span className="mt-[7%] block h-[4%] w-[55%] rounded-full bg-[#c8c8cc]" />
      <span className="mt-[14%] block h-[15%] rounded-[0.35rem] bg-[#e7e7ea]" />
    </motion.div>
  );
}

const streamData = [
  { x: -440, y: -150, rotate: -17 },
  { x: 420, y: -110, rotate: 14 },
  { x: -500, y: 40, rotate: 9 },
  { x: 470, y: 65, rotate: -12 },
  { x: -390, y: 210, rotate: -8 },
  { x: 430, y: 230, rotate: 11 },
  { x: 0, y: -330, rotate: 3 },
];

function ColorStreams({ progress, labels }: { progress: MotionValue<number>; labels: string[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {streamData.map((item, index) => (
        <ColorRibbon
          key={`${item.x}-${item.y}`}
          progress={progress}
          index={index}
          label={labels[index % Math.max(labels.length, 1)] ?? "Web"}
          {...item}
        />
      ))}
    </div>
  );
}

function ColorRibbon({
  progress,
  index,
  label,
  x: sourceX,
  y: sourceY,
  rotate: sourceRotate,
}: {
  progress: MotionValue<number>;
  index: number;
  label: string;
  x: number;
  y: number;
  rotate: number;
}) {
  const start = index * 0.008;
  const x = useSpring(useTransform(progress, [start, 0.14, 0.235], [sourceX * 1.25, sourceX, 0]), spring);
  const y = useSpring(useTransform(progress, [start, 0.14, 0.235], [sourceY * 1.15, sourceY, 0]), spring);
  const rotate = useTransform(progress, [start, 0.14, 0.235], [sourceRotate * 1.7, sourceRotate, 0]);
  const scale = useTransform(progress, [start, 0.12, 0.22, 0.255], [0.6, 1, 0.25, 0]);
  const opacity = useTransform(progress, [start, start + 0.03, 0.2, 0.25], [0, 1, 0.9, 0]);

  return (
    <motion.div
      style={{ x, y, rotate, scale, opacity, background: vivid[index % vivid.length] }}
      className="absolute left-1/2 top-1/2 flex h-8 min-w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full px-5 text-[0.6rem] font-bold tracking-[0.1em] text-white uppercase shadow-[0_14px_38px_rgb(0_0_0/.2),inset_0_1px_1px_rgb(255_255_255/.35)] sm:h-10 sm:min-w-36 dark:shadow-[0_14px_38px_rgb(0_0_0/.42),inset_0_1px_1px_rgb(255_255_255/.35)]"
    >
      {label}
    </motion.div>
  );
}

function LandingScene({
  progress,
  mergeLabel,
  isVietnamese,
}: {
  progress: MotionValue<number>;
  mergeLabel: string;
  isVietnamese: boolean;
}) {
  const opacity = useTransform(progress, [0.275, 0.325, 0.59, 0.65], [0, 1, 1, 0]);
  const screenFlash = useTransform(progress, [0.28, 0.34, 1], [0.6, 0, 0]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 overflow-hidden bg-[#f3f1eb] text-[#111114]">
      <motion.div style={{ opacity: screenFlash }} className="absolute inset-0 z-40 bg-white" />
      <LandingPiece progress={progress} index={0} className="inset-x-[8%] top-[10%] h-[8%] rounded-full bg-white px-[8%] shadow-sm">
        <span className="h-[14%] w-[22%] rounded-full bg-black" />
        <Search className="size-[14%] text-black/55" />
      </LandingPiece>
      <LandingPiece progress={progress} index={1} className="inset-x-[7%] top-[21%] h-[31%] overflow-hidden rounded-[1.2rem] bg-[#7657ff] p-[9%] text-white">
        <div className="absolute -right-[18%] -bottom-[34%] size-[82%] rounded-full bg-[#ffca65]" />
        <div className="absolute -right-[9%] top-[8%] size-[43%] rounded-full bg-[#ff477e] blur-sm" />
        <div className="relative z-10">
          <span className="block h-2 w-[28%] rounded-full bg-white/55" />
          <p className="mt-[12%] whitespace-pre-line text-[clamp(0.75rem,2vw,1rem)] leading-[0.98] font-bold tracking-[-0.055em]">
            {isVietnamese ? "Một trang.\nĐủ nổi bật." : "One page.\nImpossible to miss."}
          </p>
        </div>
      </LandingPiece>
      <LandingPiece progress={progress} index={2} className="left-[7%] top-[55%] h-[15%] w-[41%] rounded-[1rem] bg-[#ff9f0a] p-[8%]">
        <Sparkles className="size-[36%] text-black" />
      </LandingPiece>
      <LandingPiece progress={progress} index={3} className="right-[7%] top-[55%] h-[15%] w-[41%] rounded-[1rem] bg-[#30d158] p-[8%]">
        <span className="block h-[14%] w-[58%] rounded-full bg-black/80" />
        <span className="mt-[12%] block h-[10%] w-[78%] rounded-full bg-black/25" />
      </LandingPiece>
      <LandingPiece progress={progress} index={4} className="inset-x-[7%] top-[73%] h-[8%] rounded-full bg-black px-[9%] text-white shadow-lg">
        <span className="text-[0.48rem] font-semibold tracking-[0.05em] uppercase">{mergeLabel}</span>
        <MousePointer2 className="size-[13%] text-[#64d2ff]" fill="currentColor" />
      </LandingPiece>
      <LandingPiece progress={progress} index={5} className="left-[7%] top-[84%] h-[3%] w-[55%] rounded-full bg-black/12" />
      <LandingPiece progress={progress} index={6} className="right-[7%] top-[84%] h-[3%] w-[23%] rounded-full bg-[#ff375f]" />
    </motion.div>
  );
}

function LandingPiece({
  progress,
  index,
  className,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  className: string;
  children?: ReactNode;
}) {
  const start = 0.285 + index * 0.018;
  const y = useSpring(useTransform(progress, [start, start + 0.095, 0.57, 0.645], [-260 - index * 36, 0, 0, 170 + index * 42]), {
    stiffness: 185,
    damping: 20,
    mass: 0.5,
  });
  const rotate = useTransform(progress, [start, start + 0.095, 0.57, 0.645], [index % 2 ? 12 : -11, 0, 0, index % 2 ? 24 : -22]);
  const scale = useTransform(progress, [start, start + 0.09, 0.59, 0.65], [0.72, 1, 1, 0.65]);
  const opacity = useTransform(progress, [start, start + 0.035, 0.6, 0.65], [0, 1, 1, 0]);

  return (
    <motion.div
      style={{ y, rotate, scale, opacity }}
      className={`absolute flex items-center justify-between ${className}`}
    >
      {children}
    </motion.div>
  );
}

const fragmentData = Array.from({ length: 14 }, (_, index) => {
  const angle = (index / 14) * Math.PI * 2 - Math.PI / 2;
  const radius = index % 2 === 0 ? 180 : 150;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    rotate: (index / 14) * 360,
  };
});

function MorphFragments({ progress }: { progress: MotionValue<number> }) {
  const flashOpacity = useTransform(progress, [0.59, 0.625, 0.69], [0, 0.5, 0]);
  const flashScale = useTransform(progress, [0.59, 0.68], [0.1, 2.4]);

  return (
    <div className="pointer-events-none absolute inset-0 z-25">
      <motion.span
        style={{ opacity: flashOpacity, scale: flashScale }}
        className="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c4b5fd] blur-3xl dark:bg-white"
      />
      {fragmentData.map((item, index) => (
        <MorphFragment key={index} progress={progress} index={index} {...item} />
      ))}
    </div>
  );
}

function MorphFragment({
  progress,
  index,
  x: targetX,
  y: targetY,
  rotate: targetRotate,
}: {
  progress: MotionValue<number>;
  index: number;
  x: number;
  y: number;
  rotate: number;
}) {
  const delay = (index % 4) * 0.006;
  const x = useSpring(useTransform(progress, [0.585 + delay, 0.69, 0.755], [0, targetX, targetX * 1.03]), spring);
  const y = useSpring(useTransform(progress, [0.585 + delay, 0.69, 0.755], [0, targetY, targetY * 1.03]), spring);
  const rotate = useTransform(progress, [0.585 + delay, 0.7], [0, targetRotate + 90]);
  const scale = useTransform(progress, [0.58 + delay, 0.62, 0.71, 0.78], [0, 1, 0.5, 0]);
  const opacity = useTransform(progress, [0.58 + delay, 0.615, 0.72, 0.78], [0, 1, 0.8, 0]);

  return (
    <motion.span
      style={{ x, y, rotate, scale, opacity, background: vivid[index % vivid.length] }}
      className="absolute left-1/2 top-1/2 h-14 w-8 -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-[0_12px_32px_rgb(0_0_0/.35),inset_0_1px_1px_rgb(255_255_255/.35)] sm:h-16 sm:w-9"
    />
  );
}

function PerformanceWatch({ progress, speedUnit }: { progress: MotionValue<number>; speedUnit: string }) {
  const [score, setScore] = useState(0);
  const ringLength = useTransform(progress, [0.65, 0.82], [0, 1]);
  const glowOpacity = useTransform(progress, [0.65, 0.77, 0.85, 1], [0.1, 0.55, 0.9, 0.9]);
  const scoreScale = useSpring(useTransform(progress, [0.65, 0.82], [0.65, 1]), {
    stiffness: 220,
    damping: 18,
    mass: 0.45,
  });

  useMotionValueEvent(progress, "change", (latest) => {
    const normalized = Math.min(Math.max((latest - 0.655) / 0.17, 0), 1);
    setScore(Math.round(normalized * 100));
  });

  return (
    <div className="relative size-[min(67vw,25rem)]">
      <motion.div
        style={{ opacity: glowOpacity }}
        className="absolute -inset-[12%] rounded-full bg-[conic-gradient(from_45deg,#ff375f,#ff9f0a,#ffd60a,#30d158,#64d2ff,#0a84ff,#bf5af2,#ff375f)] blur-[65px]"
      />
      <div className="absolute inset-0 rounded-[30%] bg-linear-to-br from-white via-[#b9bbc0] to-[#55575c] p-[5px] shadow-[0_55px_100px_-35px_rgb(0_0_0/.55),inset_2px_2px_3px_rgb(255_255_255/.95)] dark:shadow-[0_55px_100px_-35px_rgb(0_0_0/.9),inset_2px_2px_3px_rgb(255_255_255/.95)]">
        <div className="relative size-full overflow-hidden rounded-[28%] bg-[#08080a] shadow-[inset_0_0_0_1px_rgb(255_255_255/.1)]">
          <svg viewBox="0 0 240 240" className="absolute inset-[8%] size-[84%] -rotate-90 overflow-visible">
            <circle cx="120" cy="120" r="96" fill="none" stroke="rgba(255,255,255,.09)" strokeWidth="12" />
            <motion.circle
              cx="120"
              cy="120"
              r="96"
              fill="none"
              stroke="url(#watch-ring)"
              strokeWidth="12"
              strokeLinecap="round"
              pathLength="1"
              style={{ pathLength: ringLength }}
            />
            <defs>
              <linearGradient id="watch-ring" x1="0" y1="0" x2="240" y2="240">
                <stop stopColor="#64d2ff" />
                <stop offset="0.5" stopColor="#30d158" />
                <stop offset="1" stopColor="#ffd60a" />
              </linearGradient>
            </defs>
          </svg>
          {Array.from({ length: 12 }, (_, index) => (
            <span
              key={index}
              className="absolute inset-[4%]"
              style={{ transform: `rotate(${index * 30}deg)` }}
            >
              <span
                className="absolute left-1/2 top-0 h-[4%] w-[2px] -translate-x-1/2 rounded-full"
                style={{ background: vivid[index % vivid.length] }}
              />
            </span>
          ))}
          <motion.div style={{ scale: scoreScale }} className="absolute inset-0 flex flex-col items-center justify-center pt-[2%]">
            <span className="text-[clamp(3rem,12vw,6rem)] leading-none font-semibold tracking-[-0.085em] text-white tabular-nums">
              {score}
            </span>
            <span className="mt-2 max-w-[62%] text-center font-mono text-[clamp(0.5rem,1.4vw,0.72rem)] font-medium tracking-[0.12em] text-white/45 uppercase">
              {speedUnit}
            </span>
          </motion.div>
        </div>
      </div>
      <span className="absolute -right-[3.6%] top-[28%] h-[17%] w-[4%] rounded-r-lg bg-linear-to-b from-white to-[#74767a] shadow-lg" />
    </div>
  );
}

function SeoFinale({ progress, lines }: { progress: MotionValue<number>; lines: [string, string] }) {
  const opacity = useTransform(progress, [0.855, 0.91, 1], [0, 1, 1]);
  const y = useTransform(progress, [0.855, 0.94], [42, 0]);
  const tracking = useTransform(progress, [0.855, 0.94], ["0.08em", "-0.075em"]);

  return (
    <motion.div
      style={{ opacity, y, letterSpacing: tracking }}
      className="absolute inset-x-4 top-1/2 z-40 -translate-y-1/2 text-center font-semibold"
    >
      <span className="block text-[clamp(2rem,7vw,5rem)] leading-[1.15] text-foreground">{lines[0]}</span>
      <span className="mt-2 block bg-[linear-gradient(105deg,#64d2ff_0%,#30d158_24%,#ffd60a_48%,#ff375f_70%,#bf5af2_100%)] bg-clip-text text-[clamp(5rem,18vw,13rem)] leading-[0.72] text-transparent">
        {lines[1]}
      </span>
      <span className="mx-auto mt-7 flex w-fit items-center gap-2 font-mono text-[0.62rem] tracking-[0.16em] text-foreground/50 uppercase">
        <span className="size-1.5 animate-pulse rounded-full bg-[#30d158]" />
        Search ready
      </span>
    </motion.div>
  );
}

function ChapterCopy({
  chapter,
  index,
  progress,
}: {
  chapter: Chapter;
  index: number;
  progress: MotionValue<number>;
}) {
  const ranges = [
    [0.015, 0.055, 0.245, 0.29],
    [0.29, 0.335, 0.57, 0.625],
    [0.64, 0.69, 0.82, 0.865],
  ];
  const [a, b, c, d] = ranges[index];
  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  const y = useTransform(progress, [a, b, c, d], [16, 0, 0, -14]);

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0">
      <p className="font-mono text-[0.66rem] font-medium tracking-[0.16em] text-foreground/50 uppercase sm:text-xs">
        {chapter.eyebrow}
      </p>
      <h3 className="mt-1.5 text-[clamp(1.08rem,0.9rem+0.85vw,1.65rem)] leading-tight font-semibold tracking-[-0.035em] text-foreground">
        {chapter.title}
      </h3>
      <p className="mx-auto mt-1.5 hidden max-w-xl text-sm leading-relaxed text-foreground/60 sm:block">
        {chapter.description}
      </p>
    </motion.div>
  );
}

function ProgressRail({ labels, progress }: { labels: string[]; progress: MotionValue<number> }) {
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <div className="w-full max-w-[30rem] sm:w-[min(50vw,30rem)]">
      <div className="relative h-px overflow-hidden bg-foreground/15">
        <motion.span
          style={{ width }}
          className="absolute inset-y-0 left-0 bg-linear-to-r from-[#64d2ff] via-[#ff375f] to-[#bf5af2]"
        />
      </div>
      <div className="mt-2 grid grid-cols-3 gap-3 text-[0.6rem] font-medium text-foreground/50 sm:text-[0.68rem]">
        {labels.slice(0, 3).map((label, index) => (
          <span key={label} className={index === 1 ? "text-center" : index === 2 ? "text-right" : ""}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

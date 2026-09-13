"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

type Shot = { src: string; ratio: number };

// Hand-picked so each row alternates wide screens with tall ones — the rhythm
// of Apple's poster rows. `ratio` is width / height of the source image.
const rowA: Shot[] = [
  { src: "/project-screenshots/bamboo/hero-section.jpg", ratio: 1.5 },
  { src: "/project-screenshots/gohike/home-beautified.png", ratio: 0.49 },
  { src: "/project-screenshots/l3go/home.png", ratio: 1.76 },
  { src: "/project-screenshots/bamboo/signature-dishes.jpg", ratio: 0.67 },
  { src: "/project-screenshots/tlux/tlux.png", ratio: 1.76 },
  { src: "/project-screenshots/gohike/map-beautified.png", ratio: 0.49 },
  { src: "/project-screenshots/chap/home.png", ratio: 1.76 },
  { src: "/project-screenshots/l3go/glass-wall.jpg", ratio: 1.5 },
];

const rowB: Shot[] = [
  { src: "/project-screenshots/l3go/exterior-night.jpg", ratio: 0.84 },
  { src: "/project-screenshots/bamboo/manager.png", ratio: 1.78 },
  { src: "/project-screenshots/gohike/analytics-beautified.png", ratio: 0.49 },
  { src: "/project-screenshots/bamboo/menu.png", ratio: 1.76 },
  { src: "/project-screenshots/l3go/mesh-screen.jpg", ratio: 1.5 },
  { src: "/project-screenshots/gohike/achievement-beautified.png", ratio: 0.49 },
  { src: "/project-screenshots/bamboo/flycam.jpg", ratio: 1.5 },
  { src: "/project-screenshots/gohike/home.png", ratio: 1.76 },
];

/**
 * A wall of the work, moving with the page: two tilted rows of project
 * screenshots slide in opposite directions as the band scrolls through the
 * viewport (scroll-linked, no autoplay — it only moves when the visitor does).
 *
 * Purely visual: hidden from assistive tech, the project tiles below carry the
 * same work with names and links. Rows are repeated so no edge ever shows.
 */
export default function ProjectWall() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const xA = useTransform(scrollYProgress, [0, 1], ["-8%", "-30%"]);
  const xB = useTransform(scrollYProgress, [0, 1], ["-30%", "-8%"]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative overflow-hidden py-10 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] sm:py-16"
    >
      <div className="flex -rotate-[4deg] scale-110 flex-col gap-3 sm:gap-4">
        <Row shots={rowA} x={xA} />
        <Row shots={rowB} x={xB} />
      </div>
    </div>
  );
}

function Row({ shots, x }: { shots: Shot[]; x: MotionValue<string> }) {
  const loop = [...shots, ...shots];
  return (
    <motion.ul style={{ x }} className="scroll-fx flex w-max gap-3 sm:gap-4">
      {loop.map((shot, index) => (
        <li
          key={`${shot.src}-${index}`}
          className="relative h-[clamp(8.5rem,20vw,17rem)] shrink-0 overflow-hidden rounded-2xl bg-band shadow-[0_8px_30px_-12px_rgb(0_0_0/0.25)] sm:rounded-3xl"
          style={{ aspectRatio: String(shot.ratio) }}
        >
          <Image
            src={shot.src}
            alt=""
            fill
            sizes="(max-width: 640px) 45vw, 30vw"
            className="object-cover object-top"
          />
        </li>
      ))}
    </motion.ul>
  );
}

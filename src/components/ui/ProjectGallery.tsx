"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export interface Shot {
  src: string;
  alt?: string;
}

/** Autoplay cadence. Long enough to actually read a screenshot, short enough
 *  that the wall below still feels like it belongs to the stage above. */
const DWELL_MS = 5200;

/** Pointer travel past which a click is treated as a swipe, not a tap. */
const TAP_SLOP = 10;

/** SSR-safe "are we on the client yet" — the lightbox portals into
 *  `document.body`, which does not exist during the server render. */
const noopSubscribe = () => () => {};

const two = (n: number) => String(n + 1).padStart(2, "0");

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? "6%" : "-6%",
    scale: 1.03,
  }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? "-6%" : "6%",
    scale: 1.03,
  }),
};

/** Chrome that floats over a screenshot: dark, blurred, hairline in white. */
const overlayButton =
  "grid cursor-pointer place-items-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md transition duration-300 hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/**
 * Two views of the same screenshots: a slide (one frame at a time, large) and
 * a wall (every frame at once, small). They used to be a single packed mosaic
 * where a nine-shot project got nine cropped slivers — no image was readable
 * and the block read as a contact sheet rather than as the work.
 *
 * The gallery is monochrome on purpose. It used to assign every shot a hue out
 * of a rainbow and repeat it in five places — the glow, the frame, a wash over
 * the image, the rail, the tile — which invented a palette the rest of the
 * site does not have and tinted the screenshots it was meant to present. The
 * only colour here now is the colour inside the work itself. Wayfinding falls
 * to position and weight instead: the counter, the rail segment that grows,
 * and the one tile at full strength.
 */
export default function ProjectGallery({
  shots,
  className,
}: {
  shots: Shot[];
  className?: string;
}) {
  const t = useTranslations("projectDetail.gallery");
  const reduceMotion = useReducedMotion();

  const [[index, direction], setSlide] = useState<[number, number]>([0, 0]);
  const [lightbox, setLightbox] = useState(false);
  /** Autoplay is a hint, not a ride: the first deliberate move ends it. */
  const [autoplay, setAutoplay] = useState(true);
  const [hovering, setHovering] = useState(false);

  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const count = shots.length;
  const current = shots[index];
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const go = (next: number, dir: number) => {
    setSlide([(next + count) % count, dir]);
  };

  const step = (dir: number) => {
    setAutoplay(false);
    go(index + dir, dir);
  };

  const jumpTo = (target: number) => {
    if (target === index) return;
    setAutoplay(false);
    go(target, target > index ? 1 : -1);
  };

  // Advance on a timer until the visitor takes over, and hold while they are
  // reading — a frame that slides out from under the cursor is the single
  // most irritating thing a carousel can do.
  useEffect(() => {
    if (!autoplay || count < 2 || hovering || lightbox || reduceMotion) return;
    // Functional update so the timer does not have to close over `index`,
    // which would otherwise restart the countdown on every dependency churn.
    const id = window.setTimeout(
      () => setSlide(([i]) => [(i + 1) % count, 1]),
      DWELL_MS,
    );
    return () => window.clearTimeout(id);
  }, [autoplay, count, hovering, lightbox, reduceMotion, index]);

  // Arrows drive the gallery whenever the lightbox is up; the stage handles
  // its own keys only while focused, so the page still scrolls normally.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const dir = event.key === "ArrowRight" ? 1 : -1;
      setAutoplay(false);
      setSlide(([i]) => [(i + dir + count) % count, dir]);
    };
    window.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [lightbox, count]);

  if (count === 0) return null;

  const arrowClass = cn(
    overlayButton,
    "absolute top-1/2 z-20 h-11 w-11 -translate-y-1/2 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100",
  );

  return (
    <div className={cn("w-full", className)}>
      {/* ---------------------------------------------------------------- */}
      {/* The slide                                                         */}
      {/* ---------------------------------------------------------------- */}
      <figure
        className="group relative"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* A hairline, not a gradient frame. The screenshot sits on a tinted
            page, so it needs an edge — it does not need a border competing
            with the image for attention. */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={t("label")}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              step(1);
            }
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              step(-1);
            }
          }}
          onPointerDown={(event) => {
            pointerStart.current = { x: event.clientX, y: event.clientY };
          }}
          className="relative aspect-4/3 w-full touch-pan-y overflow-hidden rounded-2xl border border-border bg-background sm:aspect-16/10"
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={reduceMotion ? undefined : slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 260, damping: 34 },
                opacity: { duration: 0.45 },
                scale: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              }}
              drag={count > 1 ? "x" : false}
              dragElastic={0.12}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) < 60) return;
                step(info.offset.x < 0 ? 1 : -1);
              }}
              className="absolute inset-0 cursor-zoom-in"
              onClick={(event) => {
                const start = pointerStart.current;
                pointerStart.current = null;
                if (
                  start &&
                  (Math.abs(event.clientX - start.x) > TAP_SLOP ||
                    Math.abs(event.clientY - start.y) > TAP_SLOP)
                ) {
                  return; // that was a swipe
                }
                setAutoplay(false);
                setLightbox(true);
              }}
            >
              <Image
                src={shots[index].src}
                alt={shots[index].alt ?? ""}
                fill
                priority={index === 0}
                draggable={false}
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="pointer-events-none object-cover object-top select-none"
              />
            </motion.div>
          </AnimatePresence>

          {/* Scrim so the counter stays legible over a bright screenshot. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-linear-to-t from-black/65 to-transparent" />

          <span className="pointer-events-none absolute bottom-4 left-5 z-20 flex items-baseline gap-2 font-mono tracking-[0.18em] tabular-nums">
            <span
              style={{ textShadow: "0 1px 8px rgb(0 0 0 / 0.6)" }}
              className="text-base font-medium text-white"
            >
              {two(index)}
            </span>
            <span className="text-[0.6875rem] text-white/55">
              / {two(count - 1)}
            </span>
          </span>

          <button
            type="button"
            aria-label={t("expand")}
            onClick={() => {
              setAutoplay(false);
              setLightbox(true);
            }}
            className={cn(
              overlayButton,
              "absolute top-4 right-4 z-20 h-10 w-10 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100",
            )}
          >
            <Expand className="h-4 w-4" />
          </button>

          {count > 1 && (
            <>
              <button
                type="button"
                aria-label={t("previous")}
                onClick={() => step(-1)}
                className={cn(arrowClass, "left-4")}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label={t("next")}
                onClick={() => step(1)}
                className={cn(arrowClass, "right-4")}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Progress rail: the active shot takes both the width and the ink. */}
        {count > 1 && (
          <div className="mt-5 flex items-center gap-1.5">
            {shots.map((shot, i) => (
              <button
                key={`rail-${shot.src}-${i}`}
                type="button"
                aria-label={`${t("label")} ${two(i)}`}
                onClick={() => jumpTo(i)}
                className="h-4 cursor-pointer bg-transparent py-1.5 transition-[flex-grow] duration-500"
                style={{ flexGrow: i === index ? 2.4 : 1, flexBasis: 0 }}
              >
                <span
                  className={cn(
                    "block h-1 w-full rounded-full transition-colors duration-300",
                    i === index ? "bg-foreground" : "bg-border",
                  )}
                />
              </button>
            ))}
          </div>
        )}

        {/* Caption sits outside the frame so it is page text, not an overlay
            fighting the screenshot for contrast. */}
        {current?.alt && (
          <figcaption className="mt-4 flex items-start gap-2.5 font-mono text-[0.75rem] leading-relaxed text-muted-foreground">
            <span
              aria-hidden
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground"
            />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="block"
              >
                {current.alt}
              </motion.span>
            </AnimatePresence>
          </figcaption>
        )}
      </figure>

      {/* ---------------------------------------------------------------- */}
      {/* The wall                                                          */}
      {/* ---------------------------------------------------------------- */}
      {count > 1 && (
        // A rule is enough of a break between the stage and the wall — the
        // heading that used to sit here only restated the tiles under it.
        <div className="mt-10 border-t border-border pt-8">
          {/* auto-fill keeps the last row flush whatever the shot count is —
              a fixed column count orphans a single tile on the projects that
              ship nine screenshots. */}
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-2.5">
            {shots.map((shot, i) => {
              const active = i === index;
              return (
                <li key={`${shot.src}-${i}`}>
                  <button
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-label={shot.alt ?? `${t("label")} ${two(i)}`}
                    aria-current={active}
                    className={cn(
                      "group/tile relative block aspect-16/10 w-full cursor-pointer overflow-hidden rounded-xl transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
                      active
                        ? "-translate-y-0.5 ring-2 ring-foreground"
                        : "ring-1 ring-border hover:-translate-y-0.5",
                    )}
                  >
                    {/* Held back rather than greyed out: a fully desaturated
                        thumbnail reads as disabled, while a slightly muted one
                        reads as another frame in the same set. */}
                    <Image
                      src={shot.src}
                      alt=""
                      fill
                      sizes="160px"
                      className={cn(
                        "object-cover object-top transition duration-500",
                        active
                          ? "opacity-100"
                          : "opacity-70 saturate-50 group-hover/tile:scale-105 group-hover/tile:opacity-100 group-hover/tile:saturate-100",
                      )}
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-black/60 to-transparent"
                    />
                    <span
                      className="absolute bottom-1.5 left-2 font-mono text-[0.625rem] font-medium text-white/85 tabular-nums"
                      style={{ textShadow: "0 1px 4px rgb(0 0 0 / 0.8)" }}
                    >
                      {two(i)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Full-bleed view                                                   */}
      {/* ---------------------------------------------------------------- */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {lightbox && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                role="dialog"
                aria-modal="true"
                aria-label={t("label")}
                onClick={() => setLightbox(false)}
                className="fixed inset-0 z-9999 flex flex-col items-center justify-center gap-6 bg-black/92 p-4 backdrop-blur-xl sm:p-8"
              >
                <button
                  type="button"
                  aria-label={t("close")}
                  onClick={() => setLightbox(false)}
                  className={cn(
                    overlayButton,
                    "absolute top-4 right-4 z-10 h-10 w-10 bg-white/10 hover:bg-white/20",
                  )}
                >
                  <X className="h-4 w-4" />
                </button>

                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  onClick={(event) => event.stopPropagation()}
                  className="relative max-h-[82vh]"
                >
                  <Image
                    src={shots[index].src}
                    alt={shots[index].alt ?? ""}
                    width={1920}
                    height={1080}
                    sizes="100vw"
                    className="h-auto max-h-[82vh] w-auto max-w-full rounded-xl object-contain"
                  />
                </motion.div>

                <div
                  onClick={(event) => event.stopPropagation()}
                  className="z-10 flex items-center gap-5 text-white"
                >
                  {count > 1 && (
                    <button
                      type="button"
                      aria-label={t("previous")}
                      onClick={() => step(-1)}
                      className={cn(
                        overlayButton,
                        "h-10 w-10 bg-white/10 hover:bg-white/20",
                      )}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  )}
                  <span className="max-w-md text-center font-mono text-[0.75rem]">
                    <span className="tabular-nums">
                      {two(index)}
                      <span className="text-white/50"> / {two(count - 1)}</span>
                    </span>
                    {current?.alt && (
                      <span className="mt-1 block text-white/55">
                        {current.alt}
                      </span>
                    )}
                  </span>
                  {count > 1 && (
                    <button
                      type="button"
                      aria-label={t("next")}
                      onClick={() => step(1)}
                      className={cn(
                        overlayButton,
                        "h-10 w-10 bg-white/10 hover:bg-white/20",
                      )}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}

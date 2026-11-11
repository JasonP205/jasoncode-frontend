"use client";

import { Fragment, useEffect, useRef } from "react";
import { play } from "@/lib/sound/engine";
import { cn } from "@/lib/utils";

export interface KineticSegment {
  text: string;
  /** Painted with the layer gradient. */
  accent?: boolean;
  /** Greyed, the quiet half of a two-part headline. */
  quiet?: boolean;
}

interface KineticHeadlineProps {
  segments: KineticSegment[];
  as?: "h1" | "h2" | "p";
  className?: string;
  /** Play a wave through the letters once on mount. */
  intro?: boolean;
}

/* Spring constants: stiff enough to snap back, damped enough not to wobble
   for more than a beat. */
const STIFFNESS = 190;
const DAMPING = 15;
const IDLE_WAVE_MS = 9000;

const segmenter = (granularity: "word" | "grapheme") =>
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter("vi", { granularity })
    : null;

/** Split into words (kept unbreakable) made of graphemes (so "ệ" stays whole). */
function split(text: string): { word: string; graphemes: string[] }[] {
  const words = segmenter("word");
  const graphemes = segmenter("grapheme");
  const chunks = words
    ? Array.from(words.segment(text), (s) => s.segment)
    : text.split(/(\s+)/);
  return chunks
    .filter((chunk) => chunk.length > 0)
    .map((word) => ({
      word,
      graphemes: graphemes
        ? Array.from(graphemes.segment(word), (s) => s.segment)
        : Array.from(word),
    }));
}

/**
 * A headline whose letters behave like springs. The cursor lifts, tilts and
 * tints the letters near it, each one plays a note of a pentatonic scale as
 * you sweep across (when sound is on), a click sends a ripple through the
 * line, and an idle wave runs every few seconds to hint that it is alive.
 *
 * The letters are split on the server, so the first paint is the finished
 * headline (it is often the LCP element) and crawlers read plain text. The
 * spans are aria-hidden; the heading carries the sentence as its label.
 * Physics only starts on the client, and never for reduced motion.
 */
export default function KineticHeadline({
  segments,
  as: Tag = "h1",
  className,
  intro = true,
}: KineticHeadlineProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const label = segments.map((s) => s.text).join("").replace(/\s+/g, " ").trim();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const letters = Array.from(root.querySelectorAll<HTMLElement>(".kc"));
    const n = letters.length;
    if (!n) return;

    // Per-letter state: rest centre (relative to the heading), offset,
    // rotation, scale and their velocities.
    const cx = new Float32Array(n);
    const cy = new Float32Array(n);
    const x = new Float32Array(n);
    const y = new Float32Array(n);
    const r = new Float32Array(n);
    const s = new Float32Array(n).fill(1);
    const vx = new Float32Array(n);
    const vy = new Float32Array(n);
    const vr = new Float32Array(n);
    const vs = new Float32Array(n);
    const tint = new Int8Array(n).fill(-1);
    const accent = letters.map((el) => el.classList.contains("kc-accent"));
    const kicks: { at: number; i: number; v: number }[] = [];

    let fontSize = 64;
    const measure = () => {
      fontSize = parseFloat(getComputedStyle(root).fontSize) || 64;
      const origin = root.getBoundingClientRect();
      letters.forEach((el, i) => {
        const b = el.getBoundingClientRect();
        // Subtract the current transform so we store the resting position.
        cx[i] = b.left - origin.left + b.width / 2 - x[i];
        cy[i] = b.top - origin.top + b.height / 2 - y[i];
      });
    };

    let px = -1e5;
    let py = -1e5;
    let pointerIn = false;
    let lastPointer = 0;
    let lastNote = -1;
    let frame = 0;
    let lastTime = 0;
    let inView = true;

    const step = (time: number) => {
      const dt = Math.min(1 / 30, (time - lastTime) / 1000 || 1 / 60);
      lastTime = time;
      const rect = root.getBoundingClientRect();
      const reach = fontSize * 1.7;
      const scale = fontSize / 80;
      let moving = kicks.length > 0;
      let nearest = -1;
      let nearestP = 0.45;

      for (let k = kicks.length - 1; k >= 0; k--) {
        if (kicks[k].at <= time) {
          vy[kicks[k].i] += kicks[k].v * scale;
          kicks.splice(k, 1);
        }
      }

      for (let i = 0; i < n; i++) {
        let tx = 0;
        let ty = 0;
        let tr = 0;
        let ts = 1;
        let p = 0;
        if (pointerIn) {
          const dx = px - (rect.left + cx[i]);
          const dy = py - (rect.top + cy[i]);
          const d = Math.hypot(dx, dy);
          p = Math.max(0, 1 - d / reach);
          if (p > 0) {
            const ease = p * p * (3 - 2 * p);
            tx = (-dx / (d || 1)) * ease * fontSize * 0.1;
            ty = -ease * fontSize * 0.26 - (dy / (d || 1)) * ease * fontSize * 0.05;
            tr = -dx * ease * 0.09 / scale;
            ts = 1 + ease * 0.16;
            if (p > nearestP) {
              nearestP = p;
              nearest = i;
            }
          }
        }

        // Semi-implicit Euler on four springs.
        vx[i] += (STIFFNESS * (tx - x[i]) - DAMPING * vx[i]) * dt;
        vy[i] += (STIFFNESS * (ty - y[i]) - DAMPING * vy[i]) * dt;
        vr[i] += (STIFFNESS * (tr - r[i]) - DAMPING * vr[i]) * dt;
        vs[i] += (STIFFNESS * (ts - s[i]) - DAMPING * vs[i]) * dt;
        x[i] += vx[i] * dt;
        y[i] += vy[i] * dt;
        r[i] += vr[i] * dt;
        s[i] += vs[i] * dt;

        const settled =
          p === 0 &&
          Math.abs(x[i]) + Math.abs(y[i]) + Math.abs(r[i]) + Math.abs(s[i] - 1) < 0.02 &&
          Math.abs(vx[i]) + Math.abs(vy[i]) + Math.abs(vr[i]) < 0.05;
        const el = letters[i];
        if (settled) {
          x[i] = y[i] = r[i] = vx[i] = vy[i] = vr[i] = vs[i] = 0;
          s[i] = 1;
          el.style.transform = "";
        } else {
          moving = true;
          el.style.transform = `translate(${x[i].toFixed(2)}px,${y[i].toFixed(2)}px) rotate(${r[i].toFixed(2)}deg) scale(${s[i].toFixed(3)})`;
        }

        // Letters near the cursor take the five layer tones in turn.
        const want = !accent[i] && p > 0.2 ? i % 5 : -1;
        if (want !== tint[i]) {
          tint[i] = want;
          el.style.color = want < 0 ? "" : `var(--layer-${want})`;
        }
      }

      if (nearest >= 0 && nearest !== lastNote) play("note", nearest / Math.max(1, n - 1));
      lastNote = nearest;
      frame = moving ? requestAnimationFrame(step) : 0;
    };

    const wake = () => {
      if (!frame) {
        lastTime = performance.now();
        frame = requestAnimationFrame(step);
      }
    };

    /** Kick every letter upward, staggered outward from letter `from`. */
    const wave = (strength: number, from = 0) => {
      const now = performance.now();
      for (let i = 0; i < n; i++) {
        kicks.push({ at: now + Math.abs(i - from) * 26, i, v: -strength });
      }
      wake();
    };

    const area = root.closest("section") ?? root;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      px = event.clientX;
      py = event.clientY;
      pointerIn = true;
      lastPointer = performance.now();
      wake();
    };
    const onLeave = () => {
      pointerIn = false;
      lastNote = -1;
      wake();
    };
    const onTouch = (event: TouchEvent) => {
      const t = event.touches[0];
      if (!t) return onLeave();
      px = t.clientX;
      py = t.clientY;
      pointerIn = true;
      lastPointer = performance.now();
      wake();
    };
    const onClick = (event: MouseEvent) => {
      const rect = root.getBoundingClientRect();
      let from = 0;
      let best = Infinity;
      for (let i = 0; i < n; i++) {
        const d = Math.hypot(event.clientX - rect.left - cx[i], event.clientY - rect.top - cy[i]);
        if (d < best) {
          best = d;
          from = i;
        }
      }
      wave(150, from);
      play("ripple");
    };

    area.addEventListener("pointermove", onMove as EventListener, { passive: true });
    area.addEventListener("pointerleave", onLeave, { passive: true });
    root.addEventListener("touchstart", onTouch, { passive: true });
    root.addEventListener("touchmove", onTouch, { passive: true });
    root.addEventListener("touchend", onLeave, { passive: true });
    root.addEventListener("click", onClick);

    const resize = new ResizeObserver(measure);
    resize.observe(root);
    const visible = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    visible.observe(root);
    void document.fonts?.ready.then(measure);

    const idle = window.setInterval(() => {
      if (inView && !document.hidden && !pointerIn && performance.now() - lastPointer > IDLE_WAVE_MS) {
        wave(80);
      }
    }, IDLE_WAVE_MS);

    measure();
    if (intro) wave(130);

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(idle);
      resize.disconnect();
      visible.disconnect();
      area.removeEventListener("pointermove", onMove as EventListener);
      area.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("touchstart", onTouch);
      root.removeEventListener("touchmove", onTouch);
      root.removeEventListener("touchend", onLeave);
      root.removeEventListener("click", onClick);
      for (const el of letters) {
        el.style.transform = "";
        el.style.color = "";
      }
    };
  }, [intro]);

  return (
    <Tag ref={ref} aria-label={label} className={cn("kinetic", className)}>
      {segments.map((segment, si) => {
        const lines = segment.text.split("\n");
        const words = lines.map(split);
        const total = words.flat().reduce((sum, w) => sum + w.graphemes.length, 0);
        let index = 0;
        return (
          <span
            key={si}
            aria-hidden
            className={cn(segment.quiet && "headline-quiet")}
          >
            {words.map((line, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                {line.map((w, wi) =>
                  /^\s+$/.test(w.word) ? (
                    <Fragment key={wi}> </Fragment>
                  ) : (
                    <span key={wi} className="kw">
                      {w.graphemes.map((g, gi) => {
                        const i = index++;
                        return (
                          <span
                            key={gi}
                            className={cn("kc", segment.accent && "kc-accent")}
                            style={
                              segment.accent
                                ? {
                                    backgroundSize: `${total * 100}% 100%`,
                                    backgroundPosition: `${total > 1 ? (i / (total - 1)) * 100 : 0}% 0`,
                                  }
                                : undefined
                            }
                          >
                            {g}
                          </span>
                        );
                      })}
                    </span>
                  ),
                )}
              </Fragment>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}

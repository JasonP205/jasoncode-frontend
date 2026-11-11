"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  /** Maximum tilt in degrees. */
  max?: number;
}

/**
 * A card that tilts toward the cursor in 3D, with a glare that slides across
 * it. Children marked `data-depth="1"…"3"` float above the surface (CSS
 * translateZ), so the card reads as layered glass. Mouse/pen only — touch
 * scrolls normally — and nothing moves for reduced motion.
 *
 * Pure CSS transforms driven by CSS variables written in a rAF, so React
 * never re-renders while the pointer moves.
 */
export default function Tilt3D({ children, className, max = 9 }: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let gx = 50;
    let gy = 50;
    let on = 0;
    let onTarget = 0;

    const tick = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      on += (onTarget - on) * 0.14;
      el.style.setProperty("--rx", `${(-y * max).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(x * max).toFixed(2)}deg`);
      el.style.setProperty("--gx", `${gx}%`);
      el.style.setProperty("--gy", `${gy}%`);
      el.style.setProperty("--glare", on.toFixed(3));
      const settled = Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(onTarget - on) < 0.002;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      tx = px * 2 - 1;
      ty = py * 2 - 1;
      gx = px * 100;
      gy = py * 100;
      onTarget = 1;
      wake();
    };
    const onLeave = () => {
      tx = ty = 0;
      onTarget = 0;
      wake();
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [max]);

  return (
    <div ref={ref} className={cn("tilt-3d", className)}>
      <div className="tilt-3d-inner">
        {children}
        <span aria-hidden className="tilt-3d-glare" />
      </div>
    </div>
  );
}

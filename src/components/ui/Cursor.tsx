"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  color: string;
};

const PASTEL_COLORS = [
  "#FFB3BA",
  "#FFDFBA",
  "#FFFFBA",
  "#BAFFC9",
  "#BAE1FF",
  "#D8B4FE",
  "#F9A8D4",
  "#A7F3D0",
];

export default function CursorEffect() {
  const [hover, setHover] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Vòng tròn ngoài (chậm hơn)
  const x = useSpring(mouseX, {
    stiffness: 200,
    damping: 30,
    mass: 0.5,
  });

  const y = useSpring(mouseY, {
    stiffness: 200,
    damping: 30,
    mass: 0.5,
  });

  // Dot giữa (nhanh hơn)
  const dotX = useSpring(mouseX, {
    stiffness: 1200,
    damping: 45,
  });

  const dotY = useSpring(mouseY, {
    stiffness: 1200,
    damping: 45,
  });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (Math.random() > 0.4) return;

      const particle: Particle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
      };

      setParticles((prev) => [...prev.slice(-40), particle]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== particle.id));
      }, 1000);
    };

    const handleHover = (e: Event) => {
      const target = e.target as HTMLElement;

      const isInteractive = !!target.closest(
        "a,button,[role='button'],input,textarea,select,[data-cursor]",
      );

      setHover(isInteractive);
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", handleHover);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", handleHover);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: particle.x,
            y: particle.y,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            y: particle.y + 50,
            x: particle.x + (Math.random() * 20 - 10),
            opacity: 0,
            scale: 0,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
          style={{
            backgroundColor: particle.color,
            boxShadow: `
    0 0 4px ${particle.color},
    0 0 8px ${particle.color},
    0 0 12px ${particle.color}
  `,
          }}
          className="pointer-events-none fixed left-0 top-0 z-[99998] h-2 w-2 rounded-full"
        />
      ))}

      {/* Outer Ring */}
      <motion.div
        style={{ x, y }}
        animate={{
          width: hover ? 65 : 42,
          height: hover ? 65 : 42,
          borderColor: hover ? "#000000" : "#D3d3d3",
          backgroundColor: hover ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0)",
        }}
        transition={{
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="pointer-events-none fixed left-0 top-0 z-[99999] flex items-center justify-center -translate-x-1/2 -translate-y-1/2 rounded-full border-1 will-change-transform"
      />

      {/* Center Dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
        }}
        animate={{
          scale: hover ? 0 : 1,
          opacity: hover ? 0 : 1,
        }}
        transition={{
          duration: 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="pointer-events-none fixed left-0 top-0 z-[100000] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-600/60"
      />
    </>
  );
}

"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "@/components/ui/ThemeProvider";
import { cn } from "@/lib/utils";

interface HeroVideoProps {
  className?: string;
}

// Re-encoded from the 30 MB CloudFront original (17 Mbps) down to ~2.3 MB
// (1600px, CRF 26) — the original starved the whole page of bandwidth.
const DAY_VIDEO = process.env.NEXT_PUBLIC_DAY_HERO_VIDEO ?? "/hero-day.mp4";

const NIGHT_VIDEO = process.env.NEXT_PUBLIC_NIGHT_HERO_VIDEO ??
  "https://res.cloudinary.com/dw1k4fknp/video/upload/v1782454827/hero-night_mw0let.mp4";

// Pre-optimised WebP posters (~100KB) living in /public. These are the hero's
// LCP element: painted from server HTML with no JS/network gate, so LCP no
// longer waits on the remote MP4.
const DAY_POSTER = "/day_poster.webp";
const NIGHT_POSTER = "/night_poster.webp";

export default function HeroVideo({ className }: HeroVideoProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const videoSrc = isDark ? NIGHT_VIDEO : DAY_VIDEO;
  const posterSrc = isDark ? NIGHT_POSTER : DAY_POSTER;

  // Fetching the MP4 during page load competes with every other resource and
  // drags LCP out (the request lands in the LCP dependency graph if it starts
  // before the poster paints). Hold the <video> off the page until the load
  // event has fired *plus* a beat, so the poster paints first and the video
  // streams in behind it.
  const [loadVideo, setLoadVideo] = useState(false);
  useEffect(() => {
    let timer: number | undefined;
    const arm = () => {
      timer = window.setTimeout(() => setLoadVideo(true), 1500);
    };
    if (document.readyState === "complete") {
      arm();
    } else {
      window.addEventListener("load", arm, { once: true });
    }
    return () => {
      window.removeEventListener("load", arm);
      window.clearTimeout(timer);
    };
  }, []);

  // Keep the poster on top until the video for the *current* source has a frame
  // ready. Tracking the ready source (rather than a boolean reset via effect)
  // makes a theme swap re-show the poster automatically with no cascading render.
  const [readySrc, setReadySrc] = useState<string | null>(null);
  const videoReady = readySrc === videoSrc;

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {/* LCP element — server-rendered with a responsive srcset, fetched with
          high priority, fades out once the video can play. */}
      <Image
        src={posterSrc}
        alt=""
        aria-hidden
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className={cn(
          "object-cover transition-opacity duration-700 ease-in-out",
          videoReady ? "opacity-0" : "opacity-100",
        )}
      />

      {/* `key` remounts the element on theme change so `onCanPlay` fires again. */}
      {loadVideo && (
        <video
          key={videoSrc}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={(e) => {
            e.currentTarget.play().catch(() => {});
            setReadySrc(videoSrc);
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}

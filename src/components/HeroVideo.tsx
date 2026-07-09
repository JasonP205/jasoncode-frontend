"use client";
import { useState } from "react";
import { useTheme } from "@/components/ui/ThemeProvider";
import { cn } from "@/lib/utils";

interface HeroVideoProps {
  className?: string;
}

const DAY_VIDEO = process.env.NEXT_PUBLIC_DAY_HERO_VIDEO ??
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";

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

  // Keep the poster on top until the video for the *current* source has a frame
  // ready. Tracking the ready source (rather than a boolean reset via effect)
  // makes a theme swap re-show the poster automatically with no cascading render.
  const [readySrc, setReadySrc] = useState<string | null>(null);
  const videoReady = readySrc === videoSrc;

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {/* LCP element — server-rendered, fetched with high priority, fades out
          once the video can play. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={posterSrc}
        alt=""
        aria-hidden
        fetchPriority="high"
        decoding="async"
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out",
          videoReady ? "opacity-0" : "opacity-100",
        )}
      />

      {/* `key` remounts the element on theme change so `onCanPlay` fires again.
          `preload="auto"` + the src in server HTML lets the browser start
          fetching the MP4 immediately, in parallel with (not blocking) the LCP. */}
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
    </div>
  );
}

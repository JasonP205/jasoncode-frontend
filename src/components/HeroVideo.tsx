"use client";
import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ui/ThemeProvider";
import { cn } from "@/lib/utils";

interface HeroVideoProps {
  poster?: string;
  className?: string;
}

const DAY_VIDEO = process.env.NEXT_PUBLIC_DAY_HERO_VIDEO ??
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";

const NIGHT_VIDEO = process.env.NEXT_PUBLIC_NIGHT_HERO_VIDEO ??
  "https://res.cloudinary.com/dw1k4fknp/video/upload/v1782454827/hero-night_mw0let.mp4";

export default function HeroVideo({
  poster,
  className,
}: HeroVideoProps) {
  const { resolvedTheme } = useTheme();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);

  const activeRef = useRef<0 | 1>(0);
  const currentSrcRef = useRef("");

  // Initial load
  useEffect(() => {
    const video = videoARef.current;
    if (!video) return;

    const src = resolvedTheme === "dark" ? NIGHT_VIDEO : DAY_VIDEO;
    currentSrcRef.current = src;

    video.src = src;
    video.preload = "auto";
    video.load();

    const play = () => video.play().catch(() => {});
    video.addEventListener("canplay", play, { once: true });

    return () => {
      video.removeEventListener("canplay", play);
    };
  }, []);

  useEffect(() => {
    if (!resolvedTheme) return;

    const nextSrc = resolvedTheme === "dark" ? NIGHT_VIDEO : DAY_VIDEO;

    if (nextSrc === currentSrcRef.current) return;

    const activeIndex = activeRef.current;

    const currentVideo =
      activeIndex === 0 ? videoARef.current : videoBRef.current;

    const nextVideo =
      activeIndex === 0 ? videoBRef.current : videoARef.current;

    if (!currentVideo || !nextVideo) return;

    currentSrcRef.current = nextSrc;

    nextVideo.pause();
    nextVideo.src = nextSrc;
    nextVideo.preload = "auto";
    nextVideo.load();

    const handleCanPlay = () => {
      nextVideo.currentTime = currentVideo.currentTime;

      nextVideo.play().catch(() => {});

      currentVideo.classList.remove("opacity-100");
      currentVideo.classList.add("opacity-0");

      nextVideo.classList.remove("opacity-0");
      nextVideo.classList.add("opacity-100");

      activeRef.current = activeIndex === 0 ? 1 : 0;
    };

    nextVideo.addEventListener("canplay", handleCanPlay, {
      once: true,
    });

    return () => {
      nextVideo.removeEventListener("canplay", handleCanPlay);
    };
  }, [resolvedTheme]);

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "relative h-full w-full overflow-hidden",
        className
      )}
    >
      <video
        ref={videoARef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        className="absolute inset-0 h-full w-full object-cover opacity-100 transition-opacity duration-700 ease-in-out"
      />

      <video
        ref={videoBRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 ease-in-out"
      />
    </div>
  );
}
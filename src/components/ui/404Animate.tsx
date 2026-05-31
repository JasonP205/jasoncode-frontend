"use client";

import dynamic from "next/dynamic";

const LottieWebGPU = dynamic(
  () =>
    import("@lottiefiles/dotlottie-react/webgpu").then(
      (m) => m.DotLottieReact
    ),
  { ssr: false }
);

const LottieWebGL = dynamic(
  () =>
    import("@lottiefiles/dotlottie-react/webgl").then(
      (m) => m.DotLottieReact
    ),
  { ssr: false }
);

export default function Animation() {
  const isWebGPU =
    typeof navigator !== "undefined" && "gpu" in navigator;

  const Component = isWebGPU
    ? LottieWebGPU
    : LottieWebGL;

  return (
    <Component
      src="/animation.lotties"
      autoplay
      loop
    />
  );
}
"use client";

import { useState } from "react";
import { MultipleImage } from "@hwagfu/images";
import {
  PlaygroundShell,
  RangeControl,
  SelectControl,
  ToggleControl,
} from "./controls";

type Radius = "none" | "md" | "lg" | "xl";

export const SAMPLES = [
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80",
    alt: "Mountain landscape",
  },
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80",
    alt: "Forest with lake",
  },
  {
    src: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=1200&q=80",
    alt: "Modern city skyline",
  },
  {
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80",
    alt: "Foggy forest",
  },
  {
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80",
    alt: "Lake and mountains",
  },
  {
    src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1200&q=80",
    alt: "Green valley",
  },
  {
    src: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&q=80",
    alt: "Snowy mountain peaks",
  },
];

export default function ImagesPlayground() {
  const [count, setCount] = useState(3);
  const [radius, setRadius] = useState<Radius>("xl");
  const [blur, setBlur] = useState(true);

  return (
    <PlaygroundShell
      preview={
        <div className="w-full">
          <MultipleImage
            imgList={SAMPLES.slice(0, count)}
            radius={radius}
            blurBackground={blur}
          />
        </div>
      }
      controls={
        <>
          <RangeControl
            label="images"
            value={count}
            min={1}
            max={6}
            onChange={setCount}
          />
          <SelectControl
            label="radius"
            value={radius}
            options={["none", "md", "lg", "xl"] as const}
            onChange={setRadius}
          />
          <ToggleControl
            label="blurBackground"
            value={blur}
            onChange={setBlur}
          />
          <p className="text-xs text-muted leading-relaxed">
            Bấm vào một ảnh để mở lightbox · Click an image to open the lightbox.
          </p>
        </>
      }
    />
  );
}

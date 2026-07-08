"use client";

import { useState } from "react";
import { CursorEffect } from "@hwagfu/cursor";
import {
  ColorControl,
  PlaygroundShell,
  RangeControl,
  ToggleControl,
} from "./controls";

export default function CursorPlayground() {
  const [enabled, setEnabled] = useState(false);
  const [ringSize, setRingSize] = useState(42);
  const [ringHoverSize, setRingHoverSize] = useState(65);
  const [dotSize, setDotSize] = useState(10);
  const [particleLifetime, setParticleLifetime] = useState(900);
  const [ringColor, setRingColor] = useState("#94a3b8");
  const [dotColor, setDotColor] = useState("#0f172a");
  const [particleColor, setParticleColor] = useState("#fb7185");

  return (
    <>
      {/* The real component renders a full-page fixed overlay. */}
      {enabled && (
        <CursorEffect
          ringSize={ringSize}
          ringHoverSize={ringHoverSize}
          dotSize={dotSize}
          particleLifetime={particleLifetime}
          ringColor={ringColor}
          dotColor={dotColor}
          colors={[particleColor, "#93c5fd", "#86efac", "#fdba74"]}
        />
      )}

      <PlaygroundShell
        preview={
          <div className="flex flex-col items-center gap-4 text-center">
            <button
              type="button"
              className="rounded-full border border-border bg-background px-5 py-2 text-sm font-medium text-foreground shadow-sm"
            >
              Hover me
            </button>
            <p className="max-w-xs text-xs text-muted leading-relaxed">
              {enabled
                ? "Di chuột bất kỳ đâu trên trang để xem hiệu ứng · Move your mouse anywhere on the page."
                : "Bật công tắc “enabled” để kích hoạt hiệu ứng con trỏ · Turn on “enabled” to activate."}
            </p>
          </div>
        }
        controls={
          <>
            <ToggleControl
              label="enabled"
              value={enabled}
              onChange={setEnabled}
            />
            <RangeControl
              label="ringSize"
              value={ringSize}
              min={16}
              max={80}
              suffix="px"
              onChange={setRingSize}
            />
            <RangeControl
              label="ringHoverSize"
              value={ringHoverSize}
              min={30}
              max={120}
              suffix="px"
              onChange={setRingHoverSize}
            />
            <RangeControl
              label="dotSize"
              value={dotSize}
              min={4}
              max={24}
              suffix="px"
              onChange={setDotSize}
            />
            <RangeControl
              label="particleLifetime"
              value={particleLifetime}
              min={300}
              max={2000}
              step={50}
              suffix="ms"
              onChange={setParticleLifetime}
            />
            <ColorControl
              label="ringColor"
              value={ringColor}
              onChange={setRingColor}
            />
            <ColorControl
              label="dotColor"
              value={dotColor}
              onChange={setDotColor}
            />
            <ColorControl
              label="particleColor"
              value={particleColor}
              onChange={setParticleColor}
            />
          </>
        }
      />
    </>
  );
}

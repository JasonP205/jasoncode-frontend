"use client";

import type { Color } from "@heroui/react";
import {
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  parseColor,
} from "@heroui/react";
import { cn } from "@/lib/utils";

/** Two-pane playground layout: live preview + controls panel. */
export function PlaygroundShell({
  preview,
  controls,
}: {
  preview: React.ReactNode;
  controls: React.ReactNode;
}) {
  return (
    <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4 sm:gap-6">
      <div className="relative flex min-h-72 items-center justify-center overflow-hidden rounded-2xl border border-border bg-secondary/30 p-4 sm:p-6">
        {preview}
      </div>
      <div className="flex flex-col gap-5 rounded-2xl border border-border p-4 sm:p-6">
        {controls}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-center justify-between gap-2 text-sm font-medium text-foreground">
        <span className="font-mono">{label}</span>
        {value !== undefined && (
          <span className="font-mono text-xs text-muted">{value}</span>
        )}
      </span>
      {children}
    </label>
  );
}

export function RangeControl({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <Field label={label} value={`${value}${suffix}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-foreground"
      />
    </Field>
  );
}

export function SelectControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  let color: Color;
  try {
    color = parseColor(value);
  } catch {
    color = parseColor("#000000");
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-mono text-sm font-medium text-foreground">
        {label}
      </span>
      <ColorPicker
        value={color}
        onChange={(next) => onChange(next.toString("hex"))}
      >
        <ColorPicker.Trigger className="flex items-center gap-2">
          <ColorSwatch size="sm" className="rounded-md" />
          <span className="font-mono text-xs text-muted uppercase">
            {value}
          </span>
        </ColorPicker.Trigger>
        <ColorPicker.Popover className="gap-2">
          <ColorArea
            aria-label="Color area"
            className="max-w-full"
            colorSpace="hsb"
            xChannel="saturation"
            yChannel="brightness"
          >
            <ColorArea.Thumb />
          </ColorArea>
          <ColorSlider
            aria-label="Hue slider"
            channel="hue"
            className="gap-1 px-1"
            colorSpace="hsb"
          >
            <ColorSlider.Track>
              <ColorSlider.Thumb />
            </ColorSlider.Track>
          </ColorSlider>
          <ColorField aria-label="Color value">
            <ColorField.Group variant="secondary">
              <ColorField.Prefix>
                <ColorSwatch size="xs" />
              </ColorField.Prefix>
              <ColorField.Input />
            </ColorField.Group>
          </ColorField>
        </ColorPicker.Popover>
      </ColorPicker>
    </div>
  );
}

export function TextControl({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
      />
    </Field>
  );
}

export function ToggleControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-mono text-sm font-medium text-foreground">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={label}
        onClick={() => onChange(!value)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          value ? "bg-foreground" : "bg-muted/40",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-5 rounded-full bg-background transition-transform",
            value && "translate-x-5",
          )}
        />
      </button>
    </div>
  );
}

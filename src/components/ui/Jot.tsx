import { useId } from "react";
import { cn } from "@/lib/utils";

export type JotMood = "idle" | "happy" | "lost" | "thinking";

/**
 * Jot — the Jason Dev mascot, and the logo.
 *
 * A chunky J with a face, and its companion: the full stop. "A jot" is "a
 * little bit" — the hero's "Một chút thiết kế. Một chút lập trình." — and the
 * stop is the site's voice, every headline ends on one.
 *
 * Moods tell a small story wherever Jot appears:
 * - `idle`     blinks now and then (default)
 * - `thinking` looks up while its dot bounces — loading, work in progress
 * - `happy`    smiling eyes and a hop — something went right
 * - `lost`     its dot is gone, only a dashed outline left — 404
 *
 * Rules of use:
 * - Show the face from ~64px up. Below that (nav logo, favicon) pass
 *   `face={false}`: the J and its dot carry the brand on their own.
 * - Background is always transparent; the colours hold on light and dark.
 * - Motion is CSS only (see `.jot-*` in globals.css) and stops for visitors
 *   who prefer reduced motion.
 *
 * The static brand files in `public/brand/` and the app icons are exported
 * from this same geometry.
 */
export default function Jot({
  mood = "idle",
  face = true,
  animated = true,
  label,
  className,
}: {
  mood?: JotMood;
  face?: boolean;
  animated?: boolean;
  /** Accessible name. Omit when Jot is decorative next to real text. */
  label?: string;
  className?: string;
}) {
  const id = useId();
  const bodyId = `${id}-body`;
  const dotId = `${id}-dot`;
  const ink = "#1d1d1f";

  // Pupils shift to show where Jot is looking.
  const look = mood === "lost" ? { x: 5, y: 0 } : mood === "thinking" ? { x: 4, y: -6 } : { x: 0, y: 0 };

  return (
    <svg
      viewBox="0 0 512 512"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      data-mood={mood}
      className={cn("jot shrink-0 overflow-visible", animated && "jot-animate", className)}
    >
      <defs>
        <linearGradient id={bodyId} gradientUnits="userSpaceOnUse" x1="330" y1="70" x2="120" y2="430">
          <stop offset="0" stopColor="#ffa24c" />
          <stop offset="0.45" stopColor="#ff4f9a" />
          <stop offset="1" stopColor="#7c5cff" />
        </linearGradient>
        <linearGradient id={dotId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2ee6a8" />
          <stop offset="1" stopColor="#2f8bff" />
        </linearGradient>
      </defs>

      <g transform="translate(-8 6)">
        <g className="jot-whole">
          <g className="jot-body">
            <path
              d="M 300 112 V 298 A 88 88 0 0 1 124 298"
              fill="none"
              stroke={`url(#${bodyId})`}
              strokeWidth="104"
              strokeLinecap="round"
            />
            <ellipse cx="276" cy="94" rx="14" ry="9" fill="#fff" opacity=".45" transform="rotate(-20 276 94)" />

            {face && (
              <>
                <ellipse cx="264" cy="210" rx="11" ry="8" fill="#ff3d7f" opacity=".35" />
                <ellipse cx="336" cy="210" rx="11" ry="8" fill="#ff3d7f" opacity=".35" />
                {mood === "happy" ? (
                  <g className="jot-eyes">
                    <path d="M 268 187 Q 279 172 290 187" stroke={ink} strokeWidth="8" strokeLinecap="round" fill="none" />
                    <path d="M 310 187 Q 321 172 332 187" stroke={ink} strokeWidth="8" strokeLinecap="round" fill="none" />
                  </g>
                ) : (
                  <g className="jot-eyes">
                    <ellipse cx={279 + look.x} cy={182 + look.y} rx="11" ry="16" fill={ink} />
                    <ellipse cx={321 + look.x} cy={182 + look.y} rx="11" ry="16" fill={ink} />
                    <circle cx={282.5 + look.x} cy={176 + look.y} r="3.6" fill="#fff" />
                    <circle cx={324.5 + look.x} cy={176 + look.y} r="3.6" fill="#fff" />
                  </g>
                )}
                {mood === "happy" && (
                  <path d="M 284 212 Q 300 234 316 212" stroke={ink} strokeWidth="8" strokeLinecap="round" fill="none" />
                )}
                {mood === "idle" && (
                  <path d="M 286 212 Q 300 227 314 212" stroke={ink} strokeWidth="8" strokeLinecap="round" fill="none" />
                )}
                {mood === "lost" && <ellipse cx="304" cy="220" rx="7.5" ry="9.5" fill={ink} />}
                {mood === "thinking" && (
                  <path d="M 290 216 H 312" stroke={ink} strokeWidth="8" strokeLinecap="round" />
                )}
              </>
            )}
          </g>

          {mood === "lost" ? (
            <circle
              className="jot-missing"
              cx="412"
              cy="394"
              r="42"
              fill="none"
              stroke="#9aa0ad"
              strokeWidth="7"
              strokeDasharray="14 12"
              strokeLinecap="round"
            />
          ) : (
            <g className="jot-dot">
              <circle cx="412" cy="394" r="46" fill={`url(#${dotId})`} />
              <circle cx="398" cy="378" r="10" fill="#fff" opacity=".55" />
            </g>
          )}
        </g>
      </g>
    </svg>
  );
}

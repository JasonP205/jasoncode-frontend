import { cn } from "@/lib/utils";

/*
 * The Jason Dev mark: three isometric layers — interface on top (blue →
 * violet), logic in the middle (mint → cyan), infrastructure at the base
 * (amber → pink). The same stack the three.js scenes draw, reduced to a glyph
 * that still reads at 16px. `src/app/icon.svg` uses this exact geometry; keep
 * the two in sync, then run `node scripts/gen-icons.mjs` for the PNG/ICO icons.
 */

/** Top-face rhombus and its visible side band, for a plate whose top is at y. */
const top = (y: number) => `M32 ${y} L58 ${y + 13} L32 ${y + 26} L6 ${y + 13} Z`;
const side = (y: number) =>
  `M6 ${y + 13} L32 ${y + 26} L58 ${y + 13} L58 ${y + 18} L32 ${y + 31} L6 ${y + 18} Z`;

const PLATES = [
  { y: 30, from: "#ffa24c", to: "#ff4f9a", edge: "#d63a7d" },
  { y: 17, from: "#2ee6a8", to: "#22b8ee", edge: "#1696b8" },
  { y: 4, from: "#2f8bff", to: "#8b5cf6", edge: "#5a3fd6" },
] as const;

interface LayersMarkProps {
  className?: string;
  /** Unique per instance on a page (gradient ids). */
  id?: string;
  /** Spread the layers apart when an ancestor `.group` is hovered. */
  lively?: boolean;
}

export default function LayersMark({ className, id = "lm", lively = true }: LayersMarkProps) {
  const shift = ["group-hover:translate-y-[3px]", "", "group-hover:-translate-y-[4px]"];
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={cn("shrink-0 overflow-visible", className)}>
      <defs>
        {PLATES.map((p, i) => (
          <linearGradient key={i} id={`${id}-g${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={p.from} />
            <stop offset="1" stopColor={p.to} />
          </linearGradient>
        ))}
      </defs>
      {PLATES.map((p, i) => (
        <g
          key={i}
          className={cn(
            "transition-transform duration-300 ease-[cubic-bezier(.3,.7,.4,1.4)]",
            lively && shift[i],
          )}
          strokeLinejoin="round"
          strokeWidth={2.5}
        >
          <path d={side(p.y)} fill={p.edge} stroke={p.edge} />
          <path d={top(p.y)} fill={`url(#${id}-g${i})`} stroke={`url(#${id}-g${i})`} />
          {/* A highlight along the near edges, so each plate reads as glass. */}
          <path
            d={`M8.5 ${p.y + 13} L32 ${p.y + 24.6} L55.5 ${p.y + 13}`}
            fill="none"
            stroke="#fff"
            strokeOpacity={0.45}
            strokeWidth={1.2}
          />
        </g>
      ))}
    </svg>
  );
}

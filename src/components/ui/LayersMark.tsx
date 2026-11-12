import { cn } from "@/lib/utils";

/*
 * The Jason Dev mark: three flat isometric plates — navy at the base, a
 * lighter navy in the middle, and the pink plate on top (the brand's
 * surprise, right where the eye lands). Colours come from CSS variables so the
 * base plate lifts to a light navy on the dark theme. `src/app/icon.svg` uses
 * the same geometry with the light-theme colours; keep the two in sync, then
 * run `node scripts/gen-icons.mjs` for the PNG/ICO icons.
 */

/** Top-face rhombus and its visible side band, for a plate whose top is at y. */
const top = (y: number) => `M32 ${y} L58 ${y + 13} L32 ${y + 26} L6 ${y + 13} Z`;
const side = (y: number) =>
  `M6 ${y + 13} L32 ${y + 26} L58 ${y + 13} L58 ${y + 18} L32 ${y + 31} L6 ${y + 18} Z`;

const PLATES = [
  {
    y: 30,
    face: "var(--hue-blue)",
    edge: "color-mix(in oklab, var(--hue-blue) 70%, black)",
  },
  {
    y: 17,
    face: "color-mix(in oklab, var(--hue-blue) 55%, var(--paper))",
    edge: "color-mix(in oklab, var(--hue-blue) 75%, var(--paper))",
  },
  { y: 4, face: "var(--pop)", edge: "color-mix(in oklab, var(--pop) 72%, var(--brand))" },
] as const;

interface LayersMarkProps {
  className?: string;
  /** Legacy (gradient ids); unused now that the plates are flat. */
  id?: string;
  /** Spread the layers apart when an ancestor `.group` is hovered. */
  lively?: boolean;
}

export default function LayersMark({ className, lively = true }: LayersMarkProps) {
  const shift = ["group-hover:translate-y-[3px]", "", "group-hover:-translate-y-[4px]"];
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={cn("shrink-0 overflow-visible", className)}>
      {PLATES.map((p, i) => (
        <g
          key={i}
          className={cn(
            "transition-transform duration-300 ease-[cubic-bezier(.3,.7,.4,1.4)]",
            lively && shift[i],
          )}
          strokeLinejoin="round"
          strokeWidth={2.5}
          style={{ fill: p.face, stroke: p.face }}
        >
          <path d={side(p.y)} style={{ fill: p.edge, stroke: p.edge }} />
          <path d={top(p.y)} />
        </g>
      ))}
    </svg>
  );
}

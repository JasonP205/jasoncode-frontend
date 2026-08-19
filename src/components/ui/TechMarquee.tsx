import React from "react";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import Icon from "./icon";
import { techStack, type Tech } from "@/data/tech-stack";

/**
 * Copies of the full list in each half of the track. One sequence measures
 * ~2990px, which would leave a gap at the trailing edge on an ultrawide before
 * the loop came round; two clears any display.
 */
const SEQUENCES_PER_HALF = 2;

/**
 * Seconds for the track to travel its own half-width — two sequences, so about
 * 6000px. That works out near 31px/s: a drift you notice at the edge of vision
 * rather than a ticker demanding to be read.
 */
const DURATION_SECONDS = 190;

const TechIcon = ({ icon, mono, tint }: Tech) => (
  // The box is sized here, not on the glyph: `Icon` renders nothing until it
  // mounts, and an unreserved box would let every item resize on hydration —
  // which on a moving track shows up as a jolt, not just a reflow.
  <span className="flex h-5 w-5 shrink-0 items-center justify-center">
    <Icon
      icon={icon}
      className={cn("h-5 w-5", mono && "dark:invert", tint && "text-foreground")}
    />
  </span>
);

const TechItem = ({ tech }: { tech: Tech }) => (
  <li className="group flex shrink-0 items-center gap-2.5">
    <TechIcon {...tech} />
    <span className="font-mono text-[0.8125rem] whitespace-nowrap text-foreground/70 transition-colors duration-300 group-hover:text-foreground">
      {tech.name}
    </span>
  </li>
);

/**
 * Section marker inside the stream: a hairline, then the category in caps. The
 * extra side margin gives a category break more air than the gap between two
 * tools, so the grouping still reads while the line is moving.
 *
 * `first:ml-0` drops it at the head of each sequence — otherwise the parked
 * (reduced-motion) list starts 16px off the page's text column. The sequence
 * carries `pr-14` to make the join between copies match this same 56px break,
 * so every sequence stays identical and the loop keeps its exact -50% seam.
 */
const CategoryMark = ({ label }: { label: string }) => (
  <li className="mx-4 flex shrink-0 items-center gap-3.5 first:ml-0">
    <span aria-hidden className="h-3.5 w-px bg-border" />
    <span className="font-mono text-[0.6875rem] tracking-[0.2em] whitespace-nowrap text-muted-foreground uppercase">
      {label}
    </span>
  </li>
);

/**
 * One stream, one direction.
 *
 * This was four rows drifting in alternating directions. Opposed motion shears
 * against itself and leaves the eye nowhere to rest, and forty items moving at
 * once is noise rather than presence — so the four channels are now one line,
 * with the category names riding inside it as section markers. A single slow
 * drift reads as considered; four fighting ones read as busy.
 *
 * Two copies, and the track slides exactly -50%, so copy two lands precisely
 * where copy one began and the loop has no seam. The gap between copies is
 * `padding-right` on each rather than `gap` on the track: with `gap`, half the
 * track width is off by half a gap and the loop stutters once per cycle.
 */
const TechMarquee = async () => {
  const t = await getTranslations("skills");

  const sequence = (
    <ol className="flex shrink-0 items-center gap-10 pr-14">
      {techStack.map((category) => (
        <React.Fragment key={category.id}>
          <CategoryMark label={t(`categories.${category.id}`)} />
          {category.items.map((tech) => (
            <TechItem key={`${category.id}-${tech.name}`} tech={tech} />
          ))}
        </React.Fragment>
      ))}
    </ol>
  );

  return (
    <div className="border-y border-border/70">
      <div className="marquee-viewport overflow-hidden py-6 sm:py-7">
        <div
          className="marquee-track"
          style={
            {
              "--marquee-duration": `${DURATION_SECONDS}s`,
            } as React.CSSProperties
          }
        >
          {sequence}
          {/* Filler for the loop only — kept out of the accessibility tree so
              the list is announced once, and dropped entirely once reduced
              motion parks the track and it becomes a plain wrapped list. */}
          {Array.from({ length: SEQUENCES_PER_HALF * 2 - 1 }).map((_, i) => (
            <div key={i} aria-hidden className="marquee-clone flex shrink-0">
              {sequence}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechMarquee;

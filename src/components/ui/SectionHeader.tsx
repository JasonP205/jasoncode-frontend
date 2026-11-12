import { cn } from "@/lib/utils";
import Reveal from "./Reveal";
import Headline from "./Headline";
import type { Tone } from "./tones";

interface SectionHeaderProps {
  /** Short label naming the topic, shown as an eyebrow pill. */
  kicker?: string;
  /** Kept for callers; every tone now resolves to the brand navy. */
  tone?: Tone;
  /** Legacy (layers redesign); ignored. */
  layer?: number;
  /** Paint the eyebrow's dot pink — the section's one surprise. */
  pop?: boolean;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "center" | "left";
  /** Heading level; sections under a page's h1 use h2. */
  as?: "h1" | "h2";
  className?: string;
}

/**
 * Eyebrow pill → headline → one short paragraph. Every section on the site
 * opens this way, so a visitor learns the rhythm once and can skim by headline.
 */
export default function SectionHeader({
  kicker,
  pop,
  title,
  lede,
  align = "center",
  as: Heading = "h2",
  className,
}: SectionHeaderProps) {
  const centered = align === "center";
  return (
    <Reveal
      className={cn(
        "flex flex-col",
        centered ? "mx-auto max-w-4xl items-center text-center" : "max-w-3xl",
        className,
      )}
    >
      {kicker && (
        <p className="mb-5">
          <span className="eyebrow" data-pop={pop ? "" : undefined}>
            {kicker}
          </span>
        </p>
      )}
      {Heading === "h1" && typeof title === "string" ? (
        <Headline className="headline-section text-foreground" segments={[{ text: title }]} />
      ) : (
        <Heading className="headline-section text-foreground">{title}</Heading>
      )}
      {lede && <p className="lede mt-5 max-w-2xl">{lede}</p>}
    </Reveal>
  );
}

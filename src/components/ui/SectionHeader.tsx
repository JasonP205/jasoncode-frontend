import { cn } from "@/lib/utils";
import Reveal from "./Reveal";
import { toneText, type Tone } from "./tones";

interface SectionHeaderProps {
  /** Short label naming the topic. Optional — most sections don't need one. */
  kicker?: string;
  /** The section's hue; colours the kicker (Apple's orange "Hiệu năng"). */
  tone?: Tone;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "center" | "left";
  /** Heading level; sections under a page's h1 use h2. */
  as?: "h1" | "h2";
  className?: string;
}

/**
 * Kicker → headline → one short paragraph. Every section on the site opens
 * this way, so a visitor learns the rhythm once and can skim by headline.
 */
export default function SectionHeader({
  kicker,
  tone,
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
        <p className={cn("kicker mb-3", tone ? toneText[tone] : "text-muted-foreground")}>
          {kicker}
        </p>
      )}
      <Heading className="headline-section text-foreground">{title}</Heading>
      {lede && <p className="lede mt-5 max-w-2xl">{lede}</p>}
    </Reveal>
  );
}

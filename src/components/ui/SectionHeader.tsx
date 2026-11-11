import { cn } from "@/lib/utils";
import Reveal from "./Reveal";
import KineticHeadline from "./kinetic/KineticHeadline";
import { toneCycle, toneText, type Tone } from "./tones";

interface SectionHeaderProps {
  /** Short label naming the topic. Optional — most sections don't need one. */
  kicker?: string;
  /** The section's hue; colours the kicker (Apple's orange "Hiệu năng"). */
  tone?: Tone;
  /**
   * Depth in the page's stack: shows a mono "L1" tag before the kicker, in the
   * section's tone (or the layer's own tone when no tone is given).
   */
  layer?: number;
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
  layer,
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
      {(kicker || layer !== undefined) && (
        <p className={cn("mb-4 flex items-center gap-3", centered && "justify-center")}>
          {layer !== undefined && (
            <span className={cn("layer-tag", toneText[tone ?? toneCycle[layer % 5]])}>
              L{layer}
            </span>
          )}
          {kicker && (
            <span className={cn("kicker", tone ? toneText[tone] : "text-muted-foreground")}>
              {kicker}
            </span>
          )}
        </p>
      )}
      {/* A page's h1 gets the kinetic treatment when it is plain text. */}
      {Heading === "h1" && typeof title === "string" ? (
        <KineticHeadline className="headline-section text-foreground" segments={[{ text: title }]} />
      ) : (
        <Heading className="headline-section text-foreground">{title}</Heading>
      )}
      {lede && <p className="lede mt-5 max-w-2xl">{lede}</p>}
    </Reveal>
  );
}

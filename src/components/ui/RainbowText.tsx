import { cn } from "@/lib/utils";

interface RainbowTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * The site's one colour moment: a slow rainbow gradient clipped to the text.
 * Use it once per page at most — it is the signature, not a highlighter.
 *
 * Pure CSS, so it stays a server component; `animate-rainbow` stops under
 * `prefers-reduced-motion`. The vertical padding (pulled back with negative
 * margins) grows the background-clip paint box so stacked Vietnamese
 * diacritics above the cap height are painted rather than clipped.
 */
const RainbowText = ({ children, className }: RainbowTextProps) => {
  return (
    <span
      className={cn(
        "animate-rainbow bg-size-[200%_auto] bg-clip-text text-transparent py-[0.14em] my-[-0.14em] [filter:drop-shadow(0_1px_14px_rgb(72_105_255/0.2))]",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(110deg, #f04464, #e68313, #18a86f, #1595d3, #626cf4, #a95be8, #f04464)",
      }}
    >
      {children}
    </span>
  );
};

export default RainbowText;

import { cn } from "@/lib/utils";
import Jot from "./Jot";

/**
 * The Jason Dev logo. "Jason Dev" is the full and legal name.
 *
 * - `compact` (header): just the J — faceless Jot, with no wordmark, as quiet
 *   as Apple's glyph in its nav.
 * - `full` (footer and anywhere the name must be spelled out): Jot beside
 *   "Jason Dev", ending on Jot's mint-to-blue stop.
 *
 * Wherever the logo is a link, its accessible name must still say "Jason Dev"
 * (see `nav.logoAria`). Transparent, so it sits on any background.
 */
export default function Logo({
  variant = "compact",
  className,
}: {
  variant?: "compact" | "full";
  className?: string;
}) {
  if (variant === "compact") {
    return <Jot face={false} animated={false} className={cn("size-8", className)} />;
  }

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Jot face={false} animated={false} className="size-10" />
      <span className="text-xl font-semibold tracking-tight text-foreground">
        Jason Dev
        <span
          aria-hidden
          className="ml-[0.08em] inline-block size-[0.28em] rounded-full bg-linear-to-br from-[#2ee6a8] to-[#2f8bff]"
        />
      </span>
    </span>
  );
}

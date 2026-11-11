import { cn } from "@/lib/utils";
import LayersMark from "./LayersMark";

/**
 * The Jason Dev logo: the layers mark. "Jason Dev" is the full and legal name.
 *
 * - `compact` (header): the mark alone.
 * - `full` (footer and anywhere the name must be spelled out): the mark beside
 *   "Jason Dev", ending on a stop in the layer gradient.
 *
 * Put it inside a `.group` link and the layers spread apart on hover. Wherever
 * the logo is a link, its accessible name must still say "Jason Dev" (see
 * `nav.logoAria`). Transparent, so it sits on any background. Jot stays the
 * mascot (404, loading, coming soon) but is no longer the logo.
 */
export default function Logo({
  variant = "compact",
  className,
}: {
  variant?: "compact" | "full";
  className?: string;
}) {
  if (variant === "compact") {
    return <LayersMark id="lm-nav" className={cn("size-8", className)} />;
  }

  return (
    <span className={cn("group inline-flex items-center gap-2.5", className)}>
      <LayersMark id="lm-full" className="size-10" />
      <span className="text-xl font-semibold tracking-tight text-foreground">
        Jason Dev
        <span
          aria-hidden
          className="ml-[0.08em] inline-block size-[0.28em] rounded-full bg-linear-to-br from-[#2f8bff] to-[#ff4f9a]"
        />
      </span>
    </span>
  );
}

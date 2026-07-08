import { cn } from "@/lib/utils";

/**
 * A decorative "fake browser window" built entirely from skeleton blocks
 * (shimmering via `animate-pulse`). Pure CSS, no images — it reads as a website
 * preview loading in, giving the hero a visual companion beside the copy.
 */
export default function SkeletonMockup({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "select-none rounded-2xl border border-border bg-secondary/50 p-3 shadow-sm",
        className,
      )}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-1 pb-3">
        <span className="size-2.5 rounded-full bg-[#fb7185]/70" />
        <span className="size-2.5 rounded-full bg-[#fdba74]/70" />
        <span className="size-2.5 rounded-full bg-[#86efac]/70" />
        <div className="ml-2 h-4 w-1/2 rounded-full bg-foreground/10" />
      </div>

      {/* Viewport */}
      <div className="overflow-hidden rounded-xl border border-border bg-background p-4">
        {/* Hero-ish heading + lines */}
        <div className="h-6 w-2/3 rounded-md bg-foreground/15 animate-pulse" />
        <div className="mt-3 h-3 w-full rounded bg-foreground/10 animate-pulse" />
        <div className="mt-2 h-3 w-5/6 rounded bg-foreground/10 animate-pulse" />

        {/* Fake CTA */}
        <div className="mt-4 h-8 w-28 rounded-lg bg-foreground/20 animate-pulse" />

        {/* Card grid */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-lg border border-border p-2"
            >
              <div className="h-10 rounded-md bg-foreground/10 animate-pulse" />
              <div className="h-2 w-3/4 rounded bg-foreground/10 animate-pulse" />
              <div className="h-2 w-1/2 rounded bg-foreground/10 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

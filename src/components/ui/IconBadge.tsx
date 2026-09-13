import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toneSoft, toneText, type Tone } from "./tones";

/** An icon in its tone, sitting on a pale wash of the same tone. */
export default function IconBadge({
  icon: Icon,
  tone,
  size = "md",
  className,
}: {
  icon: LucideIcon;
  tone: Tone;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        size === "md" ? "size-12 rounded-2xl" : "size-10 rounded-xl",
        toneSoft[tone],
        toneText[tone],
        className,
      )}
    >
      <Icon className={size === "md" ? "size-6" : "size-5"} strokeWidth={1.75} />
    </span>
  );
}

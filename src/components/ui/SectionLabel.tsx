import { cn } from "@/lib/utils";

/**
 * The one eyebrow style on the site: a hairline rule, then the label set in
 * mono caps. Sections used to each invent their own (a dot here, a dash there),
 * which made every block read as its own little design. Set in `font-mono`
 * because the labels are signposts, not prose — it keeps them from competing
 * with the serif headings they sit above.
 */
const SectionLabel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-muted-foreground",
      className,
    )}
  >
    <span aria-hidden className="h-px w-6 bg-foreground/35" />
    {children}
  </span>
);

export default SectionLabel;

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import IconBadge from "@/components/ui/IconBadge";
import Reveal from "@/components/ui/Reveal";
import { toneRing, type Tone } from "@/components/ui/tones";

export interface Plan {
  name: string;
  description: string;
  features: string[];
  buttonText: string;
}

/**
 * One package as a column: icon, name, one sentence, at most four
 * deliverables, one action. No tilt, no per-card support terms — the
 * guarantees band states those once for every plan.
 *
 * Each plan carries a tone for its icon. `badge` marks the single recommended
 * plan in a set: it gets a tinted pill, a ring in its tone and the filled
 * button. The badge row is reserved on every card (from md up) so the names
 * line up across a row.
 */
export default function PlanCard({
  plan,
  icon,
  tone,
  badge,
  delay = 0,
}: {
  plan: Plan;
  icon: LucideIcon;
  tone: Tone;
  badge?: string;
  /** Legacy; every plan is a white `card` now. */
  surface?: "band" | "tile";
  delay?: number;
}) {
  return (
    <Reveal
      variant="zoom"
      delay={delay}
      className={cn(
        "card flex h-full flex-col p-6 sm:p-8",
        badge && toneRing[tone],
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <IconBadge icon={icon} tone={tone} />
        {badge && (
          // The recommended plan's badge is the page's pink surprise.
          <span className="rounded-full bg-pop px-3 py-1 text-sm font-semibold text-pop-ink">
            {badge}
          </span>
        )}
      </div>
      <h3 className="headline-card mt-6 text-foreground">{plan.name}</h3>
      <p className="mt-3 leading-relaxed text-pretty text-muted-foreground">{plan.description}</p>

      <ul className="mt-6 flex-1 border-t border-border/70">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="border-b border-border/70 py-2.5 text-[0.9375rem] leading-snug text-foreground/85 sm:py-3"
          >
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href="/contact"
        className={cn("mt-8 w-full", badge ? "btn-primary" : "btn-secondary")}
      >
        {plan.buttonText}
      </Link>
    </Reveal>
  );
}

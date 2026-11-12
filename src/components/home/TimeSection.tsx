import { getTranslations } from "next-intl/server";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

interface Milestone {
  when: string;
  title: string;
  body: string;
}

/**
 * Six milestones on a vertical timeline, the header pinned beside them on
 * wide screens. Each step is a numbered navy node; the latest one — today —
 * is the pink one.
 */
export default async function TimeSection() {
  const t = await getTranslations("profile.time");
  const items = t.raw("items") as Milestone[];
  const last = items.length - 1;

  return (
    <section id="time" className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader align="left" kicker={t("kicker")} title={t("heading")} lede={t("lede")} />
        </div>
        <ol className="relative">
          {/* The spine. */}
          <span aria-hidden className="absolute top-2 bottom-2 left-[1.1875rem] w-px bg-border" />
          {items.map((m, i) => {
            const now = i === last;
            return (
              <li key={i} className="relative grid grid-cols-[2.5rem_1fr] gap-5 pb-10 last:pb-0">
                <span
                  aria-hidden
                  className={cn(
                    "mono-tag relative z-10 flex size-10 items-center justify-center rounded-full ring-4 ring-background",
                    now ? "bg-pop text-pop-ink" : "bg-tile text-hue-blue shadow-[inset_0_0_0_1px_var(--border)]",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Reveal delay={0.04} className={cn("pt-1.5", now && "card -mt-3 p-5 sm:p-6")}>
                  <p className="text-sm font-semibold text-hue-blue">{m.when}</p>
                  <h3 className="headline-card mt-1.5 text-foreground">{m.title}</h3>
                  <p className="mt-2 max-w-lg leading-relaxed text-muted-foreground">{m.body}</p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

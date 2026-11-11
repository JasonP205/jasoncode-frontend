import { getTranslations } from "next-intl/server";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/** Text colour per stone; the 3D stones in HomeWorld use the same order. */
export const STONE_TEXT = [
  "text-hue-blue",
  "text-hue-purple",
  "text-hue-green",
  "text-hue-orange",
  "text-hue-pink",
  "text-stone-gold",
] as const;

interface Milestone {
  when: string;
  title: string;
  body: string;
}

/**
 * The stream of time: six milestones down a central spine. Each spine cell
 * is an empty slot (`data-world-slot="stone-i"`) where HomeWorld draws a
 * faceted stone on a ticking dial; the time stream ribbon threads through
 * them (`data-world-node`). Stones light as the reader reaches them, then
 * travel along with the reader to the contact section.
 */
export default async function TimeSection() {
  const t = await getTranslations("profile.time");
  const items = t.raw("items") as Milestone[];

  return (
    <section id="time" data-world-anchor className="scroll-mt-16 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <SectionHeader align="left" tone="blue" kicker={t("kicker")} title={t("heading")} lede={t("lede")} />
        </div>
        <ol className="mt-14 space-y-8 lg:mt-20 lg:space-y-2">
          {items.map((m, i) => {
            const right = i % 2 === 1;
            return (
              <li
                key={i}
                className="grid grid-cols-[4.5rem_1fr] items-center gap-5 lg:grid-cols-[1fr_10rem_1fr] lg:gap-10"
              >
                <div
                  data-world-node
                  data-world-slot={`stone-${i}`}
                  aria-hidden
                  className="size-[4.5rem] lg:col-start-2 lg:row-start-1 lg:size-40"
                />
                <Reveal
                  delay={0.05}
                  className={cn(
                    "lg:row-start-1",
                    right ? "lg:col-start-3" : "lg:col-start-1 lg:text-right",
                  )}
                >
                  <p className={cn("text-sm font-semibold tracking-wide", STONE_TEXT[i])}>
                    <span className="mr-2 font-mono text-xs opacity-70">{String(i + 1).padStart(2, "0")}</span>
                    {m.when}
                  </p>
                  <h3 className="headline-card mt-2 text-foreground">{m.title}</h3>
                  <p className={cn("mt-2 max-w-md leading-relaxed text-muted-foreground", !right && "lg:ml-auto")}>
                    {m.body}
                  </p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

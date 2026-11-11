import { getTranslations } from "next-intl/server";
import { Briefcase, GraduationCap } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import Tilt3D from "@/components/ui/three/Tilt3D";

/** L1 — what Phuc is doing right now: the job and the final year. */
export default async function NowSection() {
  const t = await getTranslations("profile.now");
  const entries = [
    { key: "job" as const, Icon: Briefcase, tone: "text-hue-purple" },
    { key: "school" as const, Icon: GraduationCap, tone: "text-hue-purple" },
  ];

  return (
    <section id="now" data-world-anchor className="scroll-mt-16 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
          <SectionHeader
            align="left"
            layer={1}
            tone="purple"
            kicker={t("kicker")}
            title={t("heading")}
            lede={t("lede")}
          />
          {/* HomeWorld floats a swarm of e-paper shelf labels here — the
              ESL work at TOTDigi. Click one to flip it to a new price. */}
          <div data-world-slot="esl" aria-hidden className="h-[16rem] sm:h-[20rem]" />
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {entries.map(({ key, Icon, tone }, i) => (
            <Reveal key={key} variant="zoom" delay={i * 0.08}>
              <Tilt3D max={7}>
              <article className="relative h-full rounded-[1.75rem] border border-border bg-tile p-7 [transform-style:preserve-3d] sm:p-9">
                <div className="flex items-center justify-between gap-4">
                  <Icon className={`h-6 w-6 ${tone}`} aria-hidden />
                  <span className="inline-flex items-center gap-2 rounded-full bg-hue-green/10 px-3 py-1 text-xs font-medium text-hue-green dark:bg-hue-green/15">
                    <span aria-hidden className="relative flex size-1.5">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-hue-green opacity-60 motion-reduce:animate-none" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-hue-green" />
                    </span>
                    {t("badge")}
                  </span>
                </div>
                <h3 data-depth="2" className="headline-card mt-8 text-foreground">{t(`${key}.role`)}</h3>
                <p className="mt-1 font-medium text-foreground/80">{t(`${key}.org`)}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t(`${key}.period`)}</p>
                <p className="mt-5 leading-relaxed text-muted-foreground">{t(`${key}.body`)}</p>
              </article>
              </Tilt3D>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { getTranslations } from "next-intl/server";
import { Briefcase, GraduationCap } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import EslMock from "./EslMock";

/** What Phuc is doing right now: the job and the final year. */
export default async function NowSection() {
  const t = await getTranslations("profile.now");
  const entries = [
    { key: "job" as const, Icon: Briefcase, current: true, href: "https://totdigi.vn/" },
    { key: "school" as const, Icon: GraduationCap, current: true, href: undefined },
  ];

  return (
    <section id="now" className="scroll-mt-20 bg-band px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <SectionHeader align="left" kicker={t("kicker")} title={t("heading")} lede={t("lede")} />
          {/* What the TOTDigi work looks like: e-paper shelf labels. */}
          <Reveal variant="zoom">
            <EslMock />
          </Reveal>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {entries.map(({ key, Icon, current, href }, i) => (
            <Reveal key={key} variant="zoom" delay={i * 0.08}>
              <article className="card h-full p-7 sm:p-9">
                <div className="flex items-center justify-between gap-4">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-hue-blue/[0.08] text-hue-blue">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  {current && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-hue-blue/[0.08] px-3 py-1 text-xs font-semibold text-hue-blue">
                      <span aria-hidden className="relative flex size-1.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-pop opacity-80 motion-reduce:animate-none" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-pop" />
                      </span>
                      {t("badge")}
                    </span>
                  )}
                </div>
                <h3 className="headline-card mt-7 text-foreground">{t(`${key}.role`)}</h3>
                <p className="mt-1 font-medium text-foreground/80">
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="underline decoration-pop decoration-2 underline-offset-4 transition-colors hover:text-hue-blue">
                      {t(`${key}.org`)}
                    </a>
                  ) : (
                    t(`${key}.org`)
                  )}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{t(`${key}.period`)}</p>
                <p className="mt-5 leading-relaxed text-muted-foreground">{t(`${key}.body`)}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

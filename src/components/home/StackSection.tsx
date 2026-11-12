import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import { stackLayers } from "@/data/stack-layers";

/** Latin-only layer names, drawn in mono beside the localized label. */
const LAYER_NAMES = ["interface", "state", "api", "data", "infra"] as const;

/**
 * The five layers Phuc works across, as a feature grid: one card per layer
 * with its tools. The sixth cell is the services aside — a navy card, the
 * only filled one on the page.
 */
export default async function StackSection() {
  const t = await getTranslations("profile.stack");
  const aside = await getTranslations("profile.aside");
  const labels = t.raw("layers") as string[];

  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader kicker={t("kicker")} title={t("heading")} lede={t("lede")} />
        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {labels.map((label, i) => (
            <li key={label}>
              <Reveal variant="zoom" delay={(i % 3) * 0.06} className="card h-full p-7">
                <p className="flex items-center justify-between">
                  <span className="mono-tag text-hue-blue">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mono-tag text-muted-foreground">{LAYER_NAMES[i]}</span>
                </p>
                <h3 className="headline-card mt-6 text-foreground">{label}</h3>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {stackLayers[i].map((item) => (
                    <li
                      key={item}
                      className="rounded-lg bg-band px-2.5 py-1 text-sm text-foreground/85 shadow-[inset_0_0_0_1px_var(--border)]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
          <li>
            <Reveal
              variant="zoom"
              delay={0.12}
              className="dark flex h-full flex-col justify-between gap-8 rounded-[1.25rem] bg-brand p-7 text-foreground"
            >
              <p className="text-lg leading-relaxed font-medium">{aside("text")}</p>
              <Link href="/services" className="link-more self-start text-pop!">
                {aside("link")}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Reveal>
          </li>
        </ul>
      </div>
    </section>
  );
}

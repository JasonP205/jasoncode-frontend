import { getTranslations } from "next-intl/server";
import { ArrowDown, FileText } from "lucide-react";
import { Link } from "@/i18n/navigation";
import KineticHeadline from "@/components/ui/kinetic/KineticHeadline";
import LayerScene from "@/components/ui/three/LayerScene";
import SoundToggle from "@/components/ui/sound/SoundToggle";

const STAGGER = 110;

/**
 * L0 — who this is. Kinetic name on the left, the three.js stack on the
 * right: hover a layer and it lifts and plays its note; scroll and the layers
 * pull apart. The headline renders as text on the server, so it is the LCP
 * element from the first paint; the scene fades in once WebGL is ready.
 */
export default async function ProfileHero() {
  const t = await getTranslations("profile");
  const facts = t.raw("facts") as { value: string; label: string }[];
  const delay = (step: number) => ({ animationDelay: `${step * STAGGER}ms` });

  return (
    <section
      data-anchor="hero"
      data-world-anchor
      className="relative isolate overflow-hidden px-5 sm:px-8"
    >
      <div aria-hidden className="layer-wash absolute inset-0 -z-10" />

      <div className="mx-auto grid min-h-[calc(100svh-4.25rem)] max-w-6xl items-center gap-6 pt-10 pb-10 lg:grid-cols-[1.15fr_1fr] lg:gap-4 lg:pt-6">
        <div className="relative z-10">
          <p className="animate-rise flex items-center gap-3" style={delay(0)}>
            <span className="layer-tag text-hue-blue">L0</span>
            <span className="kicker text-muted-foreground">{t("kicker")}</span>
          </p>

          <KineticHeadline
            className="headline-hero mt-5 text-foreground"
            segments={[
              { text: t("headlineLead") },
              { text: t("headlineAccent"), accent: true },
            ]}
          />

          <p className="animate-rise lede mt-6 max-w-xl" style={delay(2)}>
            {t("lede")}
          </p>

          <div className="animate-rise mt-8 flex flex-wrap items-center gap-3" style={delay(3)}>
            <Link href="/cv" className="btn-primary">
              <FileText className="h-4 w-4" aria-hidden />
              {t("ctaCv")}
            </Link>
            <a href="#contact" className="btn-secondary">
              {t("ctaContact")}
            </a>
          </div>

          <div
            className="animate-rise mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground"
            style={delay(4)}
          >
            <SoundToggle showText onLabel={t("soundOn")} offLabel={t("soundOff")} />
            <span className="max-w-xs">{t("soundPrompt")}</span>
          </div>
        </div>

        <LayerScene
          variant="stack"
          className="relative -mx-5 h-[22rem] opacity-0 transition-opacity duration-1000 data-ready:opacity-100 sm:mx-0 sm:h-[30rem] lg:-mr-24 lg:h-[40rem] xl:-mr-40"
        />
      </div>

      <div className="mx-auto max-w-6xl border-t border-border pb-14">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 pt-8 md:grid-cols-4">
          {facts.map((fact, i) => (
            // Label first in the markup (dt before dd), value on top visually.
            <div
              key={fact.label}
              className="animate-rise flex flex-col-reverse justify-end"
              style={delay(5 + i * 0.5)}
            >
              <dt className="mt-1 text-sm leading-snug text-muted-foreground">{fact.label}</dt>
              <dd className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
        <a
          href="#now"
          className="mt-12 hidden items-center gap-3 text-sm text-muted-foreground hover:text-foreground sm:inline-flex"
        >
          <span aria-hidden className="scroll-cue" />
          {t("scrollCue")}
          <ArrowDown className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>
    </section>
  );
}

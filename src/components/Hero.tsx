import { getTranslations } from "next-intl/server";
import { FileText } from "lucide-react";
import Aura from "@/components/ui/Aura";
import FloatingOrbs from "@/components/ui/scroll/FloatingOrbs";
import RainbowText from "@/components/ui/RainbowText";
import HeroScrollFx from "@/components/ui/scroll/HeroScrollFx";
import { Link } from "@/i18n/navigation";

/** Gap between each line's entrance, in ms. */
const STAGGER = 110;

/**
 * The thesis in one screen: type only, no backdrop. The lead lines sit in grey
 * so the eye lands on the payoff, which carries the site's single gradient.
 * The work itself is the imagery — the project tiles start right below.
 *
 * Motion, Apple-style: each line rises in on load (pure CSS, so it starts with
 * the first paint instead of waiting for hydration), and `HeroScrollFx` eases
 * the whole block back as the page scrolls past it.
 */
const Hero = async () => {
  const t = await getTranslations("hero");
  // The message breaks the lead into sentences; each gets its own entrance.
  const leadLines = t("headlineLead").split("\n");
  const delay = (step: number) => ({ animationDelay: `${step * STAGGER}ms` });

  return (
    <section
      data-anchor="hero"
      className="relative isolate overflow-hidden px-5 pt-16 pb-20 sm:px-8 sm:pt-32 sm:pb-36"
    >
      <Aura />
      <FloatingOrbs />
      <HeroScrollFx className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        <h1 className="headline-hero text-foreground">
          {leadLines.map((line, index) => (
            <span
              key={line}
              className="animate-rise block text-foreground/90 dark:text-white"
              style={delay(index)}
            >
              {line}
            </span>
          ))}
          <span className="animate-rise block" style={delay(leadLines.length)}>
            <RainbowText>{t("headlineAccent")}</RainbowText>
          </span>
        </h1>
        <p
          className="animate-rise lede mt-7 max-w-3xl !text-foreground/75 dark:!text-white/75"
          style={delay(leadLines.length + 1.5)}
        >
          {t.rich("intro", {
            name: (chunks) => (
              <span className="font-medium text-foreground">{chunks}</span>
            ),
          })}
        </p>
        <div
          className="animate-rise mt-10 flex flex-col items-center gap-3 sm:flex-row"
          style={delay(leadLines.length + 2.5)}
        >
          {/* In-page anchor: the contact form is further down this page, and
              `scroll-behavior: smooth` on <html> handles the glide. */}
          <a href="#contact" className="btn-primary">
            {t("cta")}
          </a>
          <Link href="/cv" aria-label={t("cvCtaAria")} className="btn-secondary">
            {t("cvCta")}
            <FileText className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </HeroScrollFx>
    </section>
  );
};

export default Hero;

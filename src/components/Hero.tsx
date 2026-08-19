import { getTranslations } from "next-intl/server";
import { Button } from "@heroui/react";
import { FileText } from "lucide-react";
import ScrollButton from "@/components/ui/ScrollButton";
import HeroVideo from "@/components/HeroVideo";
import RainbowText from "@/components/ui/RainbowText";

const Hero = async () => {
  const t = await getTranslations("hero");
  return (
    <section data-anchor="hero">
      {/* A single centred grid cell rather than absolutely-positioned copy over
          a fixed `aspect-video` box. On a phone that box is ~210px tall while
          the headline needs ~450px, so the copy used to spill out of the video
          and onto the page below it. As a grid item the content sets the floor
          and the 16:9 ratio only applies once there is room for it. */}
      <div className="relative isolate grid min-h-[32rem] w-full place-items-center overflow-hidden sm:aspect-video sm:min-h-0">
        <div className="absolute inset-0 -z-20 bg-secondary">
          <HeroVideo />
        </div>

        {/* Theme-aware scrim. The middle stop used to be fully transparent, so
            the headline sat straight on the footage with whatever contrast the
            frame happened to give it. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-linear-to-b from-background/85 via-background/45 to-background"
        />

        <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-5 py-16 text-center sm:px-8">
          <h1 className="font-serif text-[2rem] font-normal leading-tight tracking-tight text-foreground sm:text-6xl sm:leading-snug sm:tracking-[-2.46px] md:text-7xl lg:text-8xl">
            {t.rich("headline", {
              design: (chunks) => <RainbowText>{chunks}</RainbowText>,
              code: (chunks) => <RainbowText>{chunks}</RainbowText>,
            })}
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:mt-8 sm:text-lg">
            {t.rich("intro", {
              name: (chunks) => (
                <span className="font-serif font-medium italic text-foreground">
                  {chunks}
                </span>
              ),
            })}
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:mt-12 sm:flex-row sm:gap-4">
            <ScrollButton sectionId="contact" size="lg">
              {t("cta")}
            </ScrollButton>
            {/* A plain anchor, not the locale-aware `Link`: the CV is a static
                file in `public/`, so it has no `/vi` or `/en` variant to route
                to. It opens in a new tab so the visitor keeps their place. */}
            <a
              href="/cv/CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("cvCtaAria")}
            >
              <Button size="lg" variant="outline">
                {t("cvCta")}
                <FileText className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

import { getTranslations } from "next-intl/server";
import ScrollButton from "@/components/ui/ScrollButton";
import HeroVideo from "@/components/HeroVideo";
import RainbowText from "@/components/ui/RainbowText";

const Hero = async () => {
  const t = await getTranslations("hero");
  return (
    <section data-anchor="hero">
      <div className="relative w-full aspect-video">
        <div className="absolute top-0 left-0 w-full h-full bg-secondary">
          <HeroVideo />
        </div>

        <div className="w-full h-full absolute top-0 left-0 bg-linear-to-t from-background via-transparent to-background flex flex-col justify-center items-center text-center px-4" />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center p-8">
          <h1 className="text-4xl sm:text-7xl md:text-8xl font-serif font-normal text-foreground leading-snug tracking-tight sm:tracking-[-2.46px] px-2 text-center">
            {t.rich("headline", {
              design: (chunks) => <RainbowText>{chunks}</RainbowText>,
              code: (chunks) => <RainbowText>{chunks}</RainbowText>,
            })}
          </h1>
          <p className="text-sm sm:text-base md:text-lg max-w-2xl mt-6 sm:mt-8 leading-relaxed text-center px-4">
            {t.rich("intro", {
              name: (chunks) => (
                <span className="text-foreground font-medium italic font-serif">{chunks}</span>
              ),
            })}
          </p>
          <div className="mt-10 sm:mt-12">
            <ScrollButton sectionId="contact">{t("cta")}</ScrollButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

import { use } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Card, Button } from "@heroui/react";
import { BadgeCheck, Eye, LifeBuoy } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import MotionDiv from "@/components/ui/motionDiv";
import ThreeDCard from "@/components/ThreeDCard";
import Questions from "@/components/services/Questions";
import SkeletonMockup from "@/components/services/SkeletonMockup";
import ServicesCatalog from "@/components/services/ServicesCatalog";
import { Link } from "@/i18n/navigation";
import { buildAlternates, ogLocaleFields } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import RainbowText from "@/components/ui/RainbowText";

const guaranteeIcons = [
  <BadgeCheck key="quote" className="size-5" />,
  <Eye key="preview" className="size-5" />,
  <LifeBuoy key="support" className="size-5" />,
];

// Package keys, used server-side to emit the JSON-LD Offer graph. The visible
// catalog is rendered by <ServicesCatalog> (a client island) from the same
// translations, so the two stay in sync.
const planKeys = ["landing", "website", "dynamic", "optimize"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const alternates = buildAlternates(locale, "/services");

  return {
    title: t("servicesTitle"),
    description: t("servicesDescription"),
    alternates,
    keywords: [
      "thiết kế website chuyên nghiệp",
      "nhận làm website theo yêu cầu",
      "thiết kế landing page",
      "làm web có tính năng động",
      "lập trình web app Next.js React",
      "làm đồ án coursework sinh viên",
      "dịch vụ làm website cá nhân",
      "tối ưu SEO và tăng tốc website",
      "Jason Dev",
      "Phan Hoàng Phúc",
    ],
    openGraph: {
      title: t("servicesTitle"),
      description: t("servicesDescription"),
      url: alternates?.canonical as string,
      ...ogLocaleFields(locale),
    },
  };
}

export default function PricingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("services");

  const guarantees = t.raw("guarantees") as { title: string; desc: string }[];
  const workingSteps = t.raw("workingSteps") as string[];

  const servicesUrl = buildAlternates(locale, "/services")?.canonical as string;

  // Offers carry no price: the page no longer quotes one, and a
  // `priceSpecification` here would put a figure into search results that the
  // page itself does not stand behind.
  const offers = [
    ...planKeys.map((key) => ({
      name: t(`plans.${key}.name`),
      description: t(`plans.${key}.description`),
    })),
    ...(t.raw("student") as { name: string; description: string }[]),
  ];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Phan Hoàng Phúc",
    alternateName: "Jason Dev",
    url: "https://hwagfu.dev",
    jobTitle: "Freelance Web Developer",
    inLanguage: locale === "vi" ? "vi-VN" : "en-US",
    knowsAbout: offers.map((o) => o.name),
    makesOffer: offers.map((offer) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: offer.name,
        description: offer.description,
      },
      url: servicesUrl,
    })),
  };

  return (
    <div className="w-full relative py-16 sm:py-24">
      <Script
        id="services-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center"
      >
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="text-4xl sm:text-6xl md:text-7xl text-balance font-serif text-foreground leading-snug tracking-tight">
            {t("heroTitle")}{" "}
            <RainbowText>{t("heroTitleAccent")}</RainbowText>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted max-w-2xl mt-6 sm:mt-8 leading-relaxed">
            {t("heroSubtitle")}
          </p>
        </div>
        <SkeletonMockup className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto" />
      </MotionDiv>

      {/* Trust strip */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-7xl mx-auto px-4 sm:px-8 mt-12 sm:mt-16"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {guarantees.map((g, index) => (
            <div
              key={g.title}
              className="flex items-start gap-4 rounded-2xl border border-border bg-secondary/40 p-5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                {guaranteeIcons[index]}
              </span>
              <div>
                <p className="font-medium text-foreground leading-snug">
                  {g.title}
                </p>
                <p className="text-sm text-muted mt-1.5 leading-relaxed">
                  {g.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </MotionDiv>

      {/* Catalog — audience-segmented package ladders (client island) */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="max-w-7xl mx-auto px-4 sm:px-8 mt-20 sm:mt-28"
      >
        <div className="text-center flex flex-col items-center mb-10 sm:mb-14">
          <span className="text-xs uppercase tracking-[0.24em] text-muted">
            {t("journeyLabel")}
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif text-foreground mt-3 text-balance">
            {t("journeyHeading")}
          </h2>
          <p className="text-sm sm:text-base text-muted max-w-2xl mt-4 leading-relaxed">
            {t("journeySub")}
          </p>
        </div>
        <ServicesCatalog />
      </MotionDiv>

      {/* How we work */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto px-4 sm:px-8 mt-20 sm:mt-28 pb-4"
      >
        <ThreeDCard>
          <Card className="p-6 sm:p-8">
            <Card.Header className="p-0 flex flex-col items-start gap-3">
              <span className="text-xs uppercase tracking-[0.24em] text-muted">
                {t("processLabel")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-foreground">
                {t("processHeading")}
              </h2>
            </Card.Header>
            <Card.Content className="p-0 mt-6">
              <ol className="flex flex-col gap-4">
                {workingSteps.map((step, index) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background text-sm">
                      {index + 1}
                    </span>
                    <span className="text-sm sm:text-base text-foreground/80 leading-relaxed">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </Card.Content>
          </Card>
        </ThreeDCard>
      </MotionDiv>

      <Questions />

      {/* Closing */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-4xl mx-auto px-4 sm:px-8 text-center"
      >
        <p className="text-sm sm:text-base text-muted leading-relaxed">
          {t("closingNote")}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/contact">
            <Button size="lg" variant="primary" className="font-medium">
              {t("closingCta")}
            </Button>
          </Link>
          <Link href="/library/projects">
            <Button size="lg" variant="outline" className="font-medium">
              {t("closingCtaSecondary")}
            </Button>
          </Link>
        </div>
      </MotionDiv>
    </div>
  );
}

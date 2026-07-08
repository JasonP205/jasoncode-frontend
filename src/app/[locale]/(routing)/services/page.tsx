import { use } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Card, Button } from "@heroui/react";
import { ArrowRight, BadgeCheck, Check, Eye, LifeBuoy } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import MotionDiv from "@/components/ui/motionDiv";
import ThreeDCard from "@/components/ThreeDCard";
import Questions from "@/components/services/Questions";
import SkeletonMockup from "@/components/services/SkeletonMockup";
import { Link } from "@/i18n/navigation";
import { buildAlternates, ogLocaleFields } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import RainbowText from "@/components/ui/RainbowText";

const planMeta = [
  { key: "landing", featured: false, href: "/contact" },
  { key: "website", featured: true, href: "/contact" },
  { key: "dynamic", featured: false, href: "/contact" },
  { key: "optimize", featured: false, href: "/contact" },
] as const;

const guaranteeIcons = [
  <BadgeCheck key="quote" className="size-5" />,
  <Eye key="preview" className="size-5" />,
  <LifeBuoy key="support" className="size-5" />,
];

type PlanView = {
  key: string;
  featured: boolean;
  href: string;
  name: string;
  description: string;
  price: string;
  note: string;
  features: string[];
  buttonText: string;
};

/** A single pricing card, reused across the "build" and "fix" sections. */
function PlanCard({ plan, badge }: { plan: PlanView; badge?: string }) {
  return (
    <div
      className={`relative flex flex-col h-full ${
        plan.featured ? "lg:-translate-y-3" : ""
      }`}
    >
      {plan.featured && badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-foreground text-background px-4 py-1 rounded-full text-xs font-medium tracking-wide z-20 whitespace-nowrap shadow-md">
          {badge}
        </div>
      )}
      <ThreeDCard>
        <Card
          className={`w-full flex-1 flex flex-col p-6 sm:p-8 ${
            plan.featured
              ? "ring-2 ring-foreground shadow-xl relative z-10 bg-secondary"
              : ""
          }`}
        >
          <Card.Header className="flex flex-col items-start gap-2 p-0 mb-6 border-b border-border pb-6 shrink-0">
            <Card.Title className="text-2xl font-serif text-foreground">
              {plan.name}
            </Card.Title>
            <Card.Description className="text-muted leading-relaxed sm:min-h-18">
              {plan.description}
            </Card.Description>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-semibold tracking-tight text-foreground">
                {plan.price}
              </span>
            </div>
            {plan.note && (
              <p className="text-muted text-xs sm:text-sm mt-1 leading-relaxed">
                {plan.note}
              </p>
            )}
          </Card.Header>

          <Card.Content className="p-0 flex-1 flex flex-col gap-4">
            <ul className="flex flex-col gap-4">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check
                    size={20}
                    className={
                      plan.featured
                        ? "text-foreground shrink-0"
                        : "text-muted shrink-0"
                    }
                  />
                  <span className="text-sm font-medium text-foreground/80 leading-relaxed">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </Card.Content>

          <Card.Footer className="flex p-0 mt-8 shrink-0">
            <Link href={plan.href} className="w-full">
              <Button
                variant={plan.featured ? "primary" : "outline"}
                className="w-full font-medium"
                size="lg"
              >
                {plan.buttonText}
              </Button>
            </Link>
          </Card.Footer>
        </Card>
      </ThreeDCard>
    </div>
  );
}

/** Eyebrow + heading + subtitle used to introduce each journey section. */
function SectionHeading({
  label,
  heading,
  sub,
}: {
  label: string;
  heading: string;
  sub: string;
}) {
  return (
    <div className="text-center flex flex-col items-center">
      <span className="text-xs uppercase tracking-[0.24em] text-muted">
        {label}
      </span>
      <h2 className="text-2xl sm:text-4xl font-serif text-foreground mt-3 text-balance">
        {heading}
      </h2>
      <p className="text-sm sm:text-base text-muted max-w-2xl mt-4 leading-relaxed">
        {sub}
      </p>
    </div>
  );
}

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
      "thiết kế website giá rẻ",
      "làm website giá sinh viên",
      "thiết kế landing page giá rẻ",
      "làm web có tính năng động",
      "lập trình web app Next.js React",
      "freelancer web sinh viên",
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

  const plans = planMeta.map((meta) => ({
    ...meta,
    name: t(`plans.${meta.key}.name`),
    description: t(`plans.${meta.key}.description`),
    price: t(`plans.${meta.key}.price`),
    note: t(`plans.${meta.key}.note`),
    features: t.raw(`plans.${meta.key}.features`) as string[],
    buttonText: t(`plans.${meta.key}.buttonText`),
  })) as PlanView[];

  const planByKey = Object.fromEntries(
    plans.map((plan) => [plan.key, plan]),
  ) as Record<string, PlanView>;

  const workingSteps = t.raw("workingSteps") as string[];
  const guarantees = t.raw("guarantees") as { title: string; desc: string }[];
  const miniServices = t.raw("mini") as {
    name: string;
    desc: string;
    price: string;
  }[];
  const journey = t.raw("journey") as {
    title: string;
    hint: string;
    priceFrom: string;
    href: string;
  }[];
  const featuredBadge = t("featuredBadge");

  const servicesUrl = buildAlternates(locale, "/services")?.canonical as string;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Phan Hoàng Phúc",
    alternateName: "Jason Dev",
    url: "https://hwagfu.dev",
    jobTitle: "Freelance Web Developer",
    inLanguage: locale === "vi" ? "vi-VN" : "en-US",
    knowsAbout: plans.map((plan) => plan.name),
    makesOffer: plans.map((plan) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: plan.name,
        description: plan.description,
      },
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "VND",
        price: plan.price.replace(/[^\d]/g, "") || undefined,
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

      {/* "What do you need?" — self-select journey */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-7xl mx-auto px-4 sm:px-8 mt-14 sm:mt-20"
      >
        <SectionHeading
          label={t("journeyLabel")}
          heading={t("journeyHeading")}
          sub={t("journeySub")}
        />
        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {journey.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group flex flex-col justify-between rounded-2xl border border-border p-6 min-h-40 transition-colors hover:border-foreground/40 hover:bg-secondary/30"
            >
              <div>
                <h3 className="font-serif text-lg sm:text-xl text-foreground leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-muted mt-2 leading-relaxed">
                  {item.hint}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  {item.priceFrom}
                </span>
                <ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-1" />
              </div>
            </a>
          ))}
        </div>
      </MotionDiv>

      {/* Transparent promise */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 sm:mt-10"
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

      {/* A — Already have a site: odd jobs (transparent, cheap) + optimize */}
      <MotionDiv
        id="fix"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-8 mt-20 sm:mt-28 scroll-mt-24"
      >
        <SectionHeading
          label={t("fixLabel")}
          heading={t("fixHeading")}
          sub={t("fixSub")}
        />

        <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {miniServices.map((item) => (
            <div
              key={item.name}
              className="flex flex-col rounded-2xl border border-border p-5 transition-colors hover:border-foreground/30"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium text-foreground leading-snug">
                  {item.name}
                </h3>
                <span className="shrink-0 text-sm font-semibold text-foreground whitespace-nowrap">
                  {item.price}
                </span>
              </div>
              <p className="text-sm text-muted mt-2 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted mt-8">{t("miniNote")}</p>

        <div className="mt-14 sm:mt-16">
          <p className="text-center font-serif text-xl sm:text-2xl text-foreground text-balance">
            {t("fixMoreLead")}
          </p>
          <div className="mt-6 max-w-xl mx-auto">
            <PlanCard plan={planByKey.optimize} />
          </div>
        </div>
      </MotionDiv>

      {/* B — Need a new website: landing + multi-page */}
      <MotionDiv
        id="build"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-8 mt-20 sm:mt-28 scroll-mt-24"
      >
        <SectionHeading
          label={t("buildLabel")}
          heading={t("buildHeading")}
          sub={t("buildSub")}
        />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <PlanCard plan={planByKey.landing} badge={featuredBadge} />
          <PlanCard plan={planByKey.website} badge={featuredBadge} />
        </div>
      </MotionDiv>

      {/* C — Need a system: dynamic web app (premium, distinct block) */}
      <MotionDiv
        id="app"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-8 mt-20 sm:mt-28 scroll-mt-24"
      >
        <SectionHeading
          label={t("appLabel")}
          heading={t("appHeading")}
          sub={t("appSub")}
        />
        <div className="mt-10 sm:mt-12">
          <ThreeDCard>
            <Card className="p-6 sm:p-10 bg-secondary ring-1 ring-border">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                <div className="flex flex-col">
                  <h3 className="text-3xl font-serif text-foreground">
                    {planByKey.dynamic.name}
                  </h3>
                  <p className="text-muted mt-3 leading-relaxed">
                    {planByKey.dynamic.description}
                  </p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight text-foreground">
                      {planByKey.dynamic.price}
                    </span>
                  </div>
                  <p className="text-muted text-xs sm:text-sm mt-2 leading-relaxed">
                    {planByKey.dynamic.note}
                  </p>
                  <div className="mt-8 lg:mt-auto lg:pt-8">
                    <Link href={planByKey.dynamic.href}>
                      <Button
                        variant="primary"
                        size="lg"
                        className="font-medium w-full sm:w-auto"
                      >
                        {planByKey.dynamic.buttonText}
                      </Button>
                    </Link>
                  </div>
                </div>
                <ul className="flex flex-col gap-4">
                  {planByKey.dynamic.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check size={20} className="text-foreground shrink-0" />
                      <span className="text-sm font-medium text-foreground/80 leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </ThreeDCard>
        </div>
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

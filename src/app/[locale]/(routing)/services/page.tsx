import { use } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import {
  Bug,
  ChevronRight,
  CloudUpload,
  Database,
  Gauge,
  GraduationCap,
  Layers,
  LayoutTemplate,
  PenTool,
  PencilLine,
  Puzzle,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Guarantees from "@/components/Guarantees";
import Questions from "@/components/services/Questions";
import PlanCard, { type Plan } from "@/components/services/PlanCard";
import Aura from "@/components/ui/Aura";
import IconBadge from "@/components/ui/IconBadge";
import Reveal from "@/components/ui/Reveal";
import HeroScrollFx from "@/components/ui/scroll/HeroScrollFx";
import ScrollStep from "@/components/ui/scroll/ScrollStep";
import SectionHeader from "@/components/ui/SectionHeader";
import { toneCycle, type Tone } from "@/components/ui/tones";
import { Link } from "@/i18n/navigation";
import { buildAlternates, ogLocaleFields } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

// Package keys, in display order. Also used to emit the JSON-LD Offer graph.
const planKeys = ["landing", "website", "dynamic", "optimize"] as const;
// The one plan carrying the "recommended" badge.
const featuredPlan = "website";

const planStyle: Record<(typeof planKeys)[number], { icon: LucideIcon; tone: Tone }> = {
  landing: { icon: LayoutTemplate, tone: "blue" },
  website: { icon: Layers, tone: "purple" },
  dynamic: { icon: Database, tone: "green" },
  optimize: { icon: Gauge, tone: "orange" },
};

// In `services.mini` order.
const miniIcons: LucideIcon[] = [Bug, PencilLine, Gauge, CloudUpload, Puzzle, PenTool];

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

/**
 * Scroll order: what you get → why it's safe → pick a plan → small jobs →
 * how it runs → (students elsewhere) → questions → start. The coursework
 * packages moved to /services/students; they speak to a different visitor
 * and were diluting this page for the shop owner it is written for.
 */
export default function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("services");

  const plans = planKeys.map((key) => ({
    key,
    plan: {
      name: t(`plans.${key}.name`),
      description: t(`plans.${key}.description`),
      features: t.raw(`plans.${key}.features`) as string[],
      buttonText: t(`plans.${key}.buttonText`),
    } satisfies Plan,
  }));
  const mini = t.raw("mini") as { name: string; desc: string }[];
  const workingSteps = t.raw("workingSteps") as string[];

  const servicesUrl = buildAlternates(locale, "/services")?.canonical as string;

  // Offers carry no price: the page does not quote one, and a
  // `priceSpecification` here would put a figure into search results that the
  // page itself does not stand behind.
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Phan Hoàng Phúc",
    alternateName: "Jason Dev",
    url: "https://hwagfu.dev",
    jobTitle: "Freelance Web Developer",
    inLanguage: locale === "vi" ? "vi-VN" : "en-US",
    knowsAbout: plans.map(({ plan }) => plan.name),
    makesOffer: plans.map(({ plan }) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: plan.name,
        description: plan.description,
      },
      url: servicesUrl,
    })),
  };

  return (
    <>
      <Script
        id="services-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero — no <Reveal>: the headline is the LCP element. Lines rise in
          with CSS and HeroScrollFx eases the block back on scroll, as on the
          home page. */}
      <section className="relative isolate overflow-hidden px-5 pt-20 pb-24 sm:px-8 sm:pt-32 sm:pb-28">
        <Aura />
        <HeroScrollFx className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h1 className="headline-hero text-foreground">
            <span className="animate-rise block">{t("heroTitle")}</span>
            <span className="animate-rise block headline-quiet [animation-delay:110ms]">
              {t("heroTitleAccent")}
            </span>
          </h1>
          <p className="animate-rise lede mt-7 max-w-2xl [animation-delay:330ms]">
            {t("heroSubtitle")}
          </p>
          <div className="animate-rise mt-10 flex flex-col items-center gap-3 sm:flex-row [animation-delay:440ms]">
            <Link href="/contact" className="btn-primary">
              {t("closingCta")}
            </Link>
            <a href="#plans" className="btn-secondary">
              {t("heroPlansCta")}
            </a>
          </div>
        </HeroScrollFx>
      </section>

      <Guarantees className="bg-band" />

      {/* Plans */}
      <section id="plans" className="scroll-mt-16 px-4 py-20 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            kicker={t("plansLabel")}
            tone="purple"
            title={t("plansHeading")}
            lede={t("plansSub")}
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-5 sm:mt-16 md:grid-cols-2">
            {plans.map(({ key, plan }, index) => (
              <PlanCard
                key={key}
                plan={plan}
                icon={planStyle[key].icon}
                tone={planStyle[key].tone}
                badge={key === featuredPlan ? t("featuredBadge") : undefined}
                delay={index * 0.06}
              />
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">
            {t("plansFootnote")}
          </p>
        </div>
      </section>

      {/* Small jobs */}
      <section id="fix" className="scroll-mt-16 bg-band px-4 py-20 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            kicker={t("miniLabel")}
            tone="orange"
            title={t("miniHeading")}
            lede={t("miniSub")}
          />
          <Reveal>
            <ul className="mt-10 grid gap-x-10 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
              {mini.map((item, index) => (
                <li
                  key={item.name}
                  className="flex gap-4 border-t border-border py-5 sm:py-6"
                >
                  <IconBadge
                    icon={miniIcons[index]}
                    tone={toneCycle[index % toneCycle.length]}
                    size="sm"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                    <p className="mt-1.5 leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
          <p className="mt-10 text-center text-muted-foreground">
            {t("miniNote")}{" "}
            <Link href="/contact" className="link-more">
              {t("miniCta")}
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Link>
          </p>
        </div>
      </section>

      {/* Process — numbered because it is a real sequence. Apple's pinned
          pattern: the heading stays put while each step lights up as it
          scrolls to the middle of the screen. Pinning only from lg up; on a
          phone the list simply follows the heading. */}
      <section className="px-4 py-20 sm:px-8 sm:py-32">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeader
              align="left"
              kicker={t("processLabel")}
              tone="green"
              title={t("processHeading")}
            />
          </div>
          <ol className="space-y-10 sm:space-y-14 lg:pt-2 lg:pb-[20vh]">
            {workingSteps.map((step, index) => (
              <ScrollStep
                key={step}
                index={index + 1}
                tone={toneCycle[index % toneCycle.length]}
              >
                {step}
              </ScrollStep>
            ))}
          </ol>
        </div>
      </section>

      {/* Students — a pointer, not a section */}
      <section className="bg-band px-4 py-16 sm:px-8 sm:py-20">
        <Reveal className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-start gap-5">
            <IconBadge icon={GraduationCap} tone="pink" />
            <div>
              <h2 className="headline-card text-foreground">{t("studentTeaserHeading")}</h2>
              <p className="mt-2 max-w-xl leading-relaxed text-muted-foreground">
                {t("studentTeaserSub")}
              </p>
            </div>
          </div>
          <Link href="/services/students" className="link-more shrink-0 text-lg">
            {t("studentTeaserCta")}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </section>

      <Questions />

      {/* Closing */}
      <section className="bg-band px-4 py-20 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <SectionHeader title={t("closingHeading")} lede={t("closingNote")} />
          <Reveal className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-primary">
              {t("closingCta")}
            </Link>
            <Link href="/library/projects" className="btn-secondary">
              {t("closingCtaSecondary")}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

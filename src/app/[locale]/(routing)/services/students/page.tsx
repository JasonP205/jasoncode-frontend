import { use } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Atom, Bug, ChevronRight, Database, FileCode, IdCard, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PlanCard, { type Plan } from "@/components/services/PlanCard";
import Aura from "@/components/ui/Aura";
import Reveal from "@/components/ui/Reveal";
import HeroScrollFx from "@/components/ui/scroll/HeroScrollFx";
import SectionHeader from "@/components/ui/SectionHeader";
import type { Tone } from "@/components/ui/tones";
import { Link } from "@/i18n/navigation";
import { buildAlternates, ogLocaleFields } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

// `students.items` order: three course projects (React recommended), then the
// CV page and the bug-fix job, which get their own wider row.
const COURSE_PROJECTS = 3;
const FEATURED_INDEX = 2;

// In `students.items` order: HTML, PHP, React, CV/Portfolio, bug fixing.
const itemStyle: { icon: LucideIcon; tone: Tone }[] = [
  { icon: FileCode, tone: "orange" },
  { icon: Database, tone: "purple" },
  { icon: Atom, tone: "blue" },
  { icon: IdCard, tone: "pink" },
  { icon: Bug, tone: "green" },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const alternates = buildAlternates(locale, "/services/students");

  return {
    title: t("studentsTitle"),
    description: t("studentsDescription"),
    alternates,
    keywords: [
      "sửa lỗi coursework",
      "làm đồ án web sinh viên",
      "đồ án PHP MySQL",
      "đồ án React Node.js",
      "làm CV Portfolio sinh viên IT",
      "Jason Dev",
    ],
    openGraph: {
      title: t("studentsTitle"),
      description: t("studentsDescription"),
      url: alternates?.canonical as string,
      ...ogLocaleFields(locale),
    },
  };
}

export default function StudentsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("students");
  const badge = useTranslations("services")("featuredBadge");

  const items = t.raw("items") as Plan[];
  const courseProjects = items.slice(0, COURSE_PROJECTS);
  const extras = items.slice(COURSE_PROJECTS);

  const pageUrl = buildAlternates(locale, "/services/students")?.canonical as string;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Phan Hoàng Phúc",
    alternateName: "Jason Dev",
    url: "https://hwagfu.dev",
    inLanguage: locale === "vi" ? "vi-VN" : "en-US",
    makesOffer: items.map((item) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: item.name, description: item.description },
      url: pageUrl,
    })),
  };

  return (
    <>
      <Script
        id="students-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="relative isolate overflow-hidden px-5 pt-20 pb-24 sm:px-8 sm:pt-32 sm:pb-28">
        <Aura />
        <HeroScrollFx className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <p className="animate-rise kicker mb-3 text-hue-pink">{t("label")}</p>
          <h1 className="headline-hero text-foreground">
            <span className="animate-rise block [animation-delay:80ms]">{t("heading")}</span>
            <span className="animate-rise block headline-quiet [animation-delay:190ms]">
              {t("headingAccent")}
            </span>
          </h1>
          <p className="animate-rise lede mt-7 max-w-2xl [animation-delay:410ms]">{t("sub")}</p>
          <div className="animate-rise mt-10 flex flex-col items-center gap-5 sm:flex-row [animation-delay:520ms]">
            <Link href="/contact" className="btn-primary">
              {t("cta")}
            </Link>
            <Link href="/services" className="link-more">
              {t("backToServices")}
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </HeroScrollFx>
      </section>

      <section className="bg-band px-4 py-20 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <SectionHeader title={t("plansHeading")} lede={t("plansSub")} />
          <div className="mt-10 grid gap-5 sm:mt-16 lg:grid-cols-3">
            {courseProjects.map((plan, index) => (
              <PlanCard
                key={plan.name}
                plan={plan}
                icon={itemStyle[index].icon}
                tone={itemStyle[index].tone}
                surface="tile"
                badge={index === FEATURED_INDEX ? badge : undefined}
                delay={index * 0.06}
              />
            ))}
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {extras.map((plan, index) => (
              <PlanCard
                key={plan.name}
                plan={plan}
                icon={itemStyle[COURSE_PROJECTS + index].icon}
                tone={itemStyle[COURSE_PROJECTS + index].tone}
                surface="tile"
                delay={index * 0.06}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <SectionHeader title={t("closingHeading")} lede={t("closingSub")} />
          <Reveal className="mt-10 flex justify-center">
            <Link href="/contact" className="btn-primary">
              {t("cta")}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

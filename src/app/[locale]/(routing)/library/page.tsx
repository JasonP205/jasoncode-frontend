import { use } from "react";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { Link } from "@/i18n/navigation";
import { buildAlternates, ogLocaleFields } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const alternates = buildAlternates(locale, "/library");

  return {
    title: t("libraryTitle"),
    description: t("libraryDescription"),
    alternates,
    openGraph: {
      title: t("libraryTitle"),
      description: t("libraryDescription"),
      url: alternates?.canonical as string,
      ...ogLocaleFields(locale),
    },
  };
}

export default function LibraryIndexPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("library");

  const cards = [
    {
      href: "/library/projects",
      label: t("projectsHeading"),
      tone: "text-hue-blue",
      title: t("projectsCardTitle"),
      desc: t("projectsCardDesc"),
      cta: t("projectsCardCta"),
    },
    {
      href: "/library/components",
      label: t("componentsHeading"),
      tone: "text-hue-purple",
      title: t("componentsCardTitle"),
      desc: t("componentsCardDesc"),
      cta: t("componentsCardCta"),
    },
  ];

  return (
    <section className="px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader as="h1" title={t("title")} lede={t("subtitle")} />

        <ul className="mt-14 grid gap-5 sm:mt-16 md:grid-cols-2">
          {cards.map((card, index) => (
            <li key={card.href}>
              <Reveal variant="zoom" delay={index * 0.08} className="h-full">
                <Link
                  href={card.href}
                  className="group flex h-full flex-col rounded-[1.75rem] bg-band p-8 transition-shadow hover:shadow-[0_12px_40px_-12px_rgb(0_0_0/0.18)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground sm:p-10"
                >
                  <p className={`kicker ${card.tone}`}>{card.label}</p>
                  <h2 className="headline-card mt-2 text-foreground">{card.title}</h2>
                  <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">{card.desc}</p>
                  <span className="link-more mt-8">
                    {card.cta}
                    <ChevronRight className="size-4" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

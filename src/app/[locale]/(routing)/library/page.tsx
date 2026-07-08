import { use } from "react";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import MotionDiv from "@/components/ui/motionDiv";
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

  return (
    <div className="w-full relative py-16 sm:py-24">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-4 sm:px-8 text-center flex flex-col items-center"
      >
        <h1 className="text-4xl sm:text-6xl font-serif text-foreground leading-snug tracking-tight text-balance">
          {t("title")}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-muted max-w-2xl mt-6 leading-relaxed">
          {t("subtitle")}
        </p>
      </MotionDiv>

      {/* Part 1 — Projects: a single card into the full list */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 mt-12 sm:mt-16">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link
            href="/library/projects"
            className="group flex flex-col gap-4 rounded-2xl border border-border p-6 sm:p-8 transition-colors hover:border-foreground/40 hover:bg-secondary/30 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <span className="text-xs uppercase tracking-[0.24em] text-muted">
                {t("projectsHeading")}
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-serif text-foreground">
                {t("projectsCardTitle")}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted leading-relaxed max-w-xl">
                {t("projectsCardDesc")}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground">
              {t("projectsCardCta")}
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        </MotionDiv>
      </section>

      {/* Part 2 — Component Library: a single card into the full list */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 mt-6 sm:mt-8">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/library/components"
            className="group flex flex-col gap-4 rounded-2xl border border-border p-6 sm:p-8 transition-colors hover:border-foreground/40 hover:bg-secondary/30 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <span className="text-xs uppercase tracking-[0.24em] text-muted">
                {t("componentsHeading")}
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-serif text-foreground">
                {t("componentsCardTitle")}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted leading-relaxed max-w-xl">
                {t("componentsCardDesc")}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground">
              {t("componentsCardCta")}
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        </MotionDiv>
      </section>
    </div>
  );
}

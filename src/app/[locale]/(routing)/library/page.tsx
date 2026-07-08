import { use } from "react";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Chip } from "@heroui/react";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import MotionDiv from "@/components/ui/motionDiv";
import { Link } from "@/i18n/navigation";
import { buildAlternates, ogLocaleFields } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { libraries, localize } from "@/data/libraries";

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

      {/* Part 2 — Component Library */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <h2 className="text-4xl sm:text-5xl font-serif text-foreground mb-4 sm:mb-6">
            {t("componentsHeading")}
          </h2>
          <p className="text-muted text-base sm:text-lg leading-relaxed">
            {t("componentsSubtitle")}
          </p>
        </MotionDiv>

        <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {libraries.map((lib, index) => (
            <MotionDiv
              key={lib.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <Link
                href={`/library/${lib.slug}`}
                className="group flex flex-col h-full rounded-2xl border border-border p-6 transition-colors hover:border-foreground/40 hover:bg-secondary/30"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="size-3 rounded-full shrink-0"
                    style={{ backgroundColor: lib.accent }}
                  />
                  <span className="font-mono text-sm text-foreground truncate">
                    {lib.pkg}
                  </span>
                  <Chip
                    size="sm"
                    className="ml-auto bg-secondary text-muted border-none shrink-0"
                  >
                    v{lib.version}
                  </Chip>
                </div>

                <p className="text-sm text-muted mt-4 leading-relaxed flex-1">
                  {localize(lib.tagline, locale)}
                </p>

                <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-foreground">
                  {t("viewGuide")}
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </MotionDiv>
          ))}
        </div>
      </section>
    </div>
  );
}

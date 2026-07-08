import { use } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { Chip } from "@heroui/react";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ComponentType } from "react";
import MotionDiv from "@/components/ui/motionDiv";
import CodeBlock from "@/components/library/CodeBlock";
import LinkPlayground from "@/components/library/playground/LinkPlayground";
import CursorPlayground from "@/components/library/playground/CursorPlayground";
import ImagesPlayground from "@/components/library/playground/ImagesPlayground";
import UrlPreviewPlayground from "@/components/library/playground/UrlPreviewPlayground"
import { Link } from "@/i18n/navigation";
import { buildAlternates, ogLocaleFields } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { getLibrary, libraries, localize } from "@/data/libraries";

const playgrounds: Record<string, ComponentType> = {
  "hwagfu-link": LinkPlayground,
  "hwagfu-cursor": CursorPlayground,
  "hwagfu-images": ImagesPlayground,
  "hwagfu-url-preview": UrlPreviewPlayground,
};

export function generateStaticParams() {
  return libraries.map((lib) => ({ libraryName: lib.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; libraryName: string }>;
}): Promise<Metadata> {
  const { locale, libraryName } = await params;
  const lib = getLibrary(libraryName);

  if (!lib) {
    const t = await getTranslations({ locale, namespace: "library" });
    return {
      title: t("notFoundTitle"),
      description: t("notFoundDescription"),
    };
  }

  const alternates = buildAlternates(locale, `/library/${lib.slug}`);
  const description = localize(lib.description, locale);

  return {
    title: `${lib.pkg} — ${localize(lib.tagline, locale)}`,
    description,
    keywords: [lib.pkg, lib.slug, "React", "component", "Jason Dev"],
    alternates,
    openGraph: {
      title: `${lib.pkg} | Jason Libs`,
      description,
      url: alternates?.canonical as string,
      ...ogLocaleFields(locale),
    },
  };
}

export default function LibraryDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; libraryName: string }>;
}) {
  const { locale, libraryName } = use(params);
  setRequestLocale(locale);

  const lib = getLibrary(libraryName);
  if (!lib) notFound();

  const t = useTranslations("library");
  const Demo = playgrounds[lib.slug];

  return (
    <div className="w-full relative py-8 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <MotionDiv
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link
            href="/library"
            className="group inline-flex items-center text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            {t("back")}
          </Link>
        </MotionDiv>

        {/* Header */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <span
              className="size-3 rounded-full"
              style={{ backgroundColor: lib.accent }}
            />
            <Chip
              size="sm"
              className="bg-secondary text-muted border-none"
            >
              v{lib.version}
            </Chip>
          </div>
          <h1 className="mt-4 font-mono text-3xl sm:text-5xl font-semibold text-foreground wrap-break-word">
            {lib.pkg}
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-muted leading-relaxed">
            {localize(lib.tagline, locale)}
          </p>
          <p className="mt-4 text-sm sm:text-base text-foreground/80 leading-relaxed max-w-2xl">
            {localize(lib.description, locale)}
          </p>
        </MotionDiv>

        {/* Playground (illustration + live controls) */}
        {Demo && (
          <section className="mt-14">
            <div className="flex flex-col gap-1 mb-5">
              <h2 className="text-2xl sm:text-3xl font-serif text-foreground">
                {t("playgroundLabel")}
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                {t("playgroundHint")}
              </p>
            </div>
            <Demo />
          </section>
        )}

        {/* Install */}
        <section className="mt-14">
          <h2 className="text-xs uppercase tracking-[0.24em] text-muted mb-4">
            {t("installLabel")}
          </h2>
          <div className="flex flex-col gap-3">
            <CodeBlock code={lib.install} lang="bash" />
            <CodeBlock code={lib.importLine} lang="tsx" />
          </div>
        </section>

        {/* Features */}
        <section className="mt-14">
          <h2 className="text-xs uppercase tracking-[0.24em] text-muted mb-4">
            {t("featuresLabel")}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {localize(lib.features, locale).map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 rounded-2xl border border-border p-4"
              >
                <Check className="size-5 shrink-0 text-foreground mt-0.5" />
                <span className="text-sm text-foreground/80 leading-relaxed">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Usage */}
        <section className="mt-14">
          <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-6">
            {t("usageLabel")}
          </h2>
          <div className="flex flex-col gap-8">
            {lib.examples.map((example) => (
              <div key={example.title.en}>
                <h3 className="text-sm font-medium text-foreground mb-3">
                  {localize(example.title, locale)}
                </h3>
                <CodeBlock code={example.code} lang={example.lang} />
              </div>
            ))}
          </div>
        </section>

        {/* Props */}
        <section className="mt-14">
          <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-6">
            {t("propsLabel")}
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="p-3 font-medium text-muted whitespace-nowrap">
                    {t("propName")}
                  </th>
                  <th className="p-3 font-medium text-muted whitespace-nowrap">
                    {t("propType")}
                  </th>
                  <th className="p-3 font-medium text-muted whitespace-nowrap">
                    {t("propDefault")}
                  </th>
                  <th className="p-3 font-medium text-muted min-w-[16rem]">
                    {t("propDesc")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {lib.props.map((prop) => (
                  <tr
                    key={prop.name}
                    className="border-b border-border last:border-0 align-top"
                  >
                    <td className="p-3 font-mono text-foreground whitespace-nowrap">
                      {prop.name}
                    </td>
                    <td className="p-3 font-mono text-xs text-foreground/70">
                      {prop.type}
                    </td>
                    <td className="p-3 font-mono text-xs text-muted whitespace-nowrap">
                      {prop.default ?? "—"}
                    </td>
                    <td className="p-3 text-foreground/80 leading-relaxed">
                      {localize(prop.desc, locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Notes */}
        {lib.notes && (
          <section className="mt-14">
            <h2 className="text-xs uppercase tracking-[0.24em] text-muted mb-4">
              {t("notesLabel")}
            </h2>
            <ul className="flex flex-col gap-3">
              {localize(lib.notes, locale).map((note) => (
                <li
                  key={note}
                  className="rounded-2xl border border-border bg-secondary/40 p-4 text-sm text-foreground/80 leading-relaxed"
                >
                  {note}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

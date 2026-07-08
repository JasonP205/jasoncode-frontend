import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ProjectList from "@/components/ProjectList";
import { buildAlternates, ogLocaleFields } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const alternates = buildAlternates(locale, "/library/projects");

  return {
    title: t("projectsTitle"),
    description: t("projectsDescription"),
    alternates,
    keywords: [
      "Dự án web",
      "Portfolio dự án",
      "Thiết kế web",
      "Phát triển web",
      "Jason Dev projects",
      "Phan Hoàng Phúc projects",
    ],
    openGraph: {
      title: `${t("projectsTitle")} | Jason Dev`,
      description: t("projectsDescription"),
      url: alternates?.canonical as string,
      ...ogLocaleFields(locale),
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProjectList />;
}

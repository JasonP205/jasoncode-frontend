import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import CvViewer from "@/components/CvViewer";
import { buildAlternates, ogLocaleFields } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const alternates = buildAlternates(locale, "/cv");

  return {
    title: t("cvTitle"),
    description: t("cvDescription"),
    alternates,
    keywords: [
      "CV Phan Hoàng Phúc",
      "CV Jason Dev",
      "Hồ sơ web developer",
      "Tải CV lập trình viên",
      "Freelance web developer CV",
    ],
    openGraph: {
      title: `${t("cvTitle")} | Jason Dev`,
      description: t("cvDescription"),
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
  return <CvViewer />;
}

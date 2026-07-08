import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Contact from "@/components/Contact";
import { buildAlternates, ogLocaleFields } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const alternates = buildAlternates(locale, "/contact");

  return {
    title: t("contactTitle"),
    description: t("contactDescription"),
    alternates,
    keywords: [
      "Liên hệ Jason Dev",
      "Thuê lập trình viên web",
      "Liên hệ Phan Hoàng Phúc",
      "Tư vấn thiết kế web",
      "Tư vấn SEO",
    ],
    openGraph: {
      title: `${t("contactTitle")} | Jason Dev`,
      description: t("contactDescription"),
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
  const t = await getTranslations({ locale, namespace: "metadata" });
  return (
    <>
      {/* Page-level H1: Contact is shared with the homepage (where Hero owns the
          H1), so we expose the heading here without altering the shared layout. */}
      <h1 className="sr-only">{t("contactTitle")}</h1>
      <Contact />
    </>
  );
}

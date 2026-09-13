import { Link } from "@/i18n/navigation";
import Jot from "@/components/ui/Jot";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildAlternates, ogLocaleFields } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const alternates = buildAlternates(locale, "/utils");

  return {
    title: t("utilsTitle"),
    description: t("utilsDescription"),
    alternates,
    // Nothing to use here yet — keep it out of the index until there is.
    robots: { index: false, follow: true },
    keywords: [
      "Tiện ích web",
      "Công cụ trực tuyến",
      "Jason Dev utils",
      "Phan Hoàng Phúc utils",
    ],
    openGraph: {
      title: `${t("utilsTitle")} | Jason Dev`,
      description: t("utilsDescription"),
      url: alternates?.canonical as string,
      ...ogLocaleFields(locale),
    },
  };
}

const UtilsPage = async ({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("utils");
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-5 py-24 text-center">
      <Jot mood="thinking" className="mb-8 size-36" />
      <p className="kicker mb-3 text-hue-orange">{t("badge")}</p>
      <h1 className="headline-hero text-foreground">{t("heading")}</h1>
      <p className="lede mt-6 max-w-xl">{t("description")}</p>
      {/* No countdown: its 2026-09-02 target passed and it sat at 00:00:00:00
          under a "coming soon" badge. Only add one back with a date you will
          keep. */}
      <Link href="/" className="btn-primary mt-10">
        {t("backHome")}
      </Link>
    </section>
  );
};

export default UtilsPage;

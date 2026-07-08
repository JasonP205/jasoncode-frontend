import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ComingSoon from "@/components/ui/ComingSoon";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "comingSoon" });

  return {
    title: t("signUpTitle"),
    alternates: buildAlternates(locale, "/sign-up"),
    // Placeholder page — keep it out of the index but let links be followed.
    robots: { index: false, follow: true },
  };
}

const page = async () => {
  const t = await getTranslations("comingSoon");
  return (
    <main className="min-h-[100dvh] pt-24 pb-16 bg-secondary flex items-center justify-center">
      <ComingSoon title={t("signUpTitle")} />
    </main>
  );
};

export default page;

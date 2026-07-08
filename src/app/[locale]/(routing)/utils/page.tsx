import MotionDiv from "@/components/ui/motionDiv";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { Button } from "@heroui/react";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Clock } from "lucide-react";
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
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center py-10">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8 flex flex-col items-center max-w-3xl mx-auto"
      >
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-4">
          <Clock className="w-10 h-10" />
        </div>

        <div className="inline-block px-4 py-1.5 bg-default-100 dark:bg-default-50 border border-default-200 text-default-600 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
          {t("badge")}
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-tight">
          {t("heading")}
        </h1>

        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
          {t("description")}
        </p>

        {/* Countdown Timer Component Target Date: 2026-09-02 */}
        <CountdownTimer targetDate="2026-09-02T00:00:00" />

        <div className="pt-8 flex gap-4 flex-col">
          <Button
            className="font-bold px-8 rounded-full group/home-btn"
            size="lg"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4 group-hover/home-btn:-translate-x-1 transition-transform" />
              {t("backHome")}
            </Link>
          </Button>
          {/* <Link href="/utils/games" className="flex items-center gap-2 hover:underline-offset-2 hover:underline text-base text-muted transition">
            Truy cập tính năng thử nghiệm
          </Link> */}
        </div>
      </MotionDiv>
    </div>
  );
};

export default UtilsPage;

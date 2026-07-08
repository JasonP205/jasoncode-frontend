import { getTranslations } from "next-intl/server";
import ComingSoon from "@/components/ui/ComingSoon";

const page = async () => {
  const t = await getTranslations("comingSoon");
  return (
    <main className="min-h-[100dvh] pt-24 pb-16 bg-secondary flex items-center justify-center">
      <ComingSoon title={t("signUpTitle")} />
    </main>
  );
};

export default page;

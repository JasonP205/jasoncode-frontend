import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BackButton } from "./BackButton";
import Jot from "./Jot";

interface ComingSoonProps {
  title?: string;
  description?: string;
}

/** Placeholder for a page that exists in the router but not yet in the product. */
const ComingSoon = ({ title, description }: ComingSoonProps) => {
  const t = useTranslations("comingSoon");
  const nav = useTranslations("notFound");

  return (
    <section className="flex min-h-[60vh] w-full flex-col items-center justify-center px-5 py-24 text-center">
      {/* Still being built: Jot is thinking it over. */}
      <Jot mood="thinking" className="mb-8 size-36" />
      <h1 className="headline-section text-foreground">{title ?? t("defaultTitle")}</h1>
      <p className="lede mt-5 max-w-xl">{description ?? t("defaultDescription")}</p>
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
        <Link href="/" className="btn-primary">
          {nav("home")}
        </Link>
        <BackButton fallbackHref="/" className="btn-secondary text-base text-foreground">
          {t("back")}
        </BackButton>
      </div>
    </section>
  );
};

export default ComingSoon;

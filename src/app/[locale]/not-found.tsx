"use client";

// Client component on purpose: a not-found boundary gets no `params`, so a
// server-side `useTranslations` would read the locale from request headers
// and force the whole segment to render dynamically.
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BackButton } from "@/components/ui/BackButton";
import Jot from "@/components/ui/Jot";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-5 py-24 text-center">
      {/* Jot has lost its full stop — the 404 in one picture. */}
      <Jot mood="lost" className="mb-6 size-40 sm:size-48" />
      <p className="kicker mb-3 tabular-nums text-hue-pink">404</p>
      <h1 className="headline-hero text-foreground">{t("heading")}</h1>
      <p className="lede mt-6 max-w-xl">{t("description")}</p>
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
        <Link href="/" className="btn-primary">
          {t("home")}
        </Link>
        <BackButton fallbackHref="/" className="btn-secondary text-base text-foreground">
          {t("back")}
        </BackButton>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";

export const SITE_URL = "https://hwagfu.dev";

const ogLocale: Record<Locale, string> = {
  vi: "vi_VN",
  en: "en_US",
};

/**
 * Build `alternates` (canonical + hreflang languages incl. x-default) for a
 * locale-agnostic path such as "/" or "/services". Vietnamese has no prefix,
 * English is under /en — resolved via next-intl's `getPathname`.
 */
export function buildAlternates(
  locale: Locale,
  pathname: string,
): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = SITE_URL + getPathname({ locale: l, href: pathname });
  }
  languages["x-default"] =
    SITE_URL + getPathname({ locale: routing.defaultLocale, href: pathname });

  return {
    canonical: SITE_URL + getPathname({ locale, href: pathname }),
    languages,
  };
}

/** OpenGraph locale + alternates for a given locale. */
export function ogLocaleFields(locale: Locale) {
  return {
    locale: ogLocale[locale],
    alternateLocale: routing.locales
      .filter((l) => l !== locale)
      .map((l) => ogLocale[l]),
  };
}

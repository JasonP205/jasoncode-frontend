import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Vietnamese is the default and is served without a prefix (hwagfu.dev/...).
  // English is served under /en (hwagfu.dev/en/...).
  locales: ["vi", "en"],
  defaultLocale: "vi",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

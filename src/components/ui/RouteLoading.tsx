"use client";

// Client component so the label comes from NextIntlClientProvider: a server
// `useTranslations` in a loading boundary gets no params and would make the
// route render dynamically.
import { useTranslations } from "next-intl";
import Jot from "./Jot";

/**
 * Route-level loading: Jot thinks while its dot bounces.
 *
 * Only add a `loading.tsx` that renders this to segments with no dynamic
 * child that calls `notFound()`. A loading boundary makes those responses
 * stream, and a streamed `notFound()` is served with a 200 instead of a 404.
 * That rules out the `[locale]` root (the `[...rest]` catch-all) and
 * `library/projects` (unknown project ids).
 */
export default function RouteLoading() {
  const t = useTranslations("common");
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-5"
    >
      <Jot mood="thinking" className="size-28" />
      <p className="text-sm font-medium text-muted-foreground">{t("loading")}</p>
    </div>
  );
}

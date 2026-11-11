import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import { getProjectById } from "@/services/projects.service";
import { libraries } from "@/data/libraries";
import { renderOg } from "./render";

/** Pages with their own card, and which stone colour each one lights. */
const TONE = { home: 0, projects: 2, cv: 1, services: 3, students: 3, library: 4, utils: 5, contact: 5 } as const;
export type OgPage = keyof typeof TONE;

const safe = (locale: string): Locale => (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale);

export const localeParams = () => routing.locales.map((locale) => ({ locale }));

/** The card for a static page, copy from `og.<page>`. */
export async function pageOg(params: Promise<{ locale: string }>, page: OgPage) {
  const locale = safe((await params).locale);
  const t = await getTranslations({ locale, namespace: `og.${page}` });
  return renderOg({
    eyebrow: t("eyebrow"),
    title: t("title"),
    accent: t("accent"),
    subtitle: t("subtitle"),
    tone: TONE[page],
  });
}

/** A project's card: its title and tagline over its first screenshot. */
export async function projectOg(params: Promise<{ locale: string; projectId: string }>) {
  const { locale: raw, projectId } = await params;
  const locale = safe(raw);
  const project = getProjectById(projectId, locale);
  if (!project) return pageOg(Promise.resolve({ locale }), "projects");
  const t = await getTranslations({ locale, namespace: "og.project" });
  return renderOg({
    eyebrow: t("eyebrow"),
    title: "",
    accent: project.title,
    subtitle: project.tagline,
    tone: 2,
    image: project.image[0]?.src,
  });
}

/** A library's card: its package name and tagline. */
export async function libraryOg(params: Promise<{ locale: string; libraryName: string }>) {
  const { locale: raw, libraryName } = await params;
  const locale = safe(raw);
  const lib = libraries.find((l) => l.slug === libraryName);
  if (!lib) return pageOg(Promise.resolve({ locale }), "library");
  const t = await getTranslations({ locale, namespace: "og.library" });
  return renderOg({
    eyebrow: `${t("eyebrow")} · v${lib.version}`,
    title: "",
    accent: lib.pkg,
    subtitle: lib.tagline[locale],
    tone: 4,
  });
}

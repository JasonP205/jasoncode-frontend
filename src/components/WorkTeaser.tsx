import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getAllProjects } from "@/services/projects.service";
import WorkStory, { type FeaturedProject } from "./ui/scroll/WorkStory";

/**
 * Server wrapper for the home page's work film: resolves the three featured
 * projects and the copy, and hands the scroll timeline to the client.
 * `/library/projects` keeps the plain `ProjectList` grid.
 */
export default async function WorkTeaser() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("projectList");
  const projects: FeaturedProject[] = getAllProjects(locale)
    .slice(0, 3)
    .map((project) => ({
      id: project.id,
      title: project.title,
      tagline: project.tagline,
      image: project.image[0],
    }));

  return (
    <WorkStory
      label={t("label")}
      heading={t("heading")}
      subtitle={t("subtitle")}
      viewAll={t("viewAll")}
      projects={projects}
    />
  );
}

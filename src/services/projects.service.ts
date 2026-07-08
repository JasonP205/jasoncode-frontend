import { projects, localizeProject } from "@/data/projects";
import type { Locale } from "@/i18n/routing";
import { delay } from "@/lib/utils";

export async function getAllProjects(locale: Locale) {
  await delay(100);
  return projects.map((p) => localizeProject(p, locale));
}

export async function getProjectById(projectId: string, locale: Locale) {
  await delay(100);
  const project = projects.find((p) => p.id === projectId);
  return project ? localizeProject(project, locale) : null;
}

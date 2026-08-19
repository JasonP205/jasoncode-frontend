import { localizeProject, projects, type Project } from "@/data/projects";
import type { Locale } from "@/i18n/routing";

/**
 * Accessors over `src/data/projects.ts`. There is no I/O here: the content is
 * part of this repo, so every page that reads it prerenders statically.
 */

export function getProjects(): Project[] {
  return projects;
}

export function getAllProjects(locale: Locale) {
  return projects.map((project) => localizeProject(project, locale));
}

export function getProjectById(projectId: string, locale: Locale) {
  const project = projects.find((p) => p.id === projectId);
  return project ? localizeProject(project, locale) : null;
}

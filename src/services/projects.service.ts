import {projects} from "@/data/projects";
import {delay} from "@/lib/utils";

export async function getAllProjects() {
  await delay(1000);
  return projects;
}

export async function getProjectById(projectId: string) {
  await delay(1000);
  const project = projects.find(p => p.id === projectId) ?? null;
  return project;
}
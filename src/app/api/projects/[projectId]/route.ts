import {projects} from "@/data/projects";
import {delay} from "@/lib/utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
    await delay(1000);
  const project = projects.find(p => p.id === projectId);
  if (!project) {
    return Response.json({ error: "Project not found" }, { status: 404 });
  }
  return Response.json(project);
}
import { projectOg } from "@/lib/og/page-image";
import { routing } from "@/i18n/routing";
import { getProjects } from "@/services/projects.service";

// Generated Twitter card: the project's title and tagline over its first
// screenshot (see src/lib/og/render.tsx).
export const alt = "Jason Dev – project demo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getProjects().map((p) => ({ locale, projectId: p.id })));
}

export default function Image({ params }: { params: Promise<{ locale: string; projectId: string }> }) {
  return projectOg(params);
}

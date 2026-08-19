import { MetadataRoute } from "next";
import { getProjects } from "@/services/projects.service";
import { libraries } from "@/data/libraries";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { SITE_URL } from "@/lib/seo";

type RouteDef = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const staticRoutes: RouteDef[] = [
  { path: "/", changeFrequency: "yearly", priority: 1 },
  { path: "/library", changeFrequency: "monthly", priority: 0.7 },
  { path: "/library/projects", changeFrequency: "monthly", priority: 0.8 },
  { path: "/library/components", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.8 },
  { path: "/utils", changeFrequency: "yearly", priority: 0.5 },
];

function languagesFor(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = SITE_URL + getPathname({ locale, href: path });
  }
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getProjects();

  const routes: RouteDef[] = [
    ...staticRoutes,
    ...projects.map((project) => ({
      path: `/library/projects/${project.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...libraries.map((lib) => ({
      path: `/library/${lib.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  // Emit one entry per locale, each carrying the full hreflang alternate set.
  return routes.flatMap(({ path, changeFrequency, priority }) => {
    const languages = languagesFor(path);
    return routing.locales.map((locale) => ({
      url: SITE_URL + getPathname({ locale, href: path }),
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
}

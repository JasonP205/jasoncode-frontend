import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink, Code2 } from "lucide-react";
import { Chip, Button } from "@heroui/react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import MotionDiv from "@/components/ui/motionDiv";
import { getProjectById, getProjects } from "@/services/projects.service";
import type { LocalizedProject } from "@/data/projects";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { buildAlternates, ogLocaleFields } from "@/lib/seo";
import ProjectGallery from "@/components/ui/ProjectGallery";
import Dialog from "@/components/ui/AlertDialog"

/**
 * The project list is local data, so every detail page can be prerendered.
 * The parent `[locale]` layout already generates the locales and Next calls
 * this once per locale, so it returns only this segment — returning `locale`
 * here as well left the route unprerendered (ƒ) in the build.
 */
export function generateStaticParams() {
  return getProjects().map((project) => ({ projectId: project.id }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale; projectId: string }>;
}): Promise<Metadata> {
  const { locale, projectId } = await props.params;

  const project = getProjectById(projectId, locale);

  if (!project) {
    const t = await getTranslations({ locale, namespace: "projectDetail" });
    return {
      title: t("notFoundTitle"),
      description: t("notFoundDescription"),
    };
  }

  const alternates = buildAlternates(locale, `/library/projects/${projectId}`);

  return {
    title: project.title,
    description: project.description,
    keywords: project.tags || ["dự án web", "thiết kế web", "Jason Dev"],
    alternates,
    openGraph: {
      title: `${project.title} | Jason Dev`,
      description: project.description,
      url: alternates?.canonical as string,
      images: project.image[0].src
        ? [{ url: project.image[0].src, alt: project.title }]
        : undefined,
      ...ogLocaleFields(locale),
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: project.image[0].src ? [project.image[0].src] : undefined,
    },
  };
}

async function ProjectContent({ project }: { project: LocalizedProject }) {
  const t = await getTranslations("projectDetail");

  return (
    <article>
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="headline-hero mb-6 text-foreground">
          {project.title}
        </h1>

        <p className="lede mb-6 max-w-3xl">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-10">
          {project.tags?.map((tag: string) => (
            <Chip
              key={tag}
              size="sm"
              className="bg-band text-foreground border-none"
            >
              {tag}
            </Chip>
          ))}
        </div>
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-14 w-full"
      >
        {project.image.length > 0 ? (
          <ProjectGallery shots={project.image} />
        ) : (
          <div className="flex aspect-16/10 w-full items-center justify-center rounded-2xl bg-foreground/4 text-muted-foreground ring-1 ring-border/70">
            <Code2 className="h-16 w-16 opacity-30" />
          </div>
        )}
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-12"
      >
        <div className="md:col-span-2 text-foreground/80 text-lg leading-loose max-w-none">
          <p className="whitespace-pre-line">{project.fullDescription}</p>
        </div>

        <div className="md:col-span-1">
          {project.liveUrl && (
            <div className="sticky top-32">
              <h2 className="kicker mb-4 text-hue-blue">
                {t("websiteLabel")}
              </h2>

              {project.isDone ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full sm:w-auto"
                >
                  {t("visit")}
                  <ExternalLink className="w-4 h-4" aria-hidden />
                </a>
              ) : (
                <Dialog type="info" acceptText={t("deployingAccept")} title={t("deployingTitle")} message={t("deployingMessage")}>
                  <Button
                    className="w-full sm:w-auto font-medium bg-action text-white hover:bg-[var(--action-hover)] rounded-full px-6"
                    size="lg"
                  >
                    {t("visit")}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Dialog>
              )}
            </div>
          )}
        </div>
      </MotionDiv>
    </article>
  );
}

export default async function Page(props: {
  params: Promise<{ locale: Locale; projectId: string }>;
}) {
  const { locale, projectId } = await props.params;
  // Without this, next-intl reads the locale from request headers and the
  // route silently falls back to dynamic rendering despite generateStaticParams.
  setRequestLocale(locale);
  const t = await getTranslations("projectDetail");

  // Resolved up front, with no <Suspense> around the content: the data is a
  // local file, so there is nothing to stream. The old boundary also meant
  // `notFound()` fired after streaming began (a 200 soft 404) and kept the
  // route from prerendering.
  const project = getProjectById(projectId, locale);
  if (!project) {
    notFound();
  }

  return (
    // A <div>, not <main>: the root layout already provides the page's <main>.
    <div className="min-h-screen py-16 sm:py-20 flex justify-center">
      <div className="max-w-6xl w-full px-4 sm:px-6 lg:px-8">
        <MotionDiv
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/library/projects"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group/back hover:underline decoration-1 underline-offset-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover/back:-translate-x-1 transition-transform duration-200" />
            {t("back")}
          </Link>
        </MotionDiv>

        <ProjectContent project={project} />
      </div>
    </div>
  );
}

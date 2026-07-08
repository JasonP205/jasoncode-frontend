import React, { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink, Code2 } from "lucide-react";
import { Chip, Button, Skeleton } from "@heroui/react";
import { getTranslations } from "next-intl/server";
import MotionDiv from "@/components/ui/motionDiv";
import { getProjectById } from "@/services/projects.service";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { buildAlternates, ogLocaleFields } from "@/lib/seo";
import { MultipleImage } from "@hwagfu/images";
import Dialog from "@/components/ui/AlertDialog"

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale; projectId: string }>;
}): Promise<Metadata> {
  const { locale, projectId } = await props.params;

  const project = await getProjectById(projectId, locale);

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

function ProjectSkeleton() {
  return (
    <div className="w-full">
      {/* Header Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-12 md:h-16 w-3/4 mb-6 rounded-lg before:duration-1000!" />
        <Skeleton className="h-6 md:h-7 w-full max-w-3xl mb-2 rounded-lg before:duration-1000!" />
        <Skeleton className="h-6 md:h-7 w-5/6 max-w-3xl mb-6 rounded-lg before:duration-1000!" />
        <div className="flex flex-wrap gap-2 mb-10">
          <Skeleton className="h-7 w-20 rounded-full before:duration-1000!" />
          <Skeleton className="h-7 w-24 rounded-full before:duration-1000!" />
          <Skeleton className="h-7 w-16 rounded-full before:duration-1000!" />
        </div>
      </div>

      <Skeleton className="w-full aspect-video rounded-2xl mb-12 shadow-sm before:duration-1000!" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-5 w-full rounded-md before:duration-1000!" />
          <Skeleton className="h-5 w-full rounded-md before:duration-1000!" />
          <Skeleton className="h-5 w-11/12 rounded-md before:duration-1000!" />
          <Skeleton className="h-5 w-4/5 rounded-md before:duration-1000!" />
        </div>

        <div className="md:col-span-1">
          <div className="sticky top-32">
            <Skeleton className="h-5 w-32 mb-4 rounded-md before:duration-1000!" />
            <Skeleton className="h-12 w-full sm:w-40 rounded-full before:duration-1000!" />
          </div>
        </div>
      </div>
    </div>
  );
}

async function ProjectContent({
  projectId,
  locale,
}: {
  projectId: string;
  locale: Locale;
}) {
  const project = await getProjectById(projectId, locale);
  const t = await getTranslations("projectDetail");

  if (!project) {
    notFound();
  }

  return (
    <article>
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 text-foreground">
          {project.title}
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed max-w-3xl">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-10">
          {project.tags?.map((tag: string) => (
            <Chip
              key={tag}
              size="sm"
              className="bg-secondary text-foreground border-none"
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
        className="w-full relative aspect-video rounded-2xl overflow-hidden mb-12 shadow-sm"
      >
        {project.image ? (
          // <Image
          //   src={project.image}
          //   alt={project.title}
          //   fill
          //   className="object-cover"
          //   priority
          //   sizes="(max-width: 1024px) 100vw, 1024px"
          // />
          <MultipleImage imgList={project.image} />
        ) : (
          // <span></span>
          <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">
            <Code2 className="w-16 h-16 opacity-30" />
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
              <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">
                {t("websiteLabel")}
              </h3>

              {project.isDone ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button
                    className="w-full sm:w-auto font-medium shadow-md bg-foreground text-background hover:bg-foreground/80 rounded-full px-8"
                    size="lg"
                  >
                    {t("visit")}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              ) : (
                <Dialog type="info" acceptText="Okay" title={t("deployingTitle")} message={t("deployingMessage")}>
                  <Button
                    className="w-full sm:w-auto font-medium shadow-md bg-foreground text-background hover:bg-foreground/80 rounded-full px-8"
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
  const t = await getTranslations("projectDetail");

  return (
    <main className="min-h-screen py-16 bg-secondary flex justify-center">
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

        <Suspense fallback={<ProjectSkeleton />}>
          <ProjectContent projectId={projectId} locale={locale} />
        </Suspense>
      </div>
    </main>
  );
}

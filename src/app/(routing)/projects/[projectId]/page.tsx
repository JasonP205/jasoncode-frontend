import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink, Code2 } from "lucide-react";
import { Chip, Button, Skeleton } from "@heroui/react";
import MotionDiv from "@/components/ui/motionDiv";
import { getProjectById } from "@/services/projects.service";

export async function generateMetadata(props: any): Promise<Metadata> {
  const { projectId } = await props.params;

  const project = await getProjectById(projectId);

  if (!project) {
    return {
      title: "Không tìm thấy dự án",
      description: "Dự án không tồn tại",
    };
  }

  return {
    title: project.title,
    description: project.description,
    keywords: project.tags || ["dự án web", "thiết kế web", "Jason Dev"],
    alternates: {
      canonical: `/projects/${projectId}`,
    },
    openGraph: {
      title: `${project.title} | Jason Dev`,
      description: project.description,
      url: `https://hwagfu.dev/projects/${projectId}`,
      images: project.image ? [{ url: project.image, alt: project.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: project.image ? [project.image] : undefined,
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

async function ProjectContent({ projectId }: { projectId: string }) {
  const project = await getProjectById(projectId);

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
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 text-black">
          {project.title}
        </h1>

        <p className="text-lg md:text-xl text-[#6F6F6F] mb-6 leading-relaxed max-w-3xl">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-10">
          {project.tags?.map((tag: string) => (
            <Chip
              key={tag}
              size="sm"
              className="bg-gray-200 text-gray-800 border-none"
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
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
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
        <div className="md:col-span-2 text-[#4f4f4f] text-lg leading-loose max-w-none">
          <p className="whitespace-pre-line">{project.fullDescription}</p>
        </div>

        <div className="md:col-span-1">
          {project.liveUrl && (
            <div className="sticky top-32">
              <h3 className="font-bold text-sm uppercase tracking-widest text-[#a3a3a3] mb-4">
                Website Dự Án
              </h3>

              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button
                  className="w-full sm:w-auto font-medium shadow-md bg-black text-white hover:bg-black/80 rounded-full px-8"
                  size="lg"
                >
                  Truy cập ngay
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </MotionDiv>
    </article>
  );
}

export default async function Page(props: any) {
  const { projectId } = await props.params;

  return (
    <main className="min-h-screen py-16 bg-gray-50 flex justify-center">
      <div className="max-w-6xl w-full px-4 sm:px-6 lg:px-8">
        <MotionDiv
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/projects"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors group/back hover:underline decoration-1 underline-offset-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover/back:-translate-x-1 transition-transform duration-200" />
            Về danh sách dự án
          </Link>
        </MotionDiv>

        <Suspense fallback={<ProjectSkeleton />}>
          <ProjectContent projectId={projectId} />
        </Suspense>
      </div>
    </main>
  );
}

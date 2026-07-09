import React from "react";
import type { LocalizedProject } from "@/data/projects";
import MotionDiv from "./motionDiv";
import { Card, Chip, Skeleton } from "@heroui/react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ThreeDCard from "@/components/ThreeDCard";

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};
const ProjectGrid = async ({ projects }: { projects: LocalizedProject[] }) => {
  const t = await getTranslations("projectList");
  return (
    <>
      {projects.map((project, index) => (
        <MotionDiv
          key={project.id}
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: index * 0.1 }}
        >
          <Link href={`/library/projects/${project.id}`}>
            <ThreeDCard>
              <Card className="group hover:shadow-xl hover:-translate-y-2 h-full flex flex-col transition-all duration-300">
                <div className="overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={project.image[0].src}
                    alt={project.title}
                    width={1440}
                    height={900}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="h-auto w-full transition-transform duration-300"
                  />
                </div>
                <Card.Header className="p-8 pb-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Chip key={tag}>{tag}</Chip>
                    ))}
                  </div>
                  <Card.Title className="group-hover:text-foreground transition-colors">
                    {project.title}
                  </Card.Title>
                </Card.Header>
                <Card.Content className="px-8 pb-4 grow">
                  <Card.Description className="text-muted leading-relaxed line-clamp-2">
                    {project.description}
                  </Card.Description>
                </Card.Content>
                <Card.Footer className="px-8 pb-8">
                  <span className="hover:underline group-hover:underline flex items-center underline-offset-4 decoration-1 group/link">
                    <span>{t("viewDetail")}</span>
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                  </span>
                </Card.Footer>
              </Card>
            </ThreeDCard>
          </Link>
        </MotionDiv>
      ))}
    </>
  );
};

const ProjectGridSkeleton = ({ length = 6 }: { length?: number }) => {
  return (
    <>
      {Array.from({ length: length }).map((_, index) => (
        <Card
          data-name="project-skeleton"
          key={index}
          className="h-full flex flex-col"
        >
          <div className="relative aspect-video overflow-hidden">
            <Skeleton className="h-64 w-full" />
          </div>
          <Card.Header className="p-8 pb-4 flex-col items-start">
            <div className="flex flex-wrap gap-2 mb-4 w-full">
              <Skeleton className="w-16 h-6 rounded-full" />
              <Skeleton className="w-20 h-6 rounded-full" />
              <Skeleton className="w-14 h-6 rounded-full" />
            </div>
            <Skeleton className="w-3/4 h-7 rounded-lg" />
          </Card.Header>
          <Card.Content className="px-8 pb-4 grow flex flex-col gap-3">
            <Skeleton className="w-full h-3 rounded-lg" />
            <Skeleton className="w-full h-3 rounded-lg" />
            <Skeleton className="w-4/5 h-3 rounded-lg" />
          </Card.Content>
          <Card.Footer className="px-8 pb-8">
            <Skeleton className="w-32 h-4 rounded-lg" />
          </Card.Footer>
        </Card>
      ))}
    </>
  );
};

export { ProjectGrid, ProjectGridSkeleton };

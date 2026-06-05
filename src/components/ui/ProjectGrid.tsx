import React from "react";
import type { Project } from "@/data/projects";
import MotionDiv from "./motionDiv";
import { Card, Chip, Skeleton } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";
import ThreeDCard from "@/components/ThreeDCard";

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};
const ProjectGrid = async ({ projects }: { projects: Project[] }) => {
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
          <Link href={`/projects/${project.id}`}>
            <ThreeDCard>
              <Card className="group hover:shadow-xl hover:-translate-y-2 h-full flex flex-col transition-all duration-300">
                <div className="relative aspect-video overflow-hidden">
                  <div className="relative h-64 rounded-xl overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      width={800}
                      height={450}
                    />
                  </div>
                  <span className="absolute inset-0 bg-black/20 opacity-0 rounded-lg group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ExternalLink className="text-white w-8 h-8" />
                  </span>
                </div>
                <Card.Header className="p-8 pb-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Chip key={tag}>{tag}</Chip>
                    ))}
                  </div>
                  <Card.Title className="group-hover:text-black transition-colors">
                    {project.title}
                  </Card.Title>
                </Card.Header>
                <Card.Content className="px-8 pb-4 grow">
                  <Card.Description className="text-muted leading-relaxed">
                    {project.description}
                  </Card.Description>
                </Card.Content>
                <Card.Footer className="px-8 pb-8">
                  <span className="hover:underline flex items-center underline-offset-4 decoration-1 group/link">
                    <span>Xem chi tiết dự án</span>
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

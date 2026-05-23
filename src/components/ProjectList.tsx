import React from "react";
import MotionDiv from "./ui/motionDiv";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button, Card, Chip } from "@heroui/react";
import { projects } from "@/data/projects";
import Image from "next/image";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const ProjectList = () => {
  const featuredProjects = projects.slice(0, 3);
  return (
    <section id="projects" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <MotionDiv
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 gap-6 sm:gap-8"
        >
          <MotionDiv variants={itemVariants} className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl font-serif mb-4 sm:mb-6">
              Dự án tiêu biểu
            </h2>
            <p className="text-[#6F6F6F] text-base sm:text-lg">
              Tuyển tập những sản phẩm tâm huyết mà tôi đã tham gia thiết kế và
              phát triển.
            </p>
          </MotionDiv>
          <MotionDiv variants={itemVariants}>
            <Link
              href="/project"
              className="group flex items-center gap-2 text-black font-medium border-b-2 border-black pb-1 hover:opacity-70 transition-all text-sm sm:text-base"
            >
              Xem tất cả dự án{" "}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </MotionDiv>
        </MotionDiv>

        <MotionDiv
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {featuredProjects.map((project) => (
            <MotionDiv key={project.id} variants={itemVariants}>
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
                  <Link
                    href={`/projects/${project.id}`}
                    className="absolute inset-0 bg-black/20 opacity-0 rounded-lg group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <ExternalLink className="text-white w-8 h-8" />
                  </Link>
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
                  <Link className="hover:underline flex items-center underline-offset-4 decoration-1 group/link" href={`/projects/${project.id}`}>
                      <span>Xem chi tiết dự án</span>
                      <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </Card.Footer>
              </Card>
            </MotionDiv>
          ))}
        </MotionDiv>
      </div>
    </section>
  );
};

export default ProjectList;

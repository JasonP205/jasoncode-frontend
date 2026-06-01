import MotionDiv from "./ui/motionDiv";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Suspense } from "react";
import { ProjectGrid, ProjectGridSkeleton } from "./ui/ProjectGrid";
import { getAllProjects } from "@/services/projects.service";

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

const ProjectGridData = async ({ maxLenght }: { maxLenght?: number }) => {
  const projects = await getAllProjects();
  const featuredProjects = maxLenght ? projects.slice(0, maxLenght) : projects;
  return <ProjectGrid projects={featuredProjects} />;
};

const ProjectList = ({ maxLenght }: { maxLenght?: number }) => {
  return (
    <section data-anchor="projects" className="py-16 sm:py-24 bg-gray-50">
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
          {maxLenght && (
            <MotionDiv variants={itemVariants}>
              <Link
                href="/projects"
                className="group flex items-center gap-2 text-black font-medium border-b-2 border-black pb-1 hover:opacity-70 transition-all text-sm sm:text-base"
              >
                Xem tất cả dự án{" "}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </MotionDiv>
          )}
        </MotionDiv>

        <MotionDiv
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <Suspense fallback={<ProjectGridSkeleton length={3} />}>
            <ProjectGridData maxLenght={maxLenght} />
          </Suspense>
        </MotionDiv>
      </div>
    </section>
  );
};

export default ProjectList;

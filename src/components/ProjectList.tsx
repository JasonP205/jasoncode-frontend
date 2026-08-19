import MotionDiv from "./ui/motionDiv";
import { ArrowRight } from "lucide-react";
import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProjectGrid, ProjectGridSkeleton } from "./ui/ProjectGrid";
import { getAllProjects } from "@/services/projects.service";
import type { Locale } from "@/i18n/routing";
import { BackButton } from "./ui/BackButton";
import SectionLabel from "./ui/SectionLabel";

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
  const locale = (await getLocale()) as Locale;
  const projects = getAllProjects(locale);
  const featuredProjects = maxLenght ? projects.slice(0, maxLenght) : projects;
  return <ProjectGrid projects={featuredProjects} />;
};

const ProjectList = ({ maxLenght }: { maxLenght?: number }) => {
  const t = useTranslations("projectList");
  return (
    <section data-anchor="projects" className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {maxLenght === undefined && (
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <BackButton fallbackHref="/library">{t("back")}</BackButton>
          </MotionDiv>
        )}
        <MotionDiv
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 gap-6 sm:gap-8"
        >
          <MotionDiv variants={itemVariants} className="max-w-2xl">
            <SectionLabel>{t("label")}</SectionLabel>
            <h2 className="mt-5 text-4xl sm:text-5xl font-serif tracking-tight">
              {t("heading")}
            </h2>
            <p className="mt-6 text-muted-foreground text-base sm:text-lg">
              {t("subtitle")}
            </p>
          </MotionDiv>
          {maxLenght && (
            <MotionDiv variants={itemVariants}>
              <Link
                href="/library/projects"
                className="group flex items-center gap-2 text-foreground font-medium border-b-2 border-foreground pb-1 hover:opacity-70 transition-all text-sm sm:text-base"
              >
                {t("viewAll")}{" "}
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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

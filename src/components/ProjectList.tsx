import { ChevronRight } from "lucide-react";
import { getLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProjectGrid } from "./ui/ProjectGrid";
import { getAllProjects } from "@/services/projects.service";
import type { Locale } from "@/i18n/routing";
import SectionHeader from "./ui/SectionHeader";

const ProjectGridData = async ({ limit }: { limit?: number }) => {
  const locale = (await getLocale()) as Locale;
  const projects = getAllProjects(locale);
  return <ProjectGrid projects={limit ? projects.slice(0, limit) : projects} />;
};

/**
 * The proof section. On the home page it shows the first `limit` projects and
 * links onward; on /library/projects it is the page itself (and owns the h1).
 */
const ProjectList = ({ limit }: { limit?: number }) => {
  const t = useTranslations("projectList");
  const isPreview = limit !== undefined;

  return (
    <section
      data-anchor="projects"
      className="bg-band px-4 py-20 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          as={isPreview ? "h2" : "h1"}
          kicker={t("label")}
          tone="blue"
          title={t("heading")}
          lede={t("subtitle")}
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectGridData limit={limit} />
        </div>

        {isPreview && (
          <div className="mt-12 text-center">
            <Link href="/library/projects" className="link-more text-lg">
              {t("viewAll")}
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectList;

import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getAllProjects } from "@/services/projects.service";
import SectionHeader from "@/components/ui/SectionHeader";
import { ProjectGrid } from "@/components/ui/ProjectGrid";

/** The three featured projects, each a link to its detail page. */
export default async function WorkSection() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("profile.work");
  const projects = getAllProjects(locale).slice(0, 3);

  return (
    <section className="bg-band px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader align="left" kicker={t("kicker")} title={t("heading")} lede={t("lede")} />
          <Link href="/library/projects" className="link-more shrink-0">
            {t("viewAll")}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectGrid projects={projects} />
        </div>
      </div>
    </section>
  );
}

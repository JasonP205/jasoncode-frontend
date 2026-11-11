import { getTranslations, setRequestLocale } from "next-intl/server";
import Contact from "@/components/Contact";
import type { Locale } from "@/i18n/routing";
import ProfileHero from "@/components/home/ProfileHero";
import NowSection from "@/components/home/NowSection";
import TimeSection from "@/components/home/TimeSection";
import WorkSection from "@/components/home/WorkSection";
import StackSection from "@/components/home/StackSection";
import { SITE_URL } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import HomeWorld from "@/components/home/HomeWorld";
import { getAllProjects } from "@/services/projects.service";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "metadata" });
  const aside = await getTranslations({ locale, namespace: "profile.aside" });

  // Entity + site structured data — helps Google resolve the "Jason Dev /
  // Phan Hoàng Phúc" entity and can unlock the sitelinks search box.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Phan Hoàng Phúc",
        alternateName: "Jason Dev",
        url: SITE_URL,
        jobTitle: "Software Engineer",
        worksFor: { "@type": "Organization", name: "TOTDigi" },
        alumniOf: { "@type": "CollegeOrUniversity", name: "University of Greenwich Vietnam" },
        sameAs: [
          "https://github.com/JasonP205",
          "https://facebook.com/hoangphuc05",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Jason Dev Portfolio",
        description: t("homeDescription"),
        inLanguage: locale === "vi" ? "vi-VN" : "en-US",
        publisher: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };

  const worldProjects = getAllProjects(locale).filter((p) => p.image[0]).map((p) => ({
    id: p.id,
    title: p.title,
    image: p.image[0]?.src ?? "",
  }));

  return (
    <>
      {/* One fixed three.js canvas behind the whole page: ribbon, solids,
          dust, the ESL swarm (L1) and the project ring (L2). */}
      <HomeWorld projects={worldProjects} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* A personal page, read as a stack from the surface down: who (L0),
          what now (L1), what has been built (L2), built with what (L3), how
          to get in touch (L4). Services are one link away, not the subject. */}
      <ProfileHero />
      <NowSection />
      <TimeSection />
      <WorkSection />
      <StackSection />
      <p className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-1 border-t border-border px-5 py-8 text-muted-foreground sm:px-8">
        {aside("text")}
        <Link href="/services" className="link-more">
          {aside("link")}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </p>
      <Contact bare />
    </>
  );
}

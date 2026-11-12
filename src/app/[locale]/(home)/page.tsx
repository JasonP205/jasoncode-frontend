import { getTranslations, setRequestLocale } from "next-intl/server";
import Contact from "@/components/Contact";
import type { Locale } from "@/i18n/routing";
import ProfileHero from "@/components/home/ProfileHero";
import NowSection from "@/components/home/NowSection";
import TimeSection from "@/components/home/TimeSection";
import WorkSection from "@/components/home/WorkSection";
import StackSection from "@/components/home/StackSection";
import { SITE_URL } from "@/lib/seo";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "metadata" });

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
        worksFor: { "@type": "Organization", name: "TOTDigi", url: "https://totdigi.vn/" },
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* A personal page, SaaS-shaped: who (hero + product shot), what now,
          the path so far, what has been built, built with what, then contact.
          Sections alternate paper and band. Services are one card away. */}
      <ProfileHero />
      <NowSection />
      <TimeSection />
      <WorkSection />
      <StackSection />
      <Contact />
    </>
  );
}

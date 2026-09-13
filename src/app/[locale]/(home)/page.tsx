import { getTranslations, setRequestLocale } from "next-intl/server";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import type { Locale } from "@/i18n/routing";
import ServicesTeaser from "@/components/ServicesTeaser";
import WorkTeaser from "@/components/WorkTeaser";
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
        jobTitle: "Freelance Web Developer",
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
      {/* Read top to bottom, the page answers in order: who is this, what
          has he built, what can I hire him for, who is he and why trust him,
          how do I reach him. The middle is three scroll films on the page
          background, each handing over to the next without a seam. */}
      <Hero />
      {/* The hero's drops become a whirlpool of the work, which bursts into
          the three featured projects and shatters into the services film. */}
      <WorkTeaser />
      {/* What he builds, then who he is — ending on the promises under the
          sky, which follows the theme: day in light, night in dark. */}
      <ServicesTeaser />
      <Skills />
      <Contact />
    </>
  );
}

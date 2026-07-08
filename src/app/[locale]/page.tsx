import { getTranslations, setRequestLocale } from "next-intl/server";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import ProjectList from "@/components/ProjectList";
import Contact from "@/components/Contact";
import type { Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";
import CursorEffectClient from "@/components/ui/CursorEffectClient";

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
      <CursorEffectClient />
      <Hero />
      <ProjectList maxLenght={3} />
      <Skills />
      <Contact />
    </>
  );
}

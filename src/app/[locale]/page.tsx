import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import ProjectList from "@/components/ProjectList";
import Contact from "@/components/Contact";
import type { Locale } from "@/i18n/routing";
import CursorEffectClient from "@/components/ui/CursorEffectClient";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <CursorEffectClient />
      <Hero />
      <ProjectList maxLenght={3} />
      <Skills />
      <Contact />
    </>
  );
}

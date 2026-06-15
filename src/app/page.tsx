import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import ProjectList from "@/components/ProjectList";
import Contact from "@/components/Contact";
import { CursorEffect } from "@hwagfu/cursor";

export default function Home() {
  return (
    <>
      <CursorEffect />
      <Hero />
      <Skills />
      <ProjectList maxLenght={6} />
      <Contact />
    </>
  );
}

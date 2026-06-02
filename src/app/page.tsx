import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import ProjectList from "@/components/ProjectList";
import Contact from "@/components/Contact";


export default function Home() {
  return (
    <>
      <Hero />
      <Skills />
      <ProjectList maxLenght={6} />
      <Contact />
    </>
  );
}

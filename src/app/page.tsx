import { Hero } from "@/components/Hero";
import { TechStack } from "@/components/TechStack";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Navigation } from "@/components/Naviagtion";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full">
      
      <Hero />
      <TechStack />
      <Projects />
      <Contact />
      
    </div>
  );
}

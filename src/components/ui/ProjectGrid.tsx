import type { LocalizedProject } from "@/data/projects";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Reveal from "./Reveal";

/**
 * A project is a picture of the product, its name and one line. The whole
 * card is the link and lifts on hover. The tagline is written to fit, so
 * nothing is ever cut off with an ellipsis.
 */
const ProjectGrid = ({ projects }: { projects: LocalizedProject[] }) => {
  return (
    <>
      {projects.map((project, index) => (
        <Reveal key={project.id} variant="zoom" delay={Math.min(index, 2) * 0.08} className="h-full">
          <Link
            href={`/library/projects/${project.id}`}
            className="card card-link group flex h-full flex-col overflow-hidden"
          >
            <span className="relative block aspect-16/10 overflow-hidden border-b border-border bg-band">
              <Image
                src={project.image[0].src}
                alt={project.image[0].alt || project.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
              />
            </span>
            <span className="flex flex-1 items-start justify-between gap-4 p-6">
              <span>
                <h3 className="headline-card text-foreground">{project.title}</h3>
                <p className="mt-1.5 leading-relaxed text-muted-foreground">{project.tagline}</p>
              </span>
              {/* The arrow turns pink on hover — a small surprise per card. */}
              <ArrowUpRight
                aria-hidden
                className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-[color,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-hue-pink"
              />
            </span>
          </Link>
        </Reveal>
      ))}
    </>
  );
};

export { ProjectGrid };

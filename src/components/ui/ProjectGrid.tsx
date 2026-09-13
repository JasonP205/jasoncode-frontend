import type { LocalizedProject } from "@/data/projects";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import Reveal from "./Reveal";
import ParallaxMedia from "./scroll/ParallaxMedia";

/**
 * A project is a picture of the product, its name and one line. The whole tile
 * is the link — no chips, no "view details" row, no clamped text. The tagline
 * is written to fit, so nothing is ever cut off with an ellipsis.
 */
const ProjectGrid = ({ projects }: { projects: LocalizedProject[] }) => {
  return (
    <>
      {projects.map((project, index) => (
        <Reveal key={project.id} variant="zoom" delay={Math.min(index, 2) * 0.08}>
          <Link
            href={`/library/projects/${project.id}`}
            className="group block h-full rounded-[1.75rem] bg-tile p-2.5 transition-shadow duration-300 hover:shadow-[0_12px_40px_-12px_rgb(0_0_0/0.18)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
          >
            {/* The screenshot drifts inside its frame while the tile crosses
                the viewport — the layered, parallax feel of Apple's tiles. */}
            <ParallaxMedia className="aspect-16/10 rounded-[1.25rem] bg-band">
              <Image
                src={project.image[0].src}
                alt={project.image[0].alt || project.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
              />
            </ParallaxMedia>
            <div className="px-3.5 pt-5 pb-4">
              <h3 className="headline-card text-foreground">{project.title}</h3>
              <p className="mt-1.5 leading-relaxed text-muted-foreground">
                {project.tagline}
              </p>
            </div>
          </Link>
        </Reveal>
      ))}
    </>
  );
};

export { ProjectGrid };

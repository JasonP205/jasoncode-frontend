import { getTranslations } from "next-intl/server";
import { ArrowUpRight, Download, Globe, Mail, MapPin, Phone } from "lucide-react";
import Icons from "@/components/ui/icon";
import { Link } from "@/i18n/navigation";
import { cv } from "@/data/cv";
import KineticHeadline from "@/components/ui/kinetic/KineticHeadline";
import LayerScene from "@/components/ui/three/LayerScene";
import SoundToggle from "@/components/ui/sound/SoundToggle";
import Reveal from "@/components/ui/Reveal";
import { toneCycle, toneText } from "@/components/ui/tones";
import { cn } from "@/lib/utils";
import CvRail from "./CvRail";
import Tilt3D from "@/components/ui/three/Tilt3D";

const CV_SRC = "/cv/new-cv.pdf";
const CV_FILENAME = "Phan Hoang Phuc - CV.pdf";
const SECTION_IDS = ["summary", "experience", "skills", "projects", "education"];

/** Section opener: mono layer tag in the layer's tone, then the CV heading. */
function Heading({ layer, children }: { layer: number; children: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <span className={cn("layer-tag", toneText[toneCycle[layer]])}>L{layer}</span>
      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{children}</h2>
      <span aria-hidden className="h-px flex-1 bg-border" />
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-tile px-3 py-1 text-sm text-foreground/80 shadow-[inset_0_0_0_1px_var(--border)]">
      {children}
    </span>
  );
}

/**
 * The résumé as a stack of five layers. The CV body stays in English — it is
 * the document as sent to recruiters (`src/data/cv.ts`, transcribed from
 * `public/cv/new-cv.pdf`); the chrome around it is translated.
 */
export default async function CvPage() {
  const t = await getTranslations("cv");
  const p = await getTranslations("profile");
  const rail = t.raw("rail") as string[];
  const [first, ...rest] = cv.name.split(" ");
  const last = rest.pop() ?? "";

  const iconClass = "h-4 w-4 shrink-0";
  const contacts = [
    { icon: <MapPin className={iconClass} aria-hidden />, text: cv.location },
    { icon: <Phone className={iconClass} aria-hidden />, text: cv.phone, href: `tel:${cv.phone.replace(/\s/g, "")}` },
    { icon: <Mail className={iconClass} aria-hidden />, text: cv.email, href: `mailto:${cv.email}` },
    { icon: <Globe className={iconClass} aria-hidden />, text: cv.portfolio.label, href: cv.portfolio.href },
    {
      icon: (
        <span className={`${iconClass} inline-flex items-center justify-center`}>
          <Icons icon="mdi:github" width={16} height={16} />
        </span>
      ),
      text: cv.github.label,
      href: cv.github.href,
    },
  ];

  return (
    <article>
      {/* ---- Hero ------------------------------------------------------ */}
      <header className="relative isolate overflow-hidden px-5 sm:px-8">
        <div aria-hidden className="layer-wash absolute inset-0 -z-10" />
        <div className="mx-auto grid max-w-6xl items-center gap-4 pt-12 pb-14 lg:grid-cols-[1.2fr_1fr] lg:pt-16">
          <div className="relative z-10">
            <p className="flex items-center gap-3">
              <span className="layer-tag text-hue-blue">CV</span>
              <span className="kicker text-muted-foreground">{t("badge")}</span>
            </p>
            <KineticHeadline
              className="headline-hero mt-5 text-foreground"
              segments={[
                { text: `${[first, ...rest].join(" ")}\n` },
                { text: `${last}.`, accent: true },
              ]}
            />
            <p className="mt-5 text-lg font-medium text-foreground/85">{cv.role}</p>
            <p className="lede mt-2 max-w-xl">{t("lede")}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={CV_SRC} download={CV_FILENAME} aria-label={t("downloadAria")} className="btn-primary">
                <Download className="h-4 w-4" aria-hidden />
                {t("download")}
              </a>
              <a
                href={CV_SRC}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("openAria")}
                className="btn-secondary"
              >
                {t("open")}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
              <SoundToggle onLabel={p("soundOn")} offLabel={p("soundOff")} />
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5 text-sm text-muted-foreground">
              {contacts.map(({ icon, text, href }) => (
                <li key={text} className="flex items-center gap-2">
                  {icon}
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    >
                      {text}
                    </a>
                  ) : (
                    text
                  )}
                </li>
              ))}
            </ul>
          </div>

          <LayerScene
            variant="stack"
            className="relative -mx-5 h-[20rem] opacity-0 transition-opacity duration-1000 data-ready:opacity-100 sm:mx-0 sm:h-[28rem] lg:-mr-24 lg:h-[36rem] xl:-mr-40"
          />
        </div>
      </header>

      {/* ---- Body: rail + five layers ----------------------------------- */}
      <div className="mx-auto grid max-w-6xl gap-12 px-5 pt-8 pb-24 sm:px-8 lg:grid-cols-[11rem_1fr] lg:gap-16">
        <div>
          <CvRail
            label={t("railLabel")}
            items={SECTION_IDS.map((id, i) => ({ id, title: rail[i] }))}
          />
        </div>

        <div className="min-w-0 space-y-24">
          <section id="summary" className="scroll-mt-24">
            <Heading layer={0}>Professional Summary</Heading>
            <Reveal>
              <p className="text-xl leading-relaxed text-foreground/85 text-pretty sm:text-2xl sm:leading-relaxed">
                {cv.summary}
              </p>
            </Reveal>
          </section>

          <section id="experience" className="scroll-mt-24">
            <Heading layer={1}>Work Experience</Heading>
            <div className="space-y-4">
              {cv.experience.map((job) => (
                <Reveal key={job.company} variant="zoom">
                  <div className="rounded-[1.75rem] border border-border bg-tile p-7 sm:p-9">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="headline-card text-foreground">
                        {job.company} <span className="text-muted-foreground">·</span> {job.title}
                      </h3>
                      {job.current && (
                        <span className="inline-flex items-center gap-2 rounded-full bg-hue-green/10 px-3 py-1 text-xs font-medium text-hue-green dark:bg-hue-green/15">
                          <span aria-hidden className="relative flex size-1.5">
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-hue-green opacity-60 motion-reduce:animate-none" />
                            <span className="relative inline-flex size-1.5 rounded-full bg-hue-green" />
                          </span>
                          {t("now")}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{job.period}</p>
                    <ul className="mt-5 space-y-2">
                      {job.bullets.map((bullet) => (
                        <li key={bullet} className="relative pl-5 leading-relaxed text-muted-foreground before:absolute before:top-[0.65em] before:left-0 before:size-1.5 before:rounded-full before:bg-hue-purple">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          <section id="skills" className="scroll-mt-24">
            <Heading layer={2}>Technical Skills</Heading>
            <div className="grid gap-4 sm:grid-cols-2">
              {cv.skills.map((group, i) => (
                <Reveal key={group.label} variant="zoom" delay={Math.min(i, 3) * 0.05}>
                  <Tilt3D max={8}>
                  <div
                    data-sound="hover"
                    className="h-full rounded-[1.75rem] border border-border bg-tile p-6 [transform-style:preserve-3d]"
                  >
                    <h3 data-depth="1" className="font-semibold text-foreground">{group.label}</h3>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <Chip key={item}>{item}</Chip>
                      ))}
                    </div>
                  </div>
                  </Tilt3D>
                </Reveal>
              ))}
            </div>
          </section>

          <section id="projects" className="scroll-mt-24">
            <Heading layer={3}>Projects and Freelance Work</Heading>
            <div className="space-y-4">
              {cv.projects.map((project, i) => (
                <Reveal key={project.name} variant="zoom">
                  <Tilt3D max={4}>
                  <div className="rounded-[1.75rem] border border-border bg-tile p-7 [transform-style:preserve-3d] sm:p-9">
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                      <span className="font-mono text-sm text-hue-orange">0{i + 1}</span>
                      <h3 className="headline-card flex-1 text-foreground">{project.name}</h3>
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-more text-sm"
                      >
                        {project.live.replace(/^https:\/\//, "")}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.stack.map((tech) => (
                        <Chip key={tech}>{tech}</Chip>
                      ))}
                    </div>
                    <ul className="mt-5 space-y-2">
                      {project.bullets.map((bullet) => (
                        <li key={bullet} className="relative pl-5 leading-relaxed text-muted-foreground before:absolute before:top-[0.65em] before:left-0 before:size-1.5 before:rounded-full before:bg-hue-orange">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                  </Tilt3D>
                </Reveal>
              ))}
            </div>
          </section>

          <section id="education" className="scroll-mt-24">
            <Heading layer={4}>Education</Heading>
            <Reveal variant="zoom">
              <div className="rounded-[1.75rem] border border-border bg-tile p-7 sm:p-9">
                <h3 className="headline-card text-foreground">{cv.education.school}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{cv.education.location}</p>
                <p className="mt-5 font-medium text-foreground/85">{cv.education.degree}</p>
                <p className="mt-1 text-muted-foreground">{cv.education.period}</p>
                <p className="mt-1 text-muted-foreground">{cv.education.gpa}</p>
                <p className="mt-5 text-muted-foreground">
                  <span className="font-medium text-foreground">Languages: </span>
                  {cv.education.languages}
                </p>
              </div>
            </Reveal>
          </section>
        </div>
      </div>

      {/* ---- Closing --------------------------------------------------- */}
      <section className="border-t border-border bg-band px-5 py-20 text-center sm:px-8">
        <h2 className="headline-section text-foreground">{t("closingHeading")}</h2>
        <p className="lede mx-auto mt-4 max-w-xl">{t("closingLede")}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href={CV_SRC} download={CV_FILENAME} aria-label={t("downloadAria")} className="btn-primary">
            <Download className="h-4 w-4" aria-hidden />
            {t("download")}
          </a>
          <Link href="/contact" className="btn-secondary">
            {t("contact")}
          </Link>
        </div>
      </section>
    </article>
  );
}

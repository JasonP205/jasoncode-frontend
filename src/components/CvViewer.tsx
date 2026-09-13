import { getTranslations } from "next-intl/server";
import {
  ArrowUpRight,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Icons from "@/components/ui/icon";
import { cv } from "@/data/cv";

const CV_SRC = "/cv/CV.pdf";
const CV_FILENAME = "Phan Hoang Phuc - CV.pdf";

/** Section heading with the hairline rule the printed CV uses. */
const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-5 flex items-center gap-4 text-lg font-semibold tracking-tight text-foreground">
    <span className="whitespace-nowrap">{children}</span>
    <span aria-hidden className="h-px flex-1 bg-border" />
  </h2>
);

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-md bg-band px-2 py-0.5 text-xs text-muted-foreground">
    {children}
  </span>
);

/**
 * The CV as real HTML rather than an embedded PDF. The document renders at its
 * natural height and scrolls with the page — no nested PDF scrollbar, no fixed
 * aspect box — and it works identically on mobile, in dark mode and for
 * crawlers. The PDF stays available as a download.
 */
const CvViewer = async () => {
  const t = await getTranslations("cv");

  const iconClass = "h-3.5 w-3.5 shrink-0";
  const contacts = [
    { icon: <MapPin className={iconClass} aria-hidden />, text: cv.location },
    {
      icon: <Phone className={iconClass} aria-hidden />,
      text: cv.phone,
      href: `tel:${cv.phone.replace(/\s/g, "")}`,
    },
    {
      icon: <Mail className={iconClass} aria-hidden />,
      text: cv.email,
      href: `mailto:${cv.email}`,
    },
    {
      icon: <Globe className={iconClass} aria-hidden />,
      text: cv.portfolio.label,
      href: cv.portfolio.href,
    },
    {
      // lucide dropped brand marks in v1, so GitHub comes from Iconify like it
      // does in the footer. The wrapper reserves the box while it mounts.
      icon: (
        <span className={`${iconClass} inline-flex items-center justify-center`}>
          <Icons icon="mdi:github" width={14} height={14} />
        </span>
      ),
      text: cv.github.label,
      href: cv.github.href,
    },
  ];

  return (
    <article className="mx-auto w-full max-w-4xl px-5 pb-20 pt-8 sm:px-8 sm:pt-12">
      {/* Page chrome — translated, unlike the CV body below it. */}
      <header className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <span className="kicker inline-flex items-center gap-2 text-hue-blue">
            <FileText className="h-4 w-4" aria-hidden />
            {t("badge")}
          </span>
          <h1 className="headline-section text-foreground">
            {cv.name}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            {cv.role}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={CV_SRC}
            download={CV_FILENAME}
            aria-label={t("downloadAria")}
            className="btn-primary w-full sm:w-auto"
          >
            <Download className="h-4 w-4" aria-hidden />
            {t("download")}
          </a>
          <a
            href={CV_SRC}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("openAria")}
            className="btn-secondary w-full sm:w-auto"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            {t("open")}
          </a>
        </div>
      </header>

      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
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

      <section className="mt-12">
        <SectionHeading>Professional Summary</SectionHeading>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
          {cv.summary}
        </p>
      </section>

      <section className="mt-12">
        <SectionHeading>Technical Skills</SectionHeading>
        <dl className="space-y-4">
          {cv.skills.map((group) => (
            <div
              key={group.label}
              className="grid gap-2 sm:grid-cols-[11rem_1fr] sm:gap-4"
            >
              <dt className="text-sm font-medium text-foreground">
                {group.label}
              </dt>
              <dd className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12">
        <SectionHeading>Projects &amp; Freelance Work</SectionHeading>
        <div className="space-y-8">
          {cv.projects.map((project) => (
            <div key={project.name}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {project.name}
                </h3>
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  {project.live.replace(/^https:\/\//, "")}
                  <ArrowUpRight className="h-3 w-3" aria-hidden />
                </a>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <Chip key={tech}>{tech}</Chip>
                ))}
              </div>
              <ul className="mt-3 space-y-2">
                {project.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="relative pl-5 text-sm leading-relaxed text-muted-foreground before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-muted-foreground/60"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <SectionHeading>Education</SectionHeading>
        <div className="flex flex-wrap items-baseline gap-x-3">
          <h3 className="text-lg font-semibold text-foreground">
            {cv.education.school}
          </h3>
          <span className="text-xs text-muted-foreground">
            {cv.education.location}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {cv.education.degree} · {cv.education.period}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{cv.education.gpa}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Languages: </span>
          {cv.education.languages}
        </p>
      </section>
    </article>
  );
};

export default CvViewer;

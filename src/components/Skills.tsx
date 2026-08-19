import React from "react";
import { useTranslations } from "next-intl";
import MotionDiv from "./ui/motionDiv";
import GreenwichLogo from "./ui/GreenwichLogo";
import ExternalLink from "./ui/externalLink";
import SectionLabel from "./ui/SectionLabel";
import TechMarquee from "./ui/TechMarquee";

const Skills = () => {
  const t = useTranslations("skills");

  const educationData = [
    {
      id: 0,
      degree: t("education.highschoolDegree"),
      school: {
        name: "Trường THPT Cây Dương",
        link: "https://thptcayduong.edu.vn/",
      },
      startDate: "09/2020",
      endDate: "06/2023",
      description: t("education.highschoolDescription"),
    },
    {
      id: 1,
      degree: t("education.universityDegree"),
      school: {
        name: "University of Greenwich",
        logo: <GreenwichLogo className="h-6 w-6" />,
        link: "https://www.greenwich.edu.vn/",
      },
      startDate: "08/2023",
      endDate: t("present"),
      description: t("education.universityDescription"),
    },
  ];

  return (
    <section
      data-anchor="skills"
      // No bottom padding or border: the marquee is the last thing in the
      // section, and its own bottom rule closes it. With `py-28` under a band
      // this thin, the band was left stranded in a field of empty grey.
      className="border-t border-border bg-secondary pt-20 sm:pt-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
          {/* The section header holds its own column and stays put while the
              timeline scrolls past it, so the reader never loses the frame the
              entries belong to. */}
          <MotionDiv
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <SectionLabel>{t("sectionLabel")}</SectionLabel>
            <h2 className="mt-5 font-serif text-4xl tracking-tight sm:text-5xl">
              {t("heading")}
            </h2>
            <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg">
              {t("summary")}
            </p>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-mono text-[0.6875rem] tracking-[0.22em] text-muted-foreground uppercase">
              {t("educationHeading")}
            </h3>

            {/* Was a 260px `ScrollShadow`, which cut the first entry off
                mid-sentence. Two items do not need a scroller. */}
            <ol className="mt-7 space-y-10 border-l border-border">
              {educationData.map((item) => (
                <li key={item.id} className="relative pl-7">
                  <span
                    aria-hidden
                    className="absolute top-1.5 left-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-foreground ring-4 ring-secondary"
                  />
                  <p className="font-mono text-xs tracking-wide text-muted-foreground">
                    {item.startDate} — {item.endDate}
                  </p>
                  <h4 className="mt-2 flex items-center gap-2 text-lg font-semibold sm:text-xl">
                    {item.school.logo}
                    <ExternalLink
                      url={item.school.link}
                      label={item.school.name}
                      className="font-semibold text-foreground hover:text-primary"
                    />
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                    {item.degree}
                  </p>
                  <p className="mt-3 leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </li>
              ))}
            </ol>
          </MotionDiv>
        </div>
      </div>

      {/* The stack breaks the container and runs the full width of the screen.
          Boxed into a column it is a widget; edge to edge it is the one moving
          thing on the page, and the only place colour enters an otherwise
          monochrome site. */}
      <div className="mt-20 sm:mt-28">
        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-8 max-w-7xl px-4 sm:mb-10 sm:px-8"
        >
          <SectionLabel>{t("techStackLabel")}</SectionLabel>
          <h3 className="mt-4 font-serif text-2xl tracking-tight sm:text-3xl">
            {t("techStackHeading")}
          </h3>
          <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
            {t("techStackNote")}
          </p>
        </MotionDiv>

        <TechMarquee />
      </div>
    </section>
  );
};

export default Skills;

import React from "react";
import { useTranslations } from "next-intl";
import MotionDiv from "./ui/motionDiv";
import { ScrollShadow } from "@heroui/react";
import Icon from "./ui/icon";
import GreenwichLogo from "./ui/GreenwichLogo";
import ExternalLink from "./ui/externalLink";

const Skills = () => {
  const t = useTranslations("skills");
  const techStack = [
    {
      name: "Next.js",
      color: "bg-black text-white",
      icon: "devicon:nextjs",
    },
    {
      name: "React.js",
      color: "bg-blue-500 text-white",
      icon: "devicon:react",
    },
    {
      name: "Node.js",
      color: "bg-green-600 text-white",
      icon: "material-icon-theme:nodejs",
    },
    {
      name: "Express.js",
      color: "bg-gray-800 text-white",
      icon: "devicon:express",
    },
    {
      name: "TailwindCSS",
      color: "bg-cyan-500 text-white",
      icon: "devicon:tailwindcss",
    },
    {
      name: "PHP",
      color: "bg-indigo-600 text-white",
      icon: "material-icon-theme:php",
    },
  ];
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
        logo: <GreenwichLogo className="w-6 h-6" />,
        link: "https://www.greenwich.edu.vn/",
      },
      startDate: "08/2023",
      endDate: t("present"),
      description: t("education.universityDescription"),
    },
  ];
  return (
    <section data-anchor="skills" className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* LEFT */}
          <MotionDiv
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-foreground" />
              <span className="uppercase tracking-[0.25em] text-xs text-muted-foreground">
                {t("educationLabel")}
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-6">
              {t("heading")}
            </h2>

            <ScrollShadow className="mb-6 h-65.5 p-4 overflow-y-auto scrollbar-none">
              {educationData.map((item) => (
                <div
                  key={item.id}
                  className="relative pl-6 border-l border-border"
                >
                  <div className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-foreground" />
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        {item.school.logo && item.school.logo}
                        <ExternalLink
                          url={item.school.link}
                          label={item.school.name}
                          className="text-foreground hover:text-primary font-semibold text-xl"
                        />
                      </h3>
                      <span className="flex items-center gap-2 text-muted-foreground">
                        {item.degree}
                      </span>
                    </div>

                    <span className="min-w-fit rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground text-center">
                      {item.startDate} — {item.endDate}
                    </span>
                  </div>

                  <p className="mt-3 text-muted-foreground leading-7 pb-3">
                    {item.description}
                  </p>
                </div>
              ))}
            </ScrollShadow>

            <p className="text-muted-foreground leading-8 text-lg">
              {t("summary")}
            </p>
          </MotionDiv>

          {/* RIGHT */}
          <MotionDiv
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-foreground" />
              <span className="uppercase tracking-[0.25em] text-xs text-muted-foreground">
                {t("techStackLabel")}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:gap-3">
              {techStack.map((tech, index) => (
                <MotionDiv
                  key={tech.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                  }}
                >
                  <div className="group flex flex-col md:flex-row md:items-center md:gap-4 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 transition-all duration-300 hover:border-foreground hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary transition-transform duration-300 group-hover:scale-110">
                      <Icon
                        icon={tech.icon}
                        className="h-6 w-6 text-foreground"
                      />
                    </div>

                    <div className="flex flex-col items-center md:items-start">
                      <p className="font-medium text-foreground">{tech.name}</p>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </div>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default Skills;

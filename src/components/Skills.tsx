import { useTranslations } from "next-intl";
import ProfileStory, { type EducationEntry, type PromiseEntry } from "./ui/scroll/ProfileStory";

/**
 * Server wrapper for the profile film: translations stay on the server, the
 * scroll timeline runs in the client component. The film also closes on the
 * promises, so the home page no longer shows `Guarantees` on its own.
 */
const Skills = () => {
  const t = useTranslations("skills");
  const h = useTranslations("home");
  const s = useTranslations("services");

  const education: EducationEntry[] = [
    {
      school: "Trường THPT Cây Dương",
      period: "09/2020 – 06/2023",
      year: "2023",
      degree: t("education.highschoolDegree"),
      description: t("education.highschoolDescription"),
    },
    {
      school: "University of Greenwich",
      period: `08/2023 – ${t("present")}`,
      year: "2027",
      degree: t("education.universityDegree"),
      description: t("education.universityDescription"),
    },
  ];

  return (
    <ProfileStory
      kicker={t("sectionLabel")}
      heading={t("heading")}
      summary={t("summary")}
      educationHeading={t("educationHeading")}
      education={education}
      milestones={[...education.map((item) => item.year), t("present")]}
      techHeading={t("techStackHeading")}
      techNote={t("techStackNote")}
      categories={{
        frontend: t("categories.frontend"),
        backend: t("categories.backend"),
        database: t("categories.database"),
        devops: t("categories.devops"),
      }}
      promiseLabel={h("promiseLabel")}
      promiseHeading={h("promiseHeading")}
      promises={s.raw("guarantees") as PromiseEntry[]}
      cvLabel={t("cvLink")}
    />
  );
};

export default Skills;

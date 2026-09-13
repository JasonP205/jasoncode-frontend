import { useTranslations } from "next-intl";
import ServicesStory from "./ui/scroll/ServicesStory";

/**
 * Server wrapper: translation stays server-side while the isolated product
 * film below owns the browser-only scroll timeline.
 */
export default function ServicesTeaser() {
  const t = useTranslations("home");
  const story = t.raw("servicesStory") as {
    chapters: { eyebrow: string; title: string; description: string }[];
    progress: string[];
    speedUnit: string;
    mergeLabel: string;
    seoBurst: [string, string];
  };
  // Message JSON can briefly lag behind the component during development HMR;
  // keep the visual resilient instead of letting one missing decorative label
  // take down the whole home page.
  const isVietnamese = story.speedUnit === "điểm hiệu năng";
  const seoBurst = story.seoBurst ?? (isVietnamese ? ["TĂNG TỐC", "SEO"] : ["ACCELERATE", "SEO"]);

  return (
    <ServicesStory
      label={t("servicesLabel")}
      heading={t("servicesHeading")}
      chapters={story.chapters}
      progressLabels={story.progress}
      speedUnit={story.speedUnit}
      mergeLabel={story.mergeLabel ?? (isVietnamese ? "Khởi chạy chiến dịch" : "Launch campaign")}
      seoBurst={seoBurst}
      cta={t("servicesCta")}
    />
  );
}

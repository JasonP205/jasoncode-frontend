import { getTranslations } from "next-intl/server";
import SectionHeader from "@/components/ui/SectionHeader";
import { stackLayers } from "@/data/stack-layers";
import StackExplorer from "./StackExplorer";

/** L3 — the five layers Phuc works across, and the tools on each. */
export default async function StackSection() {
  const t = await getTranslations("profile.stack");

  return (
    <section data-world-anchor className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          align="left"
          layer={3}
          tone="orange"
          kicker={t("kicker")}
          title={t("heading")}
          lede={t("lede")}
        />
        <StackExplorer labels={t.raw("layers") as string[]} layers={stackLayers} />
      </div>
    </section>
  );
}

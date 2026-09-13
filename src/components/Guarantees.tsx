import { Eye, MessagesSquare, ShieldCheck } from "lucide-react";
import IconBadge from "./ui/IconBadge";
import type { Tone } from "./ui/tones";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";

// Consultation, preview, lifetime bug fixes — in `services.guarantees` order.
const icons = [MessagesSquare, Eye, ShieldCheck];
const tones: Tone[] = ["blue", "purple", "green"];

/**
 * The three promises, stated once and reused wherever a visitor is deciding:
 * the home page (with a headline) and the services page (bare, under the hero).
 * Plan cards deliberately do not repeat them.
 */
export default function Guarantees({
  withHeader = false,
  className,
}: {
  withHeader?: boolean;
  className?: string;
}) {
  const t = useTranslations("services");
  const h = useTranslations("home");
  const items = t.raw("guarantees") as { title: string; desc: string }[];

  return (
    <section className={cn("px-4 py-20 sm:px-8 sm:py-32", className)}>
      <div className="mx-auto max-w-6xl">
        {withHeader && (
          <SectionHeader
            kicker={h("promiseLabel")}
            tone="green"
            title={h("promiseHeading")}
            className="mb-10 sm:mb-16"
          />
        )}
        <ul className="grid gap-12 sm:grid-cols-3 sm:gap-10">
          {items.map((item, index) => {
            return (
              <li key={item.title}>
                <Reveal delay={index * 0.08} className="flex flex-col items-start">
                  <IconBadge icon={icons[index]} tone={tones[index]} />
                  <h3 className="headline-card mt-5 text-foreground">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

import { Accordion } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";

/** Plain questions, plain answers — no icon per row. */
export default function FAQ() {
  const t = useTranslations("faq");
  const items = t.raw("items") as { title: string; content: string }[];

  return (
    <section className="px-4 py-20 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <SectionHeader title={t("heading")} lede={t("subtitle")} />

        <Reveal className="mt-12 border-t border-border">
          <Accordion className="w-full">
            {items.map((item, index) => (
              <Accordion.Item key={index} className="border-b border-border">
                <Accordion.Heading>
                  <Accordion.Trigger className="group flex w-full items-center gap-4 py-5 text-left">
                    <span className="flex-1 text-lg font-medium text-foreground">
                      {item.title}
                    </span>
                    <Accordion.Indicator>
                      <ChevronDown
                        className="size-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180"
                        aria-hidden
                      />
                    </Accordion.Indicator>
                  </Accordion.Trigger>
                </Accordion.Heading>

                <Accordion.Panel>
                  <Accordion.Body className="pb-6 pr-9 leading-relaxed text-muted-foreground">
                    {item.content}
                  </Accordion.Body>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

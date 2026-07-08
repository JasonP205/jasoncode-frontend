import { Accordion } from "@heroui/react";
import { useTranslations } from "next-intl";

import {
  ChevronDown,
  Globe,
  GraduationCap,
  HandCoins,
  Headset,
  LayoutTemplate,
  Search,
} from "lucide-react";

const faqIcons = [
  <HandCoins key="cost" className="size-4" />,
  <GraduationCap key="student" className="size-4" />,
  <LayoutTemplate key="design" className="size-4" />,
  <Search key="seo" className="size-4" />,
  <Globe key="domain" className="size-4" />,
  <Headset key="support" className="size-4" />,
];

export default function FAQ() {
  const t = useTranslations("faq");
  const items = t.raw("items") as { title: string; content: string }[];

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-8 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-serif">{t("heading")}</h2>
        <p className="text-muted mt-3">{t("subtitle")}</p>
      </div>

      <Accordion className="w-full">
        {items.map((item, index) => (
          <Accordion.Item key={index}>
            <Accordion.Heading>
              <Accordion.Trigger className="group flex items-center">
                <span className="mr-3 flex size-8 items-center justify-center rounded-full bg-default-100 text-default-600">
                  {faqIcons[index]}
                </span>

                <span className="flex-1 text-left font-medium">
                  {item.title}
                </span>

                <Accordion.Indicator>
                  <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>

            <Accordion.Panel>
              <Accordion.Body className="pl-11 text-muted leading-relaxed">
                {item.content}
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </section>
  );
}

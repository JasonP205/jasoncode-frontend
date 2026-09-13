"use client";

import React, { useState, useTransition } from "react";
import { Mail } from "lucide-react";
import { Input, TextArea, Button, toast } from "@heroui/react";
import { motion, AnimatePresence } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { submitContact } from "@/actions/contact.action";
import Jot from "./ui/Jot";
import Reveal from "./ui/Reveal";

// Fields sit on the white form card, so they take the band grey to stay
// visible; the theme's own field background is white.
const fieldClass = "bg-band font-sans text-foreground placeholder:text-muted-foreground";

export default function Contact() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("locale", locale);

    startTransition(async () => {
      const result = await submitContact(formData);

      if (result.success) {
        setSubmitted(true);
        form.reset();
        toast.success(t("toastSuccess"));
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        toast.danger(t("toastError"));
      }
    });
  };

  return (
    <section id="contact" className="scroll-mt-16 bg-band px-4 py-20 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <h2 className="headline-section text-foreground">
            <span className="block">{t("title")}</span>
            <span className="block headline-quiet">{t("titleAccent")}</span>
          </h2>
          <p className="lede mt-5 max-w-xl">{t("subtitle")}</p>

          <a
            className="group mt-10 inline-flex items-center gap-4 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
            // mailto, not a Gmail compose URL: it opens whatever mail app the
            // visitor actually uses.
            href="mailto:contact@hwagfu.dev"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-hue-blue/10 text-hue-blue dark:bg-hue-blue/15">
              <Mail className="h-5 w-5" aria-hidden />
            </span>
            <span>
              <span className="block text-sm text-muted-foreground">{t("directEmail")}</span>
              <span className="block text-lg text-foreground group-hover:underline underline-offset-4">
                contact@hwagfu.dev
              </span>
            </span>
          </a>
        </Reveal>

        <Reveal delay={0.08} className="rounded-[1.75rem] bg-tile p-6 sm:p-9">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                role="status"
                className="flex min-h-80 flex-col items-center justify-center text-center"
              >
                {/* Message sent: Jot hops. */}
                <Jot mood="happy" className="mb-4 size-32" />
                <h3 className="headline-card text-foreground">{t("successTitle")}</h3>
                <p className="mt-2 text-muted-foreground">{t("successBody")}</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    {t("nameLabel")}
                  </label>
                  <Input
                    id="contact-name"
                    name="name"
                    required
                    fullWidth
                    autoComplete="name"
                    disabled={isPending}
                    placeholder={t("namePlaceholder")}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    {t("emailLabel")}
                  </label>
                  <Input
                    id="contact-email"
                    name="email"
                    required
                    fullWidth
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    disabled={isPending}
                    placeholder={t("emailPlaceholder")}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    {t("messageLabel")}
                  </label>
                  <TextArea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    fullWidth
                    disabled={isPending}
                    placeholder={t("messagePlaceholder")}
                    className={`resize-none ${fieldClass}`}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  isPending={isPending}
                  className="w-full rounded-full bg-action font-medium text-white hover:bg-[var(--action-hover)]"
                >
                  {isPending ? (
                    <>
                      {/* Jot's dot bouncing stands in for a spinner. */}
                      <Jot mood="thinking" face={false} className="mr-1 size-6" />
                      {t("submitting")}
                    </>
                  ) : (
                    t("submit")
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}

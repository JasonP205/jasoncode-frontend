"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ui/ThemeToggle";
import LocaleSwitcher from "./ui/LocaleSwitcher";
import { Link, usePathname } from "@/i18n/navigation";
import Logo from "./ui/Logo";
import { isNavActive, navLinks } from "./ui/nav-links";

/**
 * SaaS header: a full-width paper bar with a hairline. Logo + wordmark on the
 * left, four destinations in the middle, settings and the one filled action
 * (Contact) on the right. A pink line along the bottom edge fills as the page
 * scrolls (CSS scroll timeline, no JS).
 */
export const Navigation = () => {
  const t = useTranslations("nav");
  const pathname = usePathname();
  return (
    <nav aria-label={t("primaryNav")} className="nav-bar sticky top-0 z-50 border-b border-border">
      <div className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          aria-label={t("logoAria")}
          className="group flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
        >
          <Logo variant="full" />
        </Link>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {navLinks
            .filter((link) => link.desktop)
            .map((link) => {
              const active = isNavActive(pathname, link);
              return (
                <li key={link.to}>
                  <Link
                    href={link.to}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-9 items-center rounded-lg px-3.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-hue-blue/[0.08] text-hue-blue"
                        : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
                    )}
                  >
                    {t(link.key)}
                  </Link>
                </li>
              );
            })}
        </ul>

        <div className="flex items-center gap-1">
          <LocaleSwitcher label={t("localeSwitcher")} />
          <ThemeToggle label={t("themeToggle")} />
          {/* Mobile keeps Contact in the bottom bar, so the header stays quiet. */}
          <Link href="/contact" className="btn-primary ml-2 hidden min-h-10! px-4! text-sm md:inline-flex">
            {t("contact")}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
      <span aria-hidden className="scroll-progress absolute inset-x-0 -bottom-px h-0.5 bg-pop" />
    </nav>
  );
};

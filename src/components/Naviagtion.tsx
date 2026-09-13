"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ui/ThemeToggle";
import LocaleSwitcher from "./ui/LocaleSwitcher";
import { Link, usePathname } from "@/i18n/navigation";
import Logo from "./ui/Logo";
import { isNavActive, navLinks } from "./ui/nav-links";

/**
 * Three destinations and one action. The logo is the way home; sign-in and
 * sign-up are gone until auth exists (they led to placeholder pages, yet the
 * sign-in pill was the loudest thing on every screen), and so is Utilities
 * until it has tools in it. Contact is the only filled control.
 */
export const Navigation = () => {
  const t = useTranslations("nav");
  const pathname = usePathname();
  return (
    <nav
      aria-label={t("primaryNav")}
      className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl backdrop-saturate-150"
    >
      <div className="relative mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-8">
        <Link
          href="/"
          aria-label={t("logoAria")}
          className="flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
        >
          <Logo />
        </Link>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
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
                      "text-sm transition-colors hover:text-foreground",
                      active ? "font-medium text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {t(link.key)}
                  </Link>
                </li>
              );
            })}
        </ul>

        <div className="flex items-center gap-1 sm:gap-2">
          <LocaleSwitcher label={t("localeSwitcher")} />
          <ThemeToggle label={t("themeToggle")} />
          {/* Mobile keeps Contact in the bottom bar, so the header stays quiet. */}
          <Link
            href="/contact"
            className="btn-primary ml-2 hidden min-h-9! px-4! text-sm md:inline-flex"
          >
            {t("contact")}
          </Link>
        </div>
      </div>
    </nav>
  );
};

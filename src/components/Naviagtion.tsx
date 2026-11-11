"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ui/ThemeToggle";
import LocaleSwitcher from "./ui/LocaleSwitcher";
import { Link, usePathname } from "@/i18n/navigation";
import Logo from "./ui/Logo";
import SoundToggle from "./ui/sound/SoundToggle";
import { isNavActive, navLinks } from "./ui/nav-links";

/**
 * A floating glass capsule: logo, four destinations, settings and the one
 * filled action (Contact). A hairline along its bottom edge fills with the
 * six stone colours as the page scrolls — the reader's place in the stream
 * of time (CSS scroll timeline, no JS).
 *
 * The outer bar is transparent and click-through, so the home page's 3D
 * world shows (and stays clickable) around the capsule.
 */
export const Navigation = () => {
  const t = useTranslations("nav");
  const pathname = usePathname();
  return (
    <nav
      aria-label={t("primaryNav")}
      className="pointer-events-none sticky top-0 z-50 px-3 pt-3 sm:px-5"
    >
      <div className="glass-capsule pointer-events-auto relative mx-auto flex h-14 w-full max-w-6xl items-center justify-between overflow-hidden rounded-full pr-2 pl-4 sm:pl-5">
        <Link
          href="/"
          aria-label={t("logoAria")}
          className="group flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
        >
          <Logo />
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
                      "relative flex h-9 items-center gap-2 rounded-full px-3.5 text-sm transition-colors",
                      active
                        ? "bg-foreground/[0.07] font-medium text-foreground"
                        : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
                    )}
                  >
                    {active && <span aria-hidden className="stone-gem size-2.5 [--gem:var(--hue-blue)]" />}
                    {t(link.key)}
                  </Link>
                </li>
              );
            })}
        </ul>

        <div className="flex items-center gap-1">
          <SoundToggle onLabel={t("soundOn")} offLabel={t("soundOff")} />
          <LocaleSwitcher label={t("localeSwitcher")} />
          <ThemeToggle label={t("themeToggle")} />
          {/* Mobile keeps Contact in the bottom bar, so the header stays quiet. */}
          <Link href="/contact" className="btn-primary ml-1 hidden min-h-10! px-4! text-sm md:inline-flex">
            {t("contact")}
          </Link>
        </div>

        <span aria-hidden className="absolute inset-x-6 bottom-0 h-px bg-foreground/[0.06]" />
        <span aria-hidden className="time-progress stream-gradient absolute inset-x-6 bottom-0 h-[2px] rounded-full" />
      </div>
    </nav>
  );
};

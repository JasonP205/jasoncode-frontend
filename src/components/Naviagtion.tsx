"use client";

import { useTranslations } from "next-intl";
import { Button } from "@heroui/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ui/ThemeToggle";
import LocaleSwitcher from "./ui/LocaleSwitcher";
import { Link, usePathname } from "@/i18n/navigation";
import logo from "@/app/logo.png";

// Mirrors `BottomNav.tsx`, which carries these same routes on mobile.
const navLinks = [
  { to: "/", key: "home" },
  { to: "/services", key: "services" },
  { to: "/library", key: "library" },
  { to: "/utils", key: "utils" },
  { to: "/contact", key: "contact" },
] as const;

const isActiveLink = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

export const Navigation = () => {
  const t = useTranslations("nav");
  const pathname = usePathname();
  return (
    <nav
      aria-label={t("primaryNav")}
      className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md"
    >
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-8">
        <Link
          href="/"
          aria-label={t("logoAria")}
          className="flex items-center gap-2 font-serif text-2xl tracking-tight text-foreground sm:text-3xl"
        >
          {/* Smaller on mobile: at 64px the logo alone set the header height,
              eating vertical space on the shortest screens. */}
          <span className="flex h-12 w-12 shrink-0 items-center justify-center sm:h-16 sm:w-16">
            <Image
              src={logo}
              alt="Jason Dev Logo"
              width={64}
              height={64}
              priority
              sizes="64px"
              className="h-full w-full object-contain"
            />
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 transform items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active = isActiveLink(pathname, link.to);
            return (
              <Link
                key={link.to}
                href={link.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <LocaleSwitcher label={t("localeSwitcher")} />
          <ThemeToggle label={t("themeToggle")} />
          <Link href="/sign-up">
            <Button variant="outline">{t("signUp")}</Button>
          </Link>
          <Link href="/sign-in">
            <Button>{t("signIn")}</Button>
          </Link>
        </div>

        {/* Mobile: the five routes live in `BottomNav`, so the header only
            keeps the settings that have no place in a thumb bar. */}
        <div className="flex items-center gap-1 md:hidden">
          <LocaleSwitcher label={t("localeSwitcher")} />
          <ThemeToggle label={t("themeToggle")} />
          {/* Ghost, not solid: a filled pill made sign-in the highest-
              contrast element on every mobile screen, outranking the page's
              own content and its contact CTA. */}
          <Link href="/sign-in">
            <Button size="sm" variant="ghost">
              {t("signIn")}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

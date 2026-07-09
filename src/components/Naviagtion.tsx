"use client";

import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { Button } from "@heroui/react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ui/ThemeToggle";
import LocaleSwitcher from "./ui/LocaleSwitcher";
import { Link, usePathname } from "@/i18n/navigation";
import logo from "@/app/logo.png";

// The mobile drawer pulls in HeroUI's Drawer + framer-motion. It's only needed
// once the user opens the menu, so keep it out of the initial hydration bundle.
// The placeholder keeps the trigger's footprint stable until the chunk lands.
const MobileNavation = dynamic(() => import("./ui/MobileNav"), {
  ssr: false,
  loading: () => (
    <span
      aria-hidden
      className="md:hidden inline-flex h-10 w-10 items-center justify-center"
    >
      <Menu size={24} />
    </span>
  ),
});

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
    <nav className="z-50 sticky top-0 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="flex justify-between items-center px-4 sm:px-8  max-w-7xl mx-auto w-full relative">
        <Link
          href="/"
          aria-label={t("logoAria")}
          className="text-2xl sm:text-3xl tracking-tight font-serif text-foreground flex items-center gap-2"
        >
          <div className="w-16 h-16 shrink-0 flex items-center justify-center">
            <Image
              src={logo}
              alt="Jason Dev Logo"
              width={64}
              height={64}
              priority
              sizes="64px"
              className="w-full h-full object-contain"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
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

        <div className="hidden md:flex items-center gap-2">
          <LocaleSwitcher label={t("localeSwitcher")} />
          <ThemeToggle label={t("themeToggle")} />
          <Link href="/sign-up">
            <Button variant="outline">{t("signUp")}</Button>
          </Link>
          <Link href="/sign-in">
            <Button>{t("signIn")}</Button>
          </Link>
        </div>
        <div className="flex items-center gap-1 md:hidden">
          <LocaleSwitcher label={t("localeSwitcher")} />
          <ThemeToggle label={t("themeToggle")} />
          <MobileNavation />
        </div>
      </div>
    </nav>
  );
};

"use client";

import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { Button, Drawer } from "@heroui/react";
import MotionDiv from "./ui/motionDiv";
import Image from "next/image";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ui/ThemeToggle";
import LocaleSwitcher from "./ui/LocaleSwitcher";
import { Link, usePathname } from "@/i18n/navigation";
import logo from "@/app/logo.png";

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

const MobileNavation = () => {
  const t = useTranslations("nav");
  const pathname = usePathname();
  return (
    <Drawer>
      <Button variant="ghost" isIconOnly className="md:hidden z-140">
        <Menu size={24} />
      </Button>
      <Drawer.Backdrop>
        <Drawer.Content className="z-1000" placement="right">
          <Drawer.Dialog>
            <Drawer.Header>
              <Drawer.Heading>
                <Link
                  href="/"
                  className="text-2xl sm:text-3xl tracking-tight font-serif text-foreground flex items-center gap-2"
                >
                  <div className="w-16 h-16 shrink-0 flex items-center justify-center">
                    <Image
                      src={logo}
                      alt="Jason Dev Logo"
                      width={64}
                      height={64}
                      sizes="64px"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="font-serif leading-relaxed text-xl">
                    Jason Dev
                  </span>
                </Link>
              </Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <div className="flex flex-col gap-5">
                {navLinks.map((link, index) => (
                  <MotionDiv
                    key={link.to}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.to}
                      aria-current={
                        isActiveLink(pathname, link.to) ? "page" : undefined
                      }
                      className={cn(
                        "text-lg font-serif block py-1 transition-opacity hover:opacity-70",
                        isActiveLink(pathname, link.to)
                          ? "text-foreground font-semibold"
                          : "text-foreground/70",
                      )}
                    >
                      {t(link.key)}
                    </Link>
                  </MotionDiv>
                ))}

                <MotionDiv
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="mt-4 pt-6 border-t flex flex-col gap-3 border-border"
                >
                  <Link href="/sign-in" className="block">
                    <Button fullWidth>{t("signIn")}</Button>
                  </Link>
                  <Link href="/sign-up" className="block">
                    <Button variant="outline" fullWidth>
                      {t("signUp")}
                    </Button>
                  </Link>
                </MotionDiv>
              </div>
            </Drawer.Body>
            <Drawer.Footer />
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
};

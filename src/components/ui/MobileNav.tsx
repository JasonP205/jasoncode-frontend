"use client";

import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { Button, Drawer } from "@heroui/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import MotionDiv from "./motionDiv";
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

export default function MobileNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  return (
    <Drawer>
      <Button
        aria-label="Toggle navigation menu"
        variant="ghost"
        isIconOnly
        className="md:hidden z-140"
      >
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
}

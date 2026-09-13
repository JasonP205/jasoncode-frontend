"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/navigation";
import { isNavActive, navLinks } from "./nav-links";

/**
 * Mobile navigation: the four places a visitor needs, in a thumb-reachable
 * bar. Shares its list with the desktop header via `nav-links.ts`.
 */
export default function BottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const links = navLinks.filter((link) => link.mobile);

  return (
    <nav
      aria-label={t("primaryNav")}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/85 backdrop-blur-xl backdrop-saturate-150 md:hidden"
    >
      {/* The inset padding sits inside the bar so its background still covers
          the home-indicator area on iOS. */}
      <ul
        className="grid pb-[env(safe-area-inset-bottom)]"
        style={{ gridTemplateColumns: `repeat(${links.length}, minmax(0, 1fr))` }}
      >
        {links.map((link) => {
          const active = isNavActive(pathname, link);
          const { Icon } = link;
          return (
            <li key={link.to}>
              <Link
                href={link.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-1 transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} aria-hidden />
                <span className={cn("text-[0.6875rem] leading-none", active && "font-medium")}>
                  {t(link.key)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

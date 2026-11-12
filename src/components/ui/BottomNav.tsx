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
      className="nav-bar fixed inset-x-0 bottom-0 z-50 border-t border-border px-2 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] md:hidden"
    >
      {/* A docked tab bar; its padding clears the iOS home indicator. */}
      <ul
        className="grid gap-1"
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
                  "relative flex h-12 flex-col items-center justify-center gap-1 rounded-xl transition-colors",
                  active ? "text-hue-blue" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {/* The active tab's pink tick — the bar's one surprise. */}
                {active && <span aria-hidden className="absolute top-0 h-0.5 w-6 rounded-full bg-pop" />}
                <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} aria-hidden />
                <span className={cn("text-[0.6875rem] leading-none", active && "font-semibold")}>
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

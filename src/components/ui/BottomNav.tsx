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
      className="glass-capsule fixed inset-x-3 bottom-[calc(0.5rem+env(safe-area-inset-bottom))] z-50 rounded-[1.75rem] p-1.5 md:hidden"
    >
      {/* A floating capsule like the header; it sits above the iOS home
          indicator instead of covering it. */}
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
                  "flex h-12 flex-col items-center justify-center gap-1 rounded-[1.25rem] transition-colors",
                  active ? "bg-foreground/[0.07] text-foreground" : "text-muted-foreground hover:text-foreground",
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

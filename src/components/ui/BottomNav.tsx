"use client";

import { useTranslations } from "next-intl";
import { Home, Layers, BookOpen, Wrench, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/navigation";

/**
 * Mobile navigation. Replaces the slide-out drawer: the drawer cost two taps
 * to reach any page and hid where you currently were, while the five routes
 * fit a thumb-reachable bar exactly.
 *
 * Mirrors the desktop links in `Naviagtion.tsx` — keep the two lists in step.
 */
const navLinks = [
  { to: "/", key: "home", Icon: Home },
  { to: "/services", key: "services", Icon: Layers },
  { to: "/library", key: "library", Icon: BookOpen },
  { to: "/utils", key: "utils", Icon: Wrench },
  { to: "/contact", key: "contact", Icon: Mail },
] as const;

const isActiveLink = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

export default function BottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("primaryNav")}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg md:hidden"
    >
      {/* The inset padding sits inside the bar so its background still covers
          the home-indicator area on iOS. */}
      <ul className="grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
        {navLinks.map(({ to, key, Icon }) => {
          const active = isActiveLink(pathname, to);
          return (
            <li key={to}>
              <Link
                href={to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-14 flex-col items-center justify-center gap-1 transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {/* The active marker rides the top edge rather than tinting a
                    pill, so it reads at a glance without adding a colour. */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0 top-0 mx-auto h-0.5 w-8 rounded-full transition-opacity",
                    active ? "bg-foreground opacity-100" : "opacity-0",
                  )}
                />
                <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
                <span className="text-[0.625rem] leading-none tracking-tight">
                  {t(key)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

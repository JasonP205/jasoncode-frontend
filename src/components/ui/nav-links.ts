import { BookOpen, Home, LayoutGrid, Layers, Mail, type LucideIcon } from "lucide-react";

export interface NavLink {
  to: string;
  /** Key in the `nav` message namespace. */
  key: "home" | "projects" | "services" | "library" | "contact";
  Icon: LucideIcon;
  /** Shown in the desktop header (Contact is a button there, Home is the logo). */
  desktop: boolean;
  /** Shown in the mobile bottom bar. */
  mobile: boolean;
}

/**
 * The single source for both navs. Projects and the component library both
 * live under /library, so each link names the prefixes it owns rather than
 * relying on `startsWith(to)`.
 */
export const navLinks: NavLink[] = [
  { to: "/", key: "home", Icon: Home, desktop: false, mobile: true },
  { to: "/library/projects", key: "projects", Icon: LayoutGrid, desktop: true, mobile: true },
  { to: "/services", key: "services", Icon: Layers, desktop: true, mobile: true },
  { to: "/library/components", key: "library", Icon: BookOpen, desktop: true, mobile: false },
  { to: "/contact", key: "contact", Icon: Mail, desktop: false, mobile: true },
];

export function isNavActive(pathname: string, link: NavLink): boolean {
  switch (link.key) {
    case "home":
      return pathname === "/";
    case "projects":
      return pathname.startsWith("/library/projects");
    case "library":
      // Component index, each library's own page, and the /library hub.
      return pathname.startsWith("/library") && !pathname.startsWith("/library/projects");
    default:
      return pathname.startsWith(link.to);
  }
}

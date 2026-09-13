import Icon from "@/components/ui/icon";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "@/components/ui/Logo";

const socialLinks = [
  { name: "GitHub", url: "https://github.com/JasonP205", icon: "mdi:github" },
  { name: "Facebook", url: "https://facebook.com/hoangphuc05", icon: "mdi:facebook" },
  { name: "Zalo", url: "https://zalo.me/0798020513", icon: "simple-icons:zalo" },
];

/**
 * One compact band: who, where to go, how to reach. It used to be four columns
 * with a live link-preview card for the partner, which ran ~1000px tall on a
 * phone and pulled in someone else's English description.
 */
const Footer = () => {
  const t = useTranslations("footer");
  // Keyword-rich internal anchors — these labels double as SEO signals for the
  // pages they point to, so keep them descriptive rather than generic.
  const quickLinks = [
    { href: "/library/projects", label: t("quickLinks.projects") },
    { href: "/services", label: t("quickLinks.services") },
    { href: "/services/students", label: t("quickLinks.students") },
    { href: "/library/components", label: t("quickLinks.library") },
    { href: "/cv", label: t("quickLinks.cv") },
    { href: "/contact", label: t("quickLinks.contact") },
  ];

  return (
    <footer className="border-t border-border/60 bg-band px-4 sm:px-8">
      <div className="mx-auto max-w-6xl py-12 sm:py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Logo variant="full" />
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {t("tagline")}
            </p>
            <div className="mt-5 flex gap-2">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-tile hover:text-foreground focus-visible:outline-2 focus-visible:outline-foreground"
                >
                  <Icon icon={item.icon} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label={t("quickLinksTitle")}>
            <ul className="grid grid-cols-1 gap-x-12 gap-y-3 text-sm sm:grid-cols-2">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border/60 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()} {t("rights")}
          </span>
          <span className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="mailto:contact@hwagfu.dev" className="hover:text-foreground">
              contact@hwagfu.dev
            </a>
            <span>
              {t("partner")}:{" "}
              <a
                href="https://www.hugowishpax.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline underline-offset-4"
              >
                Hugo Studio
              </a>
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

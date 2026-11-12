import Icon from "@/components/ui/icon";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "@/components/ui/Logo";
import LocalClock from "@/components/ui/LocalClock";

const socialLinks = [
  { name: "GitHub", url: "https://github.com/JasonP205", icon: "mdi:github" },
  { name: "Facebook", url: "https://facebook.com/hoangphuc05", icon: "mdi:facebook" },
  { name: "Zalo", url: "https://zalo.me/0798020513", icon: "simple-icons:zalo" },
];

/**
 * A navy band (in both themes) closing every page: the signature with its
 * pink stop, links, socials and a live clock for Ho Chi Minh City. Text is
 * paper on navy; pink only for hovers and the stop.
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
    <footer className="dark bg-[color-mix(in_oklab,var(--brand)_88%,black)] text-foreground">
      {/* `dark` scopes the dark tokens (paper ink, pink as text) to the band. */}
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-8 sm:px-8 sm:pt-20">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm text-muted-foreground">{t("streamEnd")}</p>
            <p className="text-[clamp(2.75rem,1rem+7vw,6rem)] leading-[1.15] font-bold tracking-[-0.045em] select-none">
              Jason Dev<span className="text-pop">.</span>
            </p>
          </div>
          <Link href="/contact" className="btn-primary self-start md:self-auto">
            {t("quickLinks.contact")}
          </Link>
        </div>

        <div className="grid gap-10 pt-12 md:grid-cols-[1.2fr_1.3fr_1fr]">
          <div className="max-w-xs">
            <Logo variant="full" />
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{t("tagline")}</p>
            <div className="mt-5 flex gap-2">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-muted-foreground ring-1 ring-white/10 transition-colors hover:text-pop focus-visible:outline-2 focus-visible:outline-foreground"
                >
                  <Icon icon={item.icon} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label={t("quickLinksTitle")}>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted-foreground transition-colors hover:text-pop">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="text-sm">
            <p className="text-muted-foreground">{t("localTime")}</p>
            <LocalClock className="mt-1 block font-mono text-3xl font-medium tracking-tight text-foreground tabular-nums" />
            <a
              href="mailto:contact@hwagfu.dev"
              className="mt-5 inline-block text-foreground underline-offset-4 hover:text-pop hover:underline"
            >
              contact@hwagfu.dev
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()} {t("rights")}
          </span>
          <span>
            {t("partner")}:{" "}
            <a
              href="https://www.hugowishpax.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-4 hover:text-pop hover:underline"
            >
              Hugo Studio
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

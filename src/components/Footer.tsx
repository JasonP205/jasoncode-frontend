import Icon from "@/components/ui/icon";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "@/components/ui/Logo";
import KineticHeadline from "@/components/ui/kinetic/KineticHeadline";
import LocalClock from "@/components/ui/LocalClock";

const socialLinks = [
  { name: "GitHub", url: "https://github.com/JasonP205", icon: "mdi:github" },
  { name: "Facebook", url: "https://facebook.com/hoangphuc05", icon: "mdi:facebook" },
  { name: "Zalo", url: "https://zalo.me/0798020513", icon: "simple-icons:zalo" },
];

/** The six stone colours, in time order (same as the home timeline). */
const GEMS = [
  "var(--hue-blue)",
  "var(--hue-purple)",
  "var(--hue-green)",
  "var(--hue-orange)",
  "var(--hue-pink)",
  "var(--stone-gold)",
];

/**
 * The end of the stream: a floating glass panel. Six stones on a line of
 * time open it, then the springy signature, links, and a live clock for
 * Ho Chi Minh City. The space around the panel is transparent so the home
 * page's 3D world runs right to the bottom.
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
    <footer className="px-3 pt-6 pb-4 sm:px-5 sm:pb-5">
      <div className="glass-capsule relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] px-6 py-10 sm:rounded-[2.5rem] sm:px-12 sm:py-12">
        {/* Six stones on the line of time. */}
        <div aria-hidden className="relative mb-10 flex items-center justify-between">
          <span className="stream-gradient absolute inset-x-0 top-1/2 h-px -translate-y-1/2 opacity-60" />
          {GEMS.map((gem, i) => (
            <span
              key={i}
              className="relative flex size-9 items-center justify-center rounded-full bg-background ring-1 ring-border sm:size-11"
            >
              <span
                className="stone-gem size-4 transition-transform duration-500 ease-out hover:-translate-y-1 hover:scale-125 sm:size-5"
                style={{ ["--gem" as string]: gem, filter: `drop-shadow(0 0 6px ${gem})` }}
              />
            </span>
          ))}
        </div>

        <p className="mb-2 text-sm text-muted-foreground">{t("streamEnd")}</p>
        {/* The signature: the same springy letters as the page heroes. */}
        <KineticHeadline
          as="p"
          intro={false}
          className="mb-12 text-[clamp(3rem,1rem+9vw,8rem)] leading-[1.15] font-bold tracking-[-0.045em] text-foreground select-none"
          segments={[{ text: "Jason " }, { text: "Dev.", accent: true }]}
        />

        <div className="grid gap-10 md:grid-cols-[1.2fr_1.3fr_1fr]">
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
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/[0.05] text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-foreground"
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
                  <Link href={item.href} className="text-muted-foreground transition-colors hover:text-foreground">
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
              className="mt-5 inline-block text-foreground underline-offset-4 hover:underline"
            >
              contact@hwagfu.dev
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border/60 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()} {t("rights")}
          </span>
          <span>
            {t("partner")}:{" "}
            <a
              href="https://www.hugowishpax.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-4 hover:underline"
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

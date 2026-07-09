import Icon from "@/components/ui/icon";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import logo from "@/app/logo.png";
import Url from "@/components/ui/UrlPreview"
const Footer = () => {
  const t = useTranslations("footer");
  // Keyword-rich internal anchors — these labels double as SEO signals for the
  // pages they point to, so keep them descriptive rather than generic.
  const quickLinks = [
    { href: "/", label: t("quickLinks.home") },
    { href: "/library/projects", label: t("quickLinks.projects") },
    { href: "/services", label: t("quickLinks.services") },
    { href: "/contact", label: t("quickLinks.contact") },
    { href: "/utils", label: t("quickLinks.utils") },
  ];
  const socialLinks = [
    {
      id: 1,
      name: "GitHub",
      url: "https://github.com/JasonP205",
      icon: "mdi:github",
    },
    {
      id: 2,
      name: "Facebook",
      url: "https://facebook.com/hoangphuc05",
      icon: "mdi:facebook",
    },
    {
      id: 3,
      name: "Zalo",
      url: "https://zalo.me/0798020513",
      icon: "simple-icons:zalo",
    },
  ];

  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div className="space-y-4">
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

            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              Full-stack developer crafting modern, accessible and
              high-performance web applications.
            </p>

            <div className="flex gap-2">
              {socialLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all hover:bg-foreground hover:text-background"
                >
                  <Icon icon={item.icon} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 font-semibold">{t("quickLinksTitle")}</h3>

            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold">Contact</h3>

            <div className="space-y-3 text-sm text-muted-foreground">
              <a
                href="mailto:contact@hwagfu.dev"
                className="flex items-center gap-2 hover:text-foreground"
              >
                <Icon icon="solar:letter-linear" className="h-4 w-4" />
                contact@hwagfu.dev
              </a>

              <div className="flex items-center gap-2">
                <Icon icon="solar:global-linear" className="h-4 w-4" />
                hwagfu.dev
              </div>
            </div>
          </div>

          {/* Partner */}
          <div>
            <h3 className="mb-4 font-semibold">{t("partner")}</h3>

            <Url url="https://www.hugowishpax.studio" />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row">
          <span>
            © {new Date().getFullYear()} {t("rights")}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Geist_Mono, Playfair_Display } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildAlternates, ogLocaleFields, SITE_URL } from "@/lib/seo";
import { Navigation } from "@/components/Naviagtion";
import { Toast } from "@heroui/react";
import "../globals.css";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import ThemeProvider, { themeInitScript } from "@/components/ui/ThemeProvider";
import { routing } from "@/i18n/routing";

// Body / UI font — matches the font HeroUI's theme expects, with full
// Vietnamese glyph coverage so diacritics render correctly.
const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

// Display / heading serif used by every `font-serif` headline.
const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-serif-display",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: "metadata" });
  const alternates = buildAlternates(safeLocale, "/");

  return {
    metadataBase: new URL(SITE_URL),

    title: {
      default: t("homeTitle"),
      template: "%s | Jason Dev",
    },

    description: t("homeDescription"),

    applicationName: "Jason Dev Portfolio",

    authors: [{ name: "Phan Hoàng Phúc", url: SITE_URL }],

    creator: "Phan Hoàng Phúc",
    publisher: "Phan Hoàng Phúc",

    keywords: [
      "Web Developer",
      "Frontend Developer",
      "Portfolio",
      "React",
      "Next.js",
      "Phan Hoàng Phúc",
      "Jason Dev",
      "hwagfu dev",
      "freelance web developer",
      "dịch vụ làm website",
      "tối ưu seo website",
      "tối ưu code website",
      "thiết kế hệ thống database",
      "lập trình web",
      "dự án cá nhân",
      "thiết kế web",
      "phát triển web",
      "hoàng phúc",
      "Hoàng Phúc",
      "Jason Phan",
    ],

    referrer: "origin-when-cross-origin",

    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },

    alternates,

    openGraph: {
      type: "website",
      ...ogLocaleFields(safeLocale),
      url: alternates?.canonical as string,
      siteName: "Jason Dev Portfolio",
      title: t("homeTitle"),
      description: t("homeDescription"),
      images: [
        {
          url: "/opengraph-image.jpg",
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: "Jason Dev — Freelance Web Developer",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: t("homeTitle"),
      description: t("homeDescription"),
      images: ["/twitter-image.jpg"],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    appleWebApp: {
      title: "Jason Dev",
      capable: true,
      statusBarStyle: "default",
    },

    manifest: "/manifest.json",

    category: "technology",
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // Enable static rendering for this locale.
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        beVietnam.variable,
        playfair.variable,
        geistMono.variable,
      )}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Anti-FOUC: applies the stored theme before first paint. Server-
            rendered on purpose so it doesn't trip React's client-script warning. */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        {/* The hero poster preload comes from next/image `priority` (with a
            responsive imagesrcset) — no manual <link rel=preload> needed; a
            second one would double-download the raw file. */}
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider>
          <ThemeProvider>
            <Toast.Provider placement="top end" />


            <Navigation />

            <main className="flex-1">{children}</main>

            <Footer />

            <Analytics />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

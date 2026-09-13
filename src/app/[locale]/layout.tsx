import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Geist_Mono } from "next/font/google";
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
import ThemeProvider from "@/components/ui/ThemeProvider";
import BottomNav from "@/components/ui/BottomNav";
import MotionProvider from "@/components/ui/MotionProvider";
import { routing } from "@/i18n/routing";

// The only text family on the site: headlines (600) and body (400/500) alike,
// with full Vietnamese glyph coverage. A display serif used to sit on top of
// it; its tight metrics let stacked diacritics collide with the line above.
const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
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
      "dịch vụ thiết kế website",
      "thiết kế website chuyên nghiệp",
      "làm website doanh nghiệp",
      "thuê lập trình viên web",
      "freelancer lập trình web Việt Nam",
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
          alt: "Jason Dev – Một chút thiết kế. Một chút lập trình. Thành một sản phẩm.",
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
        geistMono.variable,
      )}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <NextIntlClientProvider>
          <ThemeProvider>
            {/* ThemeProvider also writes the anti-FOUC theme script into the
                server HTML (see themeInitScript). */}
            <MotionProvider>
              <Toast.Provider placement="top end" />

              <Navigation />

              <main className="flex-1">{children}</main>

              <Footer />

              <BottomNav />

              <Analytics />
            </MotionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

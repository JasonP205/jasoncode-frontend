import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Navigation } from "@/components/Naviagtion";
import { Toast } from "@heroui/react";
import "./globals.css";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://hwagfu.dev"),

  title: {
    default: "Jason Dev | Freelance Web Developer",
    template: "%s | Jason Dev",
  },

  description:
    "Trang cá nhân và dịch vụ freelance của Phan Hoàng Phúc (Jason Dev), chuyên làm website, tối ưu SEO, tối ưu web sẵn có và thiết kế hệ thống dữ liệu dễ mở rộng.",

  applicationName: "Jason Dev Portfolio",

  authors: [
    {
      name: "Phan Hoàng Phúc",
      url: "https://hwagfu.dev",
    },
  ],

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

  alternates: {
    canonical: "/",
    languages: {
      "vi-VN": "/",
    },
  },

  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://hwagfu.dev",
    siteName: "Jason Dev Portfolio",

    title: "Jason Dev | Phan Hoàng Phúc - Web Developer",

    description:
      "Trang cá nhân và dịch vụ freelance của Phan Hoàng Phúc (Jason Dev), chuyên làm website, tối ưu SEO, tối ưu web sẵn có và thiết kế hệ thống dữ liệu.",
  },

  twitter: {
    card: "summary_large_image",

    title: "Jason Dev | Phan Hoàng Phúc - Web Developer",

    description:
      "Trang cá nhân và dịch vụ freelance của Phan Hoàng Phúc (Jason Dev), chuyên làm website, tối ưu SEO, tối ưu web sẵn có và thiết kế hệ thống dữ liệu.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
        <Toast.Provider placement="top end" />

        <Navigation />

        <main className="flex-1">{children}</main>

        <Footer />

        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Navigation } from "@/components/Naviagtion";
import { Toast } from "@heroui/react";
import "./globals.css";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { Analytics } from '@vercel/analytics/next';


const inter = Inter({subsets:['latin'],variable:'--font-sans'});

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
};

export const metadata: Metadata = {
  metadataBase: new URL("https://hwagfu.dev"),
  title: {
    default: "Jason Dev | Phan Hoàng Phúc - Web Developer",
    template: "%s | Jason Dev",
  },
  description:
    "Trang web portfolio cá nhân của Phan Hoàng Phúc (Jason Dev). Nơi trưng bày các dự án, kỹ năng và kinh nghiệm lập trình Web hiện đại.",
  applicationName: "Jason Dev Portfolio",
  authors: [{ name: "Phan Hoàng Phúc", url: "https://hwagfu.dev" }],
  generator: "Next.js",
  keywords: [
    "Web Developer",
    "Frontend Developer",
    "Portfolio",
    "React",
    "Next.js",
    "Phan Hoàng Phúc",
    "Jason Dev",
    "hwagfu dev",
    "lập trình web",
    "dự án cá nhân",
    "thiết kế web",
    "phát triển web",
  ],
  referrer: "origin-when-cross-origin",
  creator: "Phan Hoàng Phúc",
  publisher: "Phan Hoàng Phúc",
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
    title: "Jason Dev | Phan Hoàng Phúc - Web Developer",
    description:
      "Trang web portfolio cá nhân của Phan Hoàng Phúc (Jason Dev). Nơi trưng bày các dự án, kỹ năng và kinh nghiệm lập trình Web hiện đại.",
    url: "https://hwagfu.dev",
    siteName: "Jason Dev Portfolio",
    images: [
      {
        url: "/webScreenshot.png",
        width: 1200,
        height: 630,
        alt: "Jason Dev Portfolio Open Graph Image",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jason Dev | Phan Hoàng Phúc - Web Developer",
    description:
      "Trang web portfolio cá nhân của Phan Hoàng Phúc (Jason Dev). Nơi trưng bày các dự án, kỹ năng và kinh nghiệm lập trình Web hiện đại.",
    images: ["/webScreenshot.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/icon0.svg", type: "image/svg+xml" },
      { url: "/favicon/icon1.png", type: "image/png" },
    ],
    apple: "/favicon/apple-icon.png",
  },
  manifest: "/favicon/manifest.json",
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
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
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

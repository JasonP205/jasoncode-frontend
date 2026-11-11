import { libraryOg } from "@/lib/og/page-image";
import { routing } from "@/i18n/routing";
import { libraries } from "@/data/libraries";

// Generated Open Graph card: the package name and tagline (src/lib/og/render.tsx).
export const alt = "Jason Dev – open-source React library";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => libraries.map((l) => ({ locale, libraryName: l.slug })));
}

export default function Image({ params }: { params: Promise<{ locale: string; libraryName: string }> }) {
  return libraryOg(params);
}

import { localeParams, pageOg } from "@/lib/og/page-image";

// Generated Twitter card (see src/lib/og/render.tsx). Child routes inherit it
// unless they have their own.
export const alt = "Jason Dev – Phan Hoàng Phúc, Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const generateStaticParams = localeParams;

export default function Image({ params }: { params: Promise<{ locale: string }> }) {
  return pageOg(params, "contact");
}

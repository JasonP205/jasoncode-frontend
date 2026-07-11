import { notFound } from "next/navigation";

// Catch-all for URLs that match no real route (e.g. /sf). Without this,
// unmatched paths never enter the [locale] segment, so Next.js renders its
// default 404 instead of [locale]/not-found.tsx.
// See https://next-intl.dev/docs/environments/error-files
export default function CatchAllPage() {
  notFound();
}

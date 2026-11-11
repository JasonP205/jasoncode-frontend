import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16 renamed Middleware to Proxy. next-intl's middleware handler works
// unchanged here — it detects the locale and rewrites/redirects accordingly.
export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals, any path containing a dot (static files),
  // and the root-level metadata image/file routes. The dynamic metadata routes
  // (opengraph-image, twitter-image, icon, …) resolve to extension-less paths
  // like `/opengraph-image`, so the dot rule alone wouldn't exclude them and the
  // locale middleware would otherwise rewrite them to `/vi/...` → 404. The
  // generated OG/Twitter cards live under [locale] at any depth
  // (`/vi/opengraph-image`, `/en/cv/twitter-image`), so those are skipped
  // wherever they appear — next-intl must not strip the `/vi` from them.
  matcher:
    "/((?!api|_next|_vercel|icon|apple-icon|sitemap|robots|manifest|.*opengraph-image|.*twitter-image|.*\\..*).*)",
};

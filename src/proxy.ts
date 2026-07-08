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
  // locale middleware would otherwise rewrite them to `/vi/...` → 404.
  matcher:
    "/((?!api|_next|_vercel|opengraph-image|twitter-image|icon|apple-icon|sitemap|robots|manifest|.*\\..*).*)",
};

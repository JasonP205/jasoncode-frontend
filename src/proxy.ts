import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16 renamed Middleware to Proxy. next-intl's middleware handler works
// unchanged here — it detects the locale and rewrites/redirects accordingly.
export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals, and any path containing a dot (static files).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: [
    "192.168.0.105"
  ],
  // Projects moved under the /library hub — keep old links working.
  async redirects() {
    return [
      { source: "/projects", destination: "/library/projects", permanent: true },
      {
        source: "/projects/:projectId",
        destination: "/library/projects/:projectId",
        permanent: true,
      },
      {
        source: "/en/projects",
        destination: "/en/library/projects",
        permanent: true,
      },
      {
        source: "/en/projects/:projectId",
        destination: "/en/library/projects/:projectId",
        permanent: true,
      },
    ];
  },
  transpilePackages: ["@hwagfu/images"],
};

export default withNextIntl(nextConfig);

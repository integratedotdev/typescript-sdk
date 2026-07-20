import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "app.integrate.dev" }],
        destination: "https://integrate.dev/dashboard/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/docs/:path*.mdx",
        destination: "/llms.mdx/:path*",
      },
    ];
  },
};

export default nextConfig;

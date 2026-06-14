import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { withMicrofrontends } from "@vercel/microfrontends/next/config";
import { createMDX } from "fumadocs-mdx/next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: "/docs/:path*.mdx",
        destination: "/llms.mdx/:path*",
      },
    ];
  },
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
};

export default withMicrofrontends(withMDX(config));

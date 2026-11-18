import type { NextConfig } from "next";

/**
 * Public URL used for canonical links, Open Graph, sitemap and robots.
 * Priority: explicit NEXT_PUBLIC_SITE_URL → Vercel's production domain (set automatically
 * on Vercel builds) → localhost for local dev. Inlined at build time so server and client agree.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  "http://localhost:3000";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: { NEXT_PUBLIC_SITE_URL: siteUrl },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  transpilePackages: ["three"],
};

export default nextConfig;

import type { NextConfig } from "next";

/**
 * Next.js configuration for Banking (App Router).
 */
const nextConfig: NextConfig = {
  bundlePagesRouterDependencies: true,

  cacheComponents: true,

  compress: true,

  devIndicators: {
    position: "bottom-right",
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
    serverActions: {
      bodySizeLimit: "10mb",
    },
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    typedEnv: true,
  },

  headers: () => [
    {
      headers: [
        {
          key: "X-DNS-Prefetch-Control",
          value: "on",
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        {
          key: "X-Frame-Options",
          value: "SAMEORIGIN",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "Referrer-Policy",
          value: "origin-when-cross-origin",
        },
        {
          key: "X-XSS-Protection",
          value: "1; mode=block",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
      source: "/:path*",
    },
  ],
  images: {
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    dangerouslyAllowSVG: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    formats: ["image/avif", "image/webp"],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com", protocol: "https" },
      { hostname: "lh3.googleusercontent.com", protocol: "https" },
      { hostname: "placehold.co", protocol: "https" },
      { hostname: "m.media-amazon.com", protocol: "https" },
      { hostname: "ik.imagekit.io", protocol: "https" },
      { hostname: "gg.asuracomic.net", protocol: "https" },
      { hostname: "res.cloudinary.com", protocol: "https" },
      { hostname: "localhost", protocol: "https" },
      { hostname: "localhost", protocol: "http" },
      { hostname: "cdn.shadcnstudio.com", protocol: "https" },
    ],
  },

  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  output: "standalone",

  poweredByHeader: false,

  reactCompiler: true,

  typedRoutes: true,

  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;

import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

/**
 * Description placeholder
 *
 * @type {NextConfig}
 */
const nextConfig: NextConfig = {
  /* config options here */
  // React Compiler for automatic optimization
  reactCompiler: true,

  experimental: {
    typedEnv: true,
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    optimizePackageImports: ["lucide-react"],
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // External packages for server-side
  serverExternalPackages: [
    "postgres",
    "libsql/client",
    "bcryptjs",
    "sharp",
    "nodemailer",
  ],

  cacheComponents: false,
  // Image optimization
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "gg.asuracomic.net" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "localhost" },
      { protocol: "http", hostname: "localhost" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Enhanced logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Type-safe routing
  typedRoutes: true,

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // Development indicators
  devIndicators: {
    position: "bottom-right",
  },

  // Bundle optimization
  bundlePagesRouterDependencies: true,

  // Security headers
  poweredByHeader: false,
  compress: true,

  // Security headers
  headers: async () => [
    {
      source: "/:path*",
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
    },
  ],
  webpack: (
    config: Record<string, unknown>,
    { isServer }: { isServer: boolean },
  ) => {
    if (!isServer) {
      const resolveConfig = config["resolve"] as Record<string, unknown>;
      resolveConfig["fallback"] = {
        ...(resolveConfig["fallback"] as Record<string, boolean>),
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    return config;
  },
};
// ========== BUNDLE ANALYZER ==========
const withBundleAnalyzer = (config: NextConfig): NextConfig => {
  if (process.env.ANALYZE === "true") {
    // Dynamic import for bundle analyzer when needed
    // Run: ANALYZE=true npm run build
    console.log("📊 Bundle analyzer enabled - check .next/analyze");
  }
  return config;
};

// ========== SENTRY CONFIGURATION ==========
const sentryDSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

const finalConfig = withBundleAnalyzer(nextConfig);

export default sentryDSN
  ? withSentryConfig(finalConfig, {
      // Sentry organization and project
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,

      // Only upload source maps in CI/production
      silent: !process.env.CI,

      // Upload source maps for better error debugging
      widenClientFileUpload: true,

      // Source maps configuration
      sourcemaps: {
        deleteSourcemapsAfterUpload: true,
      },

      // Sentry Webpack options (see deprecation warnings)
      webpack: {
        treeshake: {
          removeDebugLogging: true,
        },
        automaticVercelMonitors: true,
      },
    })
  : finalConfig;

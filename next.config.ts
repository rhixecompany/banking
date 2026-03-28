import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  turbopack: {},

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
  serverExternalPackages: [
    "postgres",
    "libsql/client",
    "bcryptjs",
    "sharp",
    "nodemailer",
  ],

  cacheComponents: false,
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

  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  typedRoutes: true,

  typescript: {
    ignoreBuildErrors: false,
  },

  devIndicators: {
    position: "bottom-right",
  },

  bundlePagesRouterDependencies: true,

  poweredByHeader: false,
  compress: true,

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

const withBundleAnalyzer = (config: NextConfig): NextConfig => {
  if (process.env.ANALYZE === "true") {
    console.log("📊 Bundle analyzer enabled - check .next/analyze");
  }
  return config;
};

export default withBundleAnalyzer(nextConfig);

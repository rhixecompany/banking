/**
 * @file nextSitemap.config.ts
 * @description Sitemap and robots.txt configuration for Banking
 * @author Banking Team
 * @since 2026-02-01
 */

const siteUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

/**
 * Description placeholder
 *
 * @type {{ siteUrl: string; generateRobotsTxt: boolean; generateIndexSitemap: boolean; exclude: string[]; priority: number; changefreq: string; transform: (_config: unknown, path: string) => { changefreq: string; lastmod: string; loc: string; priority: number }; robotsTxtOptions: { policies: Array<{ allow?: string; disallow?: string[]; userAgent: string }>; additionalSitemaps: string[]; }; }}
 */
const config = {
  changefreq: "weekly",
  // ========== ROUTE HANDLING ==========
  exclude: [
    // Auth routes (handled by server-sitemap)
    "/sign-in",
    "/sign-up",
  ],
  generateIndexSitemap: true,

  generateRobotsTxt: true,

  // ========== PRIORITY & FREQUENCY ==========
  priority: 0.7, // Default priority
  // ========== ROBOTS.TXT ==========
  robotsTxtOptions: {
    additionalSitemaps: [
      // Server-generated sitemap for dynamic content
      `${siteUrl}/server-sitemap.xml`,
    ],
    policies: [
      // Allow all crawlers on public pages
      { allow: "/", userAgent: "*" },
      // Block admin and API
      { disallow: ["/api"], userAgent: "*" },
    ],
  },

  siteUrl,

  // Transform function for dynamic priorities
  transform: (
    _config: unknown,
    path: string,
  ): { changefreq: string; lastmod: string; loc: string; priority: number } => {
    // Homepage - highest priority
    if (path === "/") {
      return {
        changefreq: "daily",
        lastmod: new Date().toISOString(),
        loc: path,
        priority: 1.0,
      };
    }
    // Static pages - low priority
    return {
      changefreq: "monthly",
      lastmod: new Date().toISOString(),
      loc: path,
      priority: 0.5,
    };
  },
};

export default config;

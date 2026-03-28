/**
 * @file nextSitemap.config.ts
 * @description Sitemap and robots.txt configuration for Banking
 * @author Banking Team
 * @updated 2026-02-01
 */

const siteUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Description placeholder
 *
 * @type {{ siteUrl: any; generateRobotsTxt: boolean; generateIndexSitemap: boolean; exclude: {}; priority: number; changefreq: string; transform: (_config: unknown, path: string) => unknown; robotsTxtOptions: { policies: {}; additionalSitemaps: {}; }; }}
 */
const config = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: true,

  // ========== ROUTE HANDLING ==========
  exclude: [
    // Auth routes (handled by server-sitemap)
    "/sign-in",
    "/sign-up",
  ],

  // ========== PRIORITY & FREQUENCY ==========
  priority: 0.7, // Default priority
  changefreq: "weekly",

  // Transform function for dynamic priorities
  transform: async (_config: unknown, path: string) => {
    // Homepage - highest priority
    if (path === "/") {
      return {
        loc: path,
        changefreq: "daily",
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }
    // Static pages - low priority
    return {
      loc: path,
      changefreq: "monthly",
      priority: 0.5,
      lastmod: new Date().toISOString(),
    };
  },

  // ========== ROBOTS.TXT ==========
  robotsTxtOptions: {
    policies: [
      // Allow all crawlers on public pages
      { userAgent: "*", allow: "/" },
      // Block admin and API
      { userAgent: "*", disallow: ["/api"] },
    ],
    additionalSitemaps: [
      // Server-generated sitemap for dynamic content
      `${siteUrl}/server-sitemap.xml`,
    ],
  },
};

export default config;

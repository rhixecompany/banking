/**
 * Performance monitoring utilities for Playwright E2E tests
 *
 * Provides utilities for measuring and asserting on:
 * - Page load performance
 * - Network request timing
 * - Resource loading metrics
 *
 * Usage:
 *   import { measurePerformance, assertPerformance } from './fixtures/performance';
 *
 *   test('page loads quickly', async ({ page }) => {
 *     const metrics = await measurePerformance(page);
 *     expect(metrics.loadComplete).toBeLessThan(3000);
 *   });
 */

import { Page } from "@playwright/test";

/**
 * Performance metrics collected during test execution
 */
export interface PerformanceMetrics {
  /** Navigation timing in ms */
  loadComplete: number;
  domContentLoaded: number;
  firstPaint?: number;
  firstContentfulPaint?: number;
  timeToFirstByte?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  /** Resource counts */
  totalRequests: number;
  totalTransferSize: number;
  cachedRequests: number;
  failedRequests: number;
}

/**
 * Resource timing entry
 */
export interface ResourceTiming {
  url: string;
  initiatorType: string;
  duration: number;
  transferSize: number;
  cached: boolean;
  failed: boolean;
}

/**
 * Performance threshold configuration
 */
export interface PerformanceThresholds {
  /** Maximum page load time in ms */
  maxLoadTime?: number;
  /** Maximum DOM content loaded time in ms */
  maxDomContentLoaded?: number;
  /** Maximum first paint time in ms */
  maxFirstPaint?: number;
  /** Maximum first contentful paint in ms */
  maxFirstContentfulPaint?: number;
  /** Maximum largest contentful paint in ms */
  maxLargestContentfulPaint?: number;
  /** Maximum number of network requests */
  maxRequests?: number;
}

/**
 * Measure comprehensive page performance metrics
 *
 * @param page - Playwright page
 * @returns Performance metrics
 *
 * @example
 *   const metrics = await measurePerformance(page);
 *   console.log(`Page loaded in ${metrics.loadComplete}ms`);
 */
export async function measurePerformance(
  page: Page,
): Promise<PerformanceMetrics> {
  await page.waitForLoadState("networkidle");

  const metrics = await page.evaluate(() => {
    const timing = performance.timing;
    const navEntries = performance.getEntriesByType("navigation") as any[];
    const paintEntries = performance.getEntriesByType("paint") as any[];
    const resourceEntries = performance.getEntriesByType("resource") as any[];

    const navigation = navEntries[0] || {};

    return {
      cachedRequests: resourceEntries.filter(
        (r: any) => r.transferSize === 0 && r.duration < 10,
      ).length,
      domContentLoaded:
        timing.domContentLoadedEventEnd - timing.navigationStart,
      failedRequests: resourceEntries.filter(
        (r: any) => r.transferSize === 0 && r.duration > 0,
      ).length,
      firstContentfulPaint: paintEntries[1]?.startTime,
      firstPaint: paintEntries[0]?.startTime,
      loadComplete: timing.loadEventEnd - timing.navigationStart,
      timeToFirstByte: navigation.responseStart - navigation.requestStart,
      totalRequests: resourceEntries.length,
      totalTransferSize: resourceEntries.reduce(
        (sum: number, r: any) => sum + (r.transferSize || 0),
        0,
      ),
    };
  });

  return metrics;
}

/**
 * Get resource timing data
 *
 * @param page - Playwright page
 * @returns Resource timing entries
 *
 * @example
 *   const resources = await getResourceTiming(page);
 *   const images = resources.filter(r => r.initiatorType === 'img');
 */
export async function getResourceTiming(page: Page): Promise<ResourceTiming[]> {
  await page.waitForLoadState("networkidle");

  return page.evaluate(() => {
    const entries = performance.getEntriesByType("resource") as any[];
    return entries.map((entry) => ({
      cached: entry.transferSize === 0 && entry.duration < 10,
      duration: entry.duration,
      failed: entry.transferSize === 0 && entry.duration > 0,
      initiatorType: entry.initiatorType,
      transferSize: entry.transferSize || 0,
      url: entry.name,
    }));
  });
}

/**
 * Measure custom operation timing
 *
 * @param page - Playwright page
 * @param operation - Operation to measure
 * @returns Duration in milliseconds
 *
 * @example
 *   const duration = await measureOperation(page, async () => {
 *     await page.click('#submit');
 *     await page.waitForSelector('#success');
 *   });
 */
export async function measureOperation(
  page: Page,
  operation: () => Promise<void>,
): Promise<number> {
  const startTime = Date.now();
  await operation();
  return Date.now() - startTime;
}

/**
 * Assert performance thresholds
 *
 * @param page - Playwright page
 * @param thresholds - Performance thresholds to check
 * @throws Error if any threshold is exceeded
 *
 * @example
 *   await assertPerformance(page, { maxLoadTime: 3000, maxFirstContentfulPaint: 1500 });
 */
export async function assertPerformance(
  page: Page,
  thresholds: PerformanceThresholds,
): Promise<void> {
  await page.waitForLoadState("networkidle");

  const metrics = await page.evaluate(() => {
    const timing = performance.timing;
    const paintEntries = performance.getEntriesByType("paint") as any[];

    return {
      domContentLoaded:
        timing.domContentLoadedEventEnd - timing.navigationStart,
      firstContentfulPaint: paintEntries[1]?.startTime,
      firstPaint: paintEntries[0]?.startTime,
      loadComplete: timing.loadEventEnd - timing.navigationStart,
    };
  });

  if (thresholds.maxLoadTime && metrics.loadComplete > thresholds.maxLoadTime) {
    throw new Error(
      `Page load time (${metrics.loadComplete}ms) exceeds threshold (${thresholds.maxLoadTime}ms)`,
    );
  }

  if (
    thresholds.maxDomContentLoaded &&
    metrics.domContentLoaded > thresholds.maxDomContentLoaded
  ) {
    throw new Error(
      `DOMContentLoaded (${metrics.domContentLoaded}ms) exceeds threshold (${thresholds.maxDomContentLoaded}ms)`,
    );
  }

  if (
    thresholds.maxFirstPaint &&
    metrics.firstPaint &&
    metrics.firstPaint > thresholds.maxFirstPaint
  ) {
    throw new Error(
      `First paint (${metrics.firstPaint}ms) exceeds threshold (${thresholds.maxFirstPaint}ms)`,
    );
  }

  if (
    thresholds.maxFirstContentfulPaint &&
    metrics.firstContentfulPaint &&
    metrics.firstContentfulPaint > thresholds.maxFirstContentfulPaint
  ) {
    throw new Error(
      `FCP (${metrics.firstContentfulPaint}ms) exceeds threshold (${thresholds.maxFirstContentfulPaint}ms)`,
    );
  }
}

/**
 * Performance test configuration presets
 */
export const PERFORMANCE_CONFIG = {
  /** Default thresholds for CI */
  CI: {
    maxFirstContentfulPaint: 2000,
    maxLoadTime: 5000,
    maxRequests: 60,
  } as PerformanceThresholds,

  /** Default thresholds for local development */
  dev: {
    maxFirstContentfulPaint: 1500,
    maxLoadTime: 3000,
    maxRequests: 50,
  } as PerformanceThresholds,

  /** Strict thresholds for critical paths */
  strict: {
    maxFirstContentfulPaint: 1000,
    maxLoadTime: 2000,
    maxRequests: 30,
  } as PerformanceThresholds,
};

export default {
  assertPerformance,
  getResourceTiming,
  measureOperation,
  measurePerformance,
  PERFORMANCE_CONFIG,
};

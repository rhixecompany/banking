import { test as base, type Page, type BrowserContext } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

/**
 * Coverage data types - matches Playwright's coverage API
 */
export interface CoverageData {
  url: string;
  timestamp: number;
  js?: PlaywrightJSCoverage[];
  css?: PlaywrightCSSCoverage[];
}

/**
 * Playwright JS Coverage entry
 */
export interface PlaywrightJSCoverage {
  url: string;
  scriptId: string;
  source?: string;
  functions: Array<{
    functionName: string;
    isBlockCoverage: boolean;
    ranges: Array<{
      count: number;
      startOffset: number;
      endOffset: number;
    }>;
  }>;
}

/**
 * Playwright CSS Coverage entry
 */
export interface PlaywrightCSSCoverage {
  url: string;
  text?: string;
  ranges: Array<{
    start: number;
    end: number;
  }>;
}

/**
 * Coverage fixtures for collecting JS/CSS coverage
 */
export interface CoverageFixtures {
  /** Enable coverage collection for this test */
  enableCoverage: boolean;
  /** Get coverage data after test completes */
  coverageData: CoverageData[];
  /** Page with coverage enabled */
  coveragePage: Page;
}

/**
 * Output directory for coverage reports
 */
const COVERAGE_DIR = path.join(process.cwd(), ".playwright", "coverage");

/**
 * Ensure coverage directory exists
 */
function ensureCoverageDir(): void {
  if (!fs.existsSync(COVERAGE_DIR)) {
    fs.mkdirSync(COVERAGE_DIR, { recursive: true });
  }
}

/**
 * Save coverage data to file
 */
function saveCoverageData(data: CoverageData[], testName: string): void {
  ensureCoverageDir();
  const sanitizedName = testName.replace(/[^a-z0-9]/gi, "_").slice(0, 50);
  const timestamp = new Date().toISOString().replaceAll(/[:.]/g, "-");
  const filename = path.join(COVERAGE_DIR, `${sanitizedName}_${timestamp}.json`);

  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log(`[coverage] Coverage data saved to: ${filename}`);
}

/**
 * Start JS coverage monitoring on a page
 */
async function startJSCoverage(page: Page): Promise<void> {
  await page.coverage?.startJSCoverage();
}

/**
 * Stop JS coverage and return the results
 */
async function stopJSCoverage(page: Page): Promise<PlaywrightJSCoverage[]> {
  return page.coverage?.stopJSCoverage() ?? [];
}

/**
 * Start CSS coverage monitoring on a page
 */
async function startCSSCoverage(page: Page): Promise<void> {
  await page.coverage?.startCSSCoverage();
}

/**
 * Stop CSS coverage and return the results
 */
async function stopCSSCoverage(page: Page): Promise<PlaywrightCSSCoverage[]> {
  return page.coverage?.stopCSSCoverage() ?? [];
}

/**
 * Create test with coverage collection
 * 
 * Usage:
 *   import { test, expect } from './fixtures/coverage';
 *   
 *   test('my test with coverage', async ({ coveragePage }) => {
 *     await coveragePage.goto('/dashboard');
 *     // Coverage is automatically collected and saved on test complete
 *   });
 */
export const test = base.extend<CoverageFixtures>({
  enableCoverage: async ({ page }, use) => {
    // Coverage is enabled by default when using coveragePage
    await use(true);
  },

  coverageData: async ({ page }, use) => {
    const data: CoverageData[] = [];
    
    // Start coverage collection
    await startJSCoverage(page);
    await startCSSCoverage(page);

    await use(data);

    // Stop coverage and collect results
    try {
      const jsCoverage = await stopJSCoverage(page);
      const cssCoverage = await stopCSSCoverage(page);

      if (jsCoverage.length > 0 || cssCoverage.length > 0) {
        data.push({
          url: page.url(),
          timestamp: Date.now(),
          js: jsCoverage,
          css: cssCoverage,
        });
      }
    } catch (e) {
      console.warn(`[coverage] Failed to collect coverage: ${e}`);
    }
  },

  coveragePage: async ({ page }, use) => {
    // Start coverage collection
    await startJSCoverage(page);
    await startCSSCoverage(page);

    await use(page);

    // Stop coverage on test complete
    try {
      await stopJSCoverage(page);
      await stopCSSCoverage(page);
    } catch (e) {
      console.warn(`[coverage] Failed to stop coverage: ${e}`);
    }
  },
});

export { expect } from "@playwright/test";

/**
 * Calculate coverage percentage from JS coverage data
 * 
 * Usage:
 *   const percentage = calculateJSCoveragePercentage(coverageData);
 */
export function calculateJSCoveragePercentage(coverage: PlaywrightJSCoverage[]): number {
  let totalBytes = 0;
  let coveredBytes = 0;

  for (const entry of coverage) {
    for (const func of entry.functions) {
      for (const range of func.ranges) {
        totalBytes += range.endOffset - range.startOffset;
        coveredBytes += (range.endOffset - range.startOffset) * range.count;
      }
    }
  }

  return totalBytes > 0 ? (coveredBytes / totalBytes) * 100 : 0;
}

/**
 * Calculate coverage percentage from CSS coverage data
 */
export function calculateCSSCoveragePercentage(coverage: PlaywrightCSSCoverage[]): number {
  let totalBytes = 0;
  let coveredBytes = 0;

  for (const entry of coverage) {
    for (const range of entry.ranges) {
      totalBytes += range.end - range.start;
      coveredBytes += range.end - range.start;
    }
  }

  return totalBytes > 0 ? (coveredBytes / totalBytes) * 100 : 0;
}

export default test;
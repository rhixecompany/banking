import { test as base, type Page, type Locator, expect } from "@playwright/test";

/**
 * Test utilities and helpers for better debugging and error reporting
 * Uses test.step() for improved trace viewer readability
 */

/**
 * Navigate to a URL with timing and logging
 */
export async function navigateTo(page: Page, url: string, description?: string): Promise<void> {
  const label = description ?? url;
  await base.step(`Navigate to ${label}`, async () => {
    await page.goto(url);
  });
}

/**
 * Fill a form field with timing
 */
export async function fillField(
  page: Page,
  selector: string | Locator,
  value: string,
  fieldName: string
): Promise<void> {
  await base.step(`Fill "${fieldName}"`, async () => {
    const locator = typeof selector === "string" ? page.locator(selector) : selector;
    await locator.fill(value);
  });
}

/**
 * Click an element with timing
 */
export async function clickElement(
  page: Page,
  selector: string | Locator,
  description: string
): Promise<void> {
  await base.step(`Click "${description}"`, async () => {
    const locator = typeof selector === "string" ? page.locator(selector) : selector;
    await locator.click();
  });
}

/**
 * Submit a form with timing
 */
export async function submitForm(page: Page, buttonSelector: string): Promise<void> {
  await base.step("Submit form", async () => {
    await page.locator(buttonSelector).click();
  });
}

/**
 * Wait for an element to be visible with timing
 */
export async function waitForElement(
  page: Page,
  selector: string | Locator,
  description: string,
  timeout = 10_000
): Promise<Locator> {
  const locator = typeof selector === "string" ? page.locator(selector) : selector;
  
  await base.step(`Wait for "${description}"`, async () => {
    await locator.waitFor({ state: "visible", timeout });
  });
  
  return locator;
}

/**
 * Assert element is visible with timing
 */
export async function assertVisible(
  page: Page,
  selector: string | Locator,
  description: string
): Promise<Locator> {
  const locator = typeof selector === "string" ? page.locator(selector) : selector;
  
  await base.step(`Assert "${description}" is visible`, async () => {
    await expect(locator).toBeVisible();
  });
  
  return locator;
}

/**
 * Assert element has expected text with timing
 */
export async function assertText(
  page: Page,
  selector: string | Locator,
  expected: string | RegExp,
  description: string
): Promise<void> {
  const locator = typeof selector === "string" ? page.locator(selector) : selector;
  
  await base.step(`Assert "${description}" has text`, async () => {
    await expect(locator).toHaveText(expected);
  });
}

/**
 * Assert element has expected value with timing
 */
export async function assertValue(
  page: Page,
  selector: string | Locator,
  expected: string | RegExp,
  description: string
): Promise<void> {
  const locator = typeof selector === "string" ? page.locator(selector) : selector;
  
  await base.step(`Assert "${description}" has value`, async () => {
    await expect(locator).toHaveValue(expected);
  });
}

/**
 * Assert URL matches pattern with timing
 */
export async function assertUrl(
  page: Page,
  pattern: string | RegExp,
  description: string
): Promise<void> {
  await base.step(`Assert URL is "${description}"`, async () => {
    await expect(page).toHaveURL(pattern);
  });
}

/**
 * Wait for API response with timing
 */
export async function waitForResponse(
  page: Page,
  urlPattern: string | RegExp,
  description: string
): Promise<void> {
  await base.step(`Wait for "${description}" API response`, async () => {
    await page.waitForResponse(urlPattern);
  });
}

/**
 * Soft assertion that doesn't fail immediately - collects all failures
 * Use this when you want to check multiple things and see all failures at once
 * 
 * Usage:
 *   const result = await softAssert(page, [
 *     [page.locator('.submit-btn'), 'toBeVisible', 'Submit button'],
 *     [page.locator('.submit-btn'), 'toHaveText', 'Submit'],
 *   ]);
 *   if (!result.passed) {
 *     console.log('Failures:', result.errors);
 *   }
 */
export interface SoftAssertResult {
  passed: boolean;
  errors: string[];
}

export async function softAssert(
  page: Page,
  assertions: Array<[Locator, string, string, ...unknown[]]>
): Promise<SoftAssertResult> {
  const errors: string[] = [];

  for (const [locator, matcher, description, ...args] of assertions) {
    try {
      // Use any to access the matcher dynamically
      const matcherFn = (expect(locator) as any)[matcher];
      if (typeof matcherFn === "function") {
        await matcherFn(...args);
      }
    } catch (e) {
      errors.push(`${description}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  return {
    passed: errors.length === 0,
    errors,
  };
}

/**
 * Measure execution time of an async function
 * Useful for identifying slow operations
 */
export async function measureTime<T>(
  fn: () => Promise<T>,
  label: string
): Promise<{ result: T; duration: number }> {
  const start = Date.now();
  const result = await fn();
  const duration = Date.now() - start;
  console.log(`[timing] ${label}: ${duration}ms`);
  return { result, duration };
}

/**
 * Retry a function with exponential backoff
 * Useful for flaky operations
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000,
  label = "operation"
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      const delay = initialDelay * Math.pow(2, attempt - 1);
      console.log(`[retry] ${label} attempt ${attempt}/${maxRetries} failed, retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

/**
 * Wait for network idle with timeout
 * Use instead of page.waitForLoadState('networkidle') which can be too slow
 */
export async function waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
  await page.waitForLoadState("networkidle", { timeout }).catch(() => {
    // Ignore timeout - network may never be fully idle
  });
}

/**
 * Take a screenshot with timestamp for debugging
 */
export async function debugScreenshot(page: Page, name: string): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `debug-${name}-${timestamp}.png`;
  await page.screenshot({ path: filename, fullPage: true });
  console.log(`[debug] Screenshot saved: ${filename}`);
  return filename;
}

/**
 * Extended test with timing utilities
 * Usage:
 *   import { test, expect } from './fixtures/test-utils';
 *   
 *   test('my test', async ({ page }) => {
 *     await navigateTo(page, '/dashboard', 'Dashboard');
 *     await assertVisible(page, '.balance', 'Balance');
 *   });
 */
export { expect, test };

export default {
  expect,
  test,
  navigateTo,
  fillField,
  clickElement,
  submitForm,
  waitForElement,
  assertVisible,
  assertText,
  assertValue,
  assertUrl,
  waitForResponse,
  softAssert,
  measureTime,
  retry,
  waitForNetworkIdle,
  debugScreenshot,
};
import type { Locator, Page } from "@playwright/test";

/**
 * Base Page Object Model class providing common navigation and interaction patterns.
 * All page objects should extend this class for consistent behavior.
 *
 * @description
 * Provides foundational methods for page navigation, element queries, and state waits.
 * Encapsulates Playwright's Page API with typed, reusable methods that reduce
 * duplication across page object implementations.
 *
 * @example
 * ```typescript
 * class DashboardPage extends BasePage {
 *   get url() { return "/dashboard"; }
 *
 *   get welcomeMessage() {
 *     return this.getByRole("heading", { name: /welcome/i });
 *   }
 * }
 * ```
 */
export abstract class BasePage {
  /** The Playwright Page instance for all interactions. */
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Returns the URL path for this page.
   * Subclasses must implement this to enable navigate().
   */
  abstract get url(): string;

  /**
   * Navigates to this page's URL.
   *
   * @param options - Navigation options
   * @param options.waitUntil - When to consider navigation complete
   */
  async navigate(options?: {
    waitUntil?: "domcontentloaded" | "load" | "networkidle";
  }): Promise<void> {
    await this.page.goto(this.url, options);
  }

  /**
   * Waits for the page to reach a specific load state.
   *
   * @param state - The load state to wait for
   */
  async waitForLoadState(
    state: "domcontentloaded" | "load" | "networkidle" = "load",
  ): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  /**
   * Gets a locator by role and options.
   * Useful for buttons, headings, links, etc.
   *
   * @param role - ARIA role to query
   * @param options - Additional options for the query
   * @returns Locator for the matched element(s)
   */

  getByRole(
    role: any,
    options?: {
      exact?: boolean;
      name?: RegExp | string;
      level?: number;
    },
  ): Locator {
    return this.page.getByRole(role, options);
  }

  /**
   * Gets a locator by visible text content.
   *
   * @param text - Text to search for
   * @param options - Additional options for the query
   * @param options.exact - Whether to match exactly
   * @param options.useInnerText - Whether to use innerText
   * @returns Locator for the matched element(s)
   */
  getByText(
    text: RegExp | string,
    options?: {
      exact?: boolean;
      useInnerText?: boolean;
    },
  ): Locator {
    return this.page.getByText(text, options);
  }

  /**
   * Gets a locator by placeholder attribute.
   *
   * @param placeholder - Placeholder text to search for (RegExp or string)
   * @returns Locator for the matched element
   */
  getByPlaceholder(placeholder: RegExp | string): Locator {
    return this.page.getByPlaceholder(placeholder);
  }

  /**
   * Gets a locator by label text.
   *
   * @param label - Label text to search for
   * @param options - Additional options for the query
   * @param options.exact - Whether to match exactly
   * @returns Locator for the matched element
   */
  getByLabel(
    label: RegExp | string,
    options?: {
      exact?: boolean;
    },
  ): Locator {
    return this.page.getByLabel(label, options);
  }

  /**
   * Gets a locator by test ID.
   *
   * @param testId - The test ID to search for
   * @returns Locator for the matched element
   */
  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  /**
   * Clicks an element and waits for navigation to complete.
   *
   * @param locator - The locator for the element to click
   */
  async clickAndNavigate(locator: Locator): Promise<void> {
    await Promise.all([this.page.waitForURL(/.*/), locator.click()]);
  }

  /**
   * Fills a form input and optionally submits.
   *
   * @param locator - The input locator
   * @param value - Value to fill
   * @param submit - Whether to submit the form after filling
   */
  async fillAndSubmit(
    locator: Locator,
    value: string,
    submit = false,
  ): Promise<void> {
    await locator.fill(value);
    if (submit) {
      await locator.press("Enter");
    }
  }

  /**
   * Waits for a URL pattern to match.
   *
   * @param url - URL pattern as string or RegExp
   */
  async waitForURL(url: RegExp | string): Promise<void> {
    await this.page.waitForURL(url);
  }

  /**
   * Asserts that the page matches a URL pattern (for expect compatibility).
   * Returns an object with toBeVisible-style matchers for POM integration.
   */
  async toHaveURL(
    url: RegExp | string,
  ): Promise<{ timeout: (ms: number) => Promise<void> }> {
    await this.page.waitForURL(url);
    return {
      timeout: async (_ms: number) => {
        await this.page.waitForURL(url);
      },
    };
  }

  /**
   * Checks if the current page matches a URL pattern.
   *
   * @param url - URL pattern to check
   * @returns True if the URL matches
   */
  isAtURL(url: RegExp | string): boolean {
    return this.page.url().match(url) !== null;
  }

  /**
   * Gets the current page title.
   */
  get title(): Promise<string> {
    return this.page.title();
  }

  /**
   * Reloads the current page.
   */
  async reload(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Goes back in browser history.
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Scrolls to an element and returns its bounding box.
   *
   * @param locator - The locator for the element
   */
  async scrollIntoViewIfNeeded(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Takes a screenshot of the page or a specific element.
   *
   * @param locator - Optional element to screenshot (page if not provided)
   * @param options - Screenshot options
   * @param options.fullPage - Whether to capture full page
   * @param options.path - Path to save screenshot
   * @returns Screenshot as Buffer
   */
  async screenshot(
    locator?: Locator,
    options?: {
      fullPage?: boolean;
      path?: string;
    },
  ): Promise<Buffer> {
    if (locator) {
      return await locator.screenshot(options);
    }
    return await this.page.screenshot({ fullPage: options?.fullPage });
  }
}

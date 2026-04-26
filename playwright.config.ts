import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Timeout configurations for E2E tests
 * Increased from defaults to accommodate slower dev server cold starts
 */
const TIMEOUTS = {
  /** Action timeout - 30 seconds */
  ACTION: 30_000,
  /** Assertion timeout - 10 seconds */
  ASSERTION: 10_000,
  /** Navigation timeout - 90 seconds */
  NAVIGATION: 90_000,
  /** Test timeout - 90 seconds for longer test runs */
  TEST: 90_000,
  /** Web server startup timeout - 180 seconds */
  WEB_SERVER: 180_000,
} as const;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
// Do not import lib/env here: Playwright may run this file in environments
// where TypeScript modules can't be imported at runtime. Read only the
// environment variables needed for configuration with safe fallbacks.
const env = {
  CI: process.env.CI ?? undefined,
  ENABLE_TEST_ENDPOINTS: process.env.ENABLE_TEST_ENDPOINTS ?? undefined,
  PLAYWRIGHT_BASE_URL: process.env.PLAYWRIGHT_BASE_URL ?? undefined,
  PLAYWRIGHT_PREPARE_DB: process.env.PLAYWRIGHT_PREPARE_DB ?? undefined,
};

const baseURL = env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

function isLocalUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr);
    return (
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "0.0.0.0" ||
      url.hostname === "::1"
    );
  } catch {
    return true;
  }
}

export default defineConfig({
  /* Assertion timeout - increased for slower pages */
  expect: { timeout: TIMEOUTS.ASSERTION },
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!env.CI,
  /* Run tests sequentially — app state is shared (auth, DB). */
  fullyParallel: false,
  globalSetup: "./tests/e2e/global-setup.ts",
  globalTeardown: "./tests/e2e/global-teardown.ts",

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Reporter configuration with better error reporting */
  reporter: env.CI
    ? [
        ["github"],
        ["html", { open: "never", outputFolder: "playwright-report" }],
        ["list"],
      ]
    : [
        ["html", { open: "on-failure", outputFolder: "playwright-report" }],
        ["list"],
      ],

  /* Retry on CI only — no retries locally to surface real failures immediately */
  retries: env.CI ? 2 : 0,
  testDir: "./tests/e2e",

  /* Per-test timeout - increased for dev server cold start */
  timeout: TIMEOUTS.TEST,

  /* Shared settings for all the projects below. */
  use: {
    /* Accept downloads to default directory */
    acceptDownloads: true,

    /* Fail fast on slow actions - increased for slower pages */
    actionTimeout: TIMEOUTS.ACTION,

    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL,

    headless: true,

    /* Fail fast on slow navigation - increased for dev server */
    navigationTimeout: TIMEOUTS.NAVIGATION,

    /* Screenshots only on failure to save disk space */
    screenshot: "only-on-failure",

    /* Collect trace when retrying the failed test. */
    trace: "on-first-retry",

    /* Video only on failure to save disk space */
    video: "retain-on-failure",
  },

  /* Run your local dev server before starting the tests */
  webServer: !isLocalUrl(baseURL)
    ? undefined
    : (() => {
        // Only include env vars that are defined; Playwright expects string values
        // for the webServer.env object (Record<string, string>), so we build a
        // filtered object to satisfy the TypeScript type.
        const webEnv: Record<string, string> = {};
        if (process.env.ENABLE_TEST_ENDPOINTS) {
          webEnv.ENABLE_TEST_ENDPOINTS = process.env.ENABLE_TEST_ENDPOINTS;
        }
        if (process.env.PLAYWRIGHT_PREPARE_DB) {
          webEnv.PLAYWRIGHT_PREPARE_DB = process.env.PLAYWRIGHT_PREPARE_DB;
        }

        // If a custom baseURL is used, ensure Next dev binds the matching port.
        try {
          const url = new URL(baseURL);
          if (url.port) webEnv.PORT = url.port;
        } catch {
          // ignore invalid PLAYWRIGHT_BASE_URL
        }

        return {
          // Start Next.js directly to avoid predev clean overhead during E2E.
          command: "npx next dev --webpack",
          // Forward a small set of test flags to the spawned dev server process so
          // test-only endpoints (like /__playwright__/set-cookie) are enabled when
          // Playwright starts the application. We avoid forwarding the whole
          // process.env to limit leakage of unrelated variables.
          env: webEnv,
          reuseExistingServer: !env.CI,
          stderr: "pipe",
          stdout: "pipe",
          timeout: TIMEOUTS.WEB_SERVER,
          url: baseURL,
        };
      })(),

  /* Always 1 worker — stateful app (auth sessions, shared DB). */
  workers: 1,
});

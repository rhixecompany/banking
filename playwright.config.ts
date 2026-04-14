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
export default defineConfig({
  /* Assertion timeout - increased for slower pages */
  expect: { timeout: TIMEOUTS.ASSERTION },
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env["CI"],
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
  reporter: process.env["CI"]
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
  retries: process.env["CI"] ? 2 : 0,
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",

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
  webServer: {
    command: "npm run dev",
    reuseExistingServer: !process.env["CI"],
    stderr: "pipe",
    stdout: "pipe",
    timeout: TIMEOUTS.WEB_SERVER,
    url: "http://localhost:3000",
    // Forward a small set of test flags to the spawned dev server process so
    // test-only endpoints (like /__playwright__/set-cookie) are enabled when
    // Playwright starts the application. We avoid forwarding the whole
    // process.env to limit leakage of unrelated variables.
    env: {
      PLAYWRIGHT_PREPARE_DB: process.env.PLAYWRIGHT_PREPARE_DB,
      ENABLE_TEST_ENDPOINTS: process.env.ENABLE_TEST_ENDPOINTS,
    },
  },

  /* Always 1 worker — stateful app (auth sessions, shared DB). */
  workers: 1,
});

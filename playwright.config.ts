import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  /* Assertion timeout */
  expect: { timeout: 5_000 },
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
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["html", { outputFolder: "playwright-report" }]],
  /* Retry on CI only — no retries locally to surface real failures immediately */
  retries: process.env["CI"] ? 2 : 0,
  testDir: "./tests/e2e",
  /* Per-test timeout */
  timeout: 30_000,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Fail fast on slow actions */
    actionTimeout: 15_000,
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: "http://localhost:3000",

    headless: true,

    /* Fail fast on slow navigation */
    navigationTimeout: 60_000,

    /* Screenshots only on failure to save disk space */
    screenshot: "only-on-failure",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    /* Video only on failure to save disk space */
    video: "retain-on-failure",
  },

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run dev",
    reuseExistingServer: !process.env["CI"],
    timeout: 180 * 1000,
    url: "http://localhost:3000",
  },

  /* Always 1 worker — stateful app (auth sessions, shared DB). */
  workers: 1,
});

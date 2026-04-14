# Section 9 — Playwright E2E Notes

Playwright runs with a single worker using Chromium; ensure port 3000 is free. Use deterministic auth fixtures where possible to avoid UI sign-ins.

Example:

```ts
import { test, expect } from "@playwright/test";

test("redirects unauthenticated users", async ({ page }) => {
  await page.goto("/my-wallets");
  await expect(page).toHaveURL(/\/sign-in/);
});
```

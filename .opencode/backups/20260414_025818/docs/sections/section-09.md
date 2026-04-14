# Section 9 — Playwright E2E Notes

- Playwright runs with a single worker and Chromium only; ensure port 3000 is free before running.
- Use deterministic auth fixtures instead of completing UI sign-in.

Example test snippet:

```ts
import { test, expect } from "@playwright/test";

test("redirects unauthenticated users", async ({ page }) => {
  await page.goto("/my-wallets");
  await expect(page).toHaveURL(/\/sign-in/);
});
```

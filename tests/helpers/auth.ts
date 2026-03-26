import { Page } from "@playwright/test";

export async function signInUser(page: Page, email: string, password: string) {
  await page.goto("/sign-in");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL("/", { timeout: 10000 });
}

export async function signUpUser(
  page: Page,
  name: string,
  email: string,
  password: string,
) {
  await page.goto("/sign-up");
  await page.fill('input[name="firstName"]', name);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="confirmPassword"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL("/", { timeout: 10000 });
}

export async function signOut(page: Page) {
  await page.click(
    'button:has-text("Logout"), button:has-text("Log out"), button:has-text("Sign out")',
  );
  await page.waitForURL("/sign-in", { timeout: 10000 });
}

export async function isAuthenticated(page: Page): Promise<boolean> {
  await page.goto("/");
  const logoutButton = page.locator(
    'button:has-text("Logout"), button:has-text("Log out"), button:has-text("Sign out")',
  );
  return await logoutButton.isVisible({ timeout: 2000 }).catch(() => false);
}

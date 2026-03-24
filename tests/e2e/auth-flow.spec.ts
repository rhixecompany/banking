import { test, expect } from '@playwright/test';

const randomEmail = `testuser_${Date.now()}@example.com`;
const password = 'TestPassword123!';

// Update selectors as needed for your app

test.describe('Auth and Navigation Flow', () => {
  test('Sign up, login, navigate, and submit form', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/Banking/i);

    // 2. Navigate to sign up
    await page.getByRole('link', { name: /sign up/i }).click();
    await expect(page).toHaveURL(/sign-up/);

    // 3. Fill sign up form
    await page.getByLabel(/email/i).fill(randomEmail);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole('button', { name: /sign up/i }).click();

    // 4. Log out if auto-logged in, then log in
    if (await page.getByRole('button', { name: /logout/i }).isVisible()) {
      await page.getByRole('button', { name: /logout/i }).click();
    }
    await page.getByRole('link', { name: /sign in/i }).click();
    await page.getByLabel(/email/i).fill(randomEmail);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/dashboard|welcome/i)).toBeVisible();

    // 5. Navigate to another main page (update selector as needed)
    await page.getByRole('link', { name: /accounts|profile|settings/i }).first().click();
    await expect(page.getByText(/accounts|profile|settings/i)).toBeVisible();

    // 6. Submit a form if present (update selectors as needed)
    if (await page.getByRole('form').isVisible()) {
      await page.getByRole('textbox').first().fill('Test input');
      await page.getByRole('button', { name: /submit|save/i }).click();
      await expect(page.getByText(/success|saved/i)).toBeVisible();
    }
  });
});

import { test, expect } from '@playwright/test';

// This test assumes backend can be configured to return empty list.
// As a smoke test, we at least verify dashboard skeleton after login.

test('dashboard renders skeleton and main sections after login', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByPlaceholder('Enter your name').fill('Smoke User');
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.getByText('Co-own Investor')).toBeVisible();
  await expect(page.locator('.dashboard-main')).toBeVisible();
});

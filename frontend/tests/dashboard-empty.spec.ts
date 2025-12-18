import { test, expect } from '@playwright/test';

// This test mocks the backend to return an empty list for the dashboard data endpoint.
// As a smoke test, we at least verify dashboard skeleton after login.

test('dashboard renders skeleton and main sections after login', async ({ page }) => {
  // Mock the backend API to return an empty list for dashboard data.
  await page.route('**/api/dashboard*', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });
  await page.goto('/');
  await page.getByPlaceholder('Enter your name').fill('Smoke User');
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.getByText('Co-own Investor')).toBeVisible();
  await expect(page.locator('.dashboard-main')).toBeVisible();
  
  // Should have Search tab
  const searchTab = page.locator('.tab');
  await expect(searchTab).toBeVisible();
  await expect(searchTab.first()).toContainText('Search');
});

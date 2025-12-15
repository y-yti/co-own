import { test, expect } from '@playwright/test';

// Assumes frontend dev server is running on BASE_URL
// Validates map icon presence and click opens new tab to Google Maps

test.describe('Property Card', () => {
  test('shows Google Maps icon when coordinates exist', async ({ page, context }) => {
    await page.goto('http://localhost:5173/');
    await page.getByPlaceholder('Enter your name').fill('Smoke User');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Find a property card
    const card = page.locator('.property-card').first();
    await expect(card).toBeVisible();

    // Title and tag visible
    await expect(card.locator('.property-header .property-title')).toBeVisible();
    await expect(card.locator('.property-tag')).toBeVisible();

    // Map icon button should be visible only when coordinates exist
    const mapBtn = card.locator('button.map-icon-btn');
    await expect(mapBtn).toBeVisible();

    // Intercept popup
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      mapBtn.click(),
    ]);

    await popup.waitForLoadState('domcontentloaded');
    const url = popup.url();
    expect(url).toContain('https://www.google.com/maps?q=');
  });
});

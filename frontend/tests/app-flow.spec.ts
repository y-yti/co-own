import { test, expect } from '@playwright/test';

// End-to-end: login then dashboard loads properties and shows map icon

test.describe('App end-to-end flow', () => {
  test('login and see investor dashboard with properties', async ({ page, context }) => {
    await page.goto('/');

    // Login page elements
    await expect(page.getByText('Co-own')).toBeVisible();
    await expect(page.getByText('Sign in as Investor')).toBeVisible();
    await expect(page.getByLabel('Login name')).toBeVisible();

    // Perform login
    await page.getByPlaceholder('Enter your name').fill('Test User');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Dashboard header
    await expect(page.getByText('Co-own Investor')).toBeVisible();
    
    // Should have Search tab by default
    const searchTab = page.locator('.tab').first();
    await expect(searchTab).toBeVisible();
    await expect(searchTab).toContainText('Search');
    await expect(searchTab).toHaveClass(/active/);

    // Wait for properties to load
    const grid = page.locator('.property-grid');
    await grid.waitFor({ state: 'attached' });

    const cards = page.locator('.property-card');
    await expect(cards.first()).toBeVisible();

    // Verify a map icon exists on the first card and opens Google Maps
    const mapBtn = cards.first().locator('button.map-icon-btn');
    await expect(mapBtn).toBeVisible();

    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      mapBtn.click(),
    ]);
    await popup.waitForLoadState('domcontentloaded');
    expect(popup.url()).toContain('https://www.google.com/maps?q=');
  });
});

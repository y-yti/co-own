import { test, expect } from '@playwright/test';

// Assumes frontend dev server is running on BASE_URL
// Validates map icon presence and click opens new tab to Google Maps

test.describe('Property Card', () => {
  test('shows Google Maps icon when coordinates exist', async ({ page, context }) => {
    await page.goto('/');
    await page.getByPlaceholder('Enter your name').fill('Smoke User');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Perform search to get properties
    const searchButton = page.locator('button.search-button');
    await searchButton.click();
    await page.waitForSelector('.property-card');

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

  test('enables "View & Make Offer" button only when property has open offers', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Enter your name').fill('Test User');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Perform search to get properties
    const searchButton = page.locator('button.search-button');
    await searchButton.click();
    await page.waitForSelector('.property-card');
    const cards = page.locator('.property-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // Check first few cards for button state
    for (let i = 0; i < Math.min(3, count); i++) {
      const card = cards.nth(i);
      const button = card.locator('button.btn-outline');
      await expect(button).toBeVisible();
      
      const buttonText = await button.textContent();
      const isEnabled = await button.isEnabled();
      
      // If button says "View & Make Offer", it should be enabled
      // If it says "No Offers Available", it should be disabled
      if (buttonText?.includes('View & Make Offer')) {
        expect(isEnabled).toBeTruthy();
      } else if (buttonText?.includes('No Offers Available')) {
        expect(isEnabled).toBeFalsy();
      }
    }
  });

  test('opens PropertyDetail in new tab when "View & Make Offer" button is clicked', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Enter your name').fill('Test User');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Perform search to get properties
    const searchButton = page.locator('button.search-button');
    await searchButton.click();
    await page.waitForSelector('.property-card');
    
    // Initially should have only Search tab
    const initialTabs = page.locator('.tab');
    await expect(initialTabs).toHaveCount(1);
    await expect(initialTabs.first()).toContainText('Search');
    
    // Find a card with enabled "View & Make Offer" button
    const cards = page.locator('.property-card');
    const count = await cards.count();
    
    let foundEnabledButton = false;
    let propertyName = '';
    
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const button = card.locator('button.btn-outline');
      const isEnabled = await button.isEnabled();
      
      if (isEnabled) {
        // Get property name before clicking
        propertyName = await card.locator('.property-title').textContent() || '';
        
        await button.click();
        foundEnabledButton = true;
        
        // Should have 2 tabs now (Search + Property)
        const tabsAfterClick = page.locator('.tab');
        await expect(tabsAfterClick).toHaveCount(2);
        
        // Second tab should have property name
        const propertyTab = tabsAfterClick.nth(1);
        await expect(propertyTab).toContainText(propertyName);
        await expect(propertyTab).toHaveClass(/active/);
        
        // Property detail should be visible
        const propertyDetail = page.locator('.property-detail-container');
        await expect(propertyDetail).toBeVisible();
        
        // Property detail should have header with property name
        const detailHeader = propertyDetail.locator('.property-detail-header h2');
        await expect(detailHeader).toBeVisible();
        await expect(detailHeader).toContainText(propertyName);
        
        // Tab should have close button
        const closeBtn = propertyTab.locator('.tab-close');
        await expect(closeBtn).toBeVisible();
        
        // Click close to close tab
        await closeBtn.click();
        
        // Should be back to 1 tab (Search)
        await expect(page.locator('.tab')).toHaveCount(1);
        
        // Search tab should be active
        const searchTab = page.locator('.tab').first();
        await expect(searchTab).toHaveClass(/active/);
        
        break;
      }
    }
    
    expect(foundEnabledButton).toBeTruthy();
  });

  test('can open multiple property tabs and respects 5 tab limit', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Enter your name').fill('Test User');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Perform search to get properties
    const searchButton = page.locator('button.search-button');
    await searchButton.click();
    await page.waitForSelector('.property-card');
    
    const cards = page.locator('.property-card');
    const count = await cards.count();
    let openedTabs = 0;
    
    // Try to open up to 6 property tabs
    for (let i = 0; i < Math.min(6, count); i++) {
      const card = cards.nth(i);
      const button = card.locator('button.btn-outline');
      const isEnabled = await button.isEnabled();
      
      if (isEnabled) {
        await button.click();
        openedTabs++;
        await page.waitForTimeout(100); // Small delay for tab creation
      }
      
      if (openedTabs >= 6) break;
    }
    
    if (openedTabs > 0) {
      // Should have max 6 tabs total (1 Search + 5 Properties)
      const tabs = page.locator('.tab');
      const tabCount = await tabs.count();
      expect(tabCount).toBeLessThanOrEqual(6);
    }
  });

  test('switching between tabs preserves search results', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Enter your name').fill('Test User');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Perform search
    const searchButton = page.locator('button.search-button');
    await searchButton.click();
    await page.waitForSelector('.results-container');
    
    // Count initial results
    const initialResults = page.locator('.property-card');
    const initialCount = await initialResults.count();
    expect(initialCount).toBeGreaterThan(0);
    
    // Open a property in new tab
    const firstCard = initialResults.first();
    const button = firstCard.locator('button.btn-outline');
    const isEnabled = await button.isEnabled();
    
    if (isEnabled) {
      await button.click();
      
      // Should be on property tab
      const propertyTab = page.locator('.tab').nth(1);
      await expect(propertyTab).toHaveClass(/active/);
      
      // Switch back to search tab
      const searchTab = page.locator('.tab').first();
      await searchTab.click();
      
      // Search results should still be there
      await expect(page.locator('.results-container')).toBeVisible();
      const resultsAfter = page.locator('.property-card');
      const countAfter = await resultsAfter.count();
      expect(countAfter).toBe(initialCount);
    }
  });
});


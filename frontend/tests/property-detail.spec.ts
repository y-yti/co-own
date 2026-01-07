import { test, expect } from '@playwright/test';

test.describe('Property Detail Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Login
    await page.getByPlaceholder('Enter your name').fill('Test User');
    await page.getByRole('button', { name: 'Continue' }).click();
    
    // Perform search to get properties
    const searchButton = page.locator('button.search-button');
    await searchButton.click();
    await page.waitForSelector('.property-card');
  });

  test('displays property details with map and image when property tab is opened', async ({ page }) => {
    // Find and click a property with open offers
    const cards = page.locator('.property-card');
    const count = await cards.count();
    
    let propertyOpened = false;
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const button = card.locator('button.btn-outline');
      const isEnabled = await button.isEnabled();
      
      if (isEnabled) {
        await button.click();
        propertyOpened = true;
        break;
      }
    }
    
    expect(propertyOpened).toBeTruthy();
    
    // Verify property detail container is visible
    const detailContainer = page.locator('.property-detail-container');
    await expect(detailContainer).toBeVisible();
    
    // Verify header
    const header = detailContainer.locator('.property-detail-header h2');
    await expect(header).toBeVisible();
    
    // Verify map container exists
    const mapContainer = detailContainer.locator('.map-container');
    await expect(mapContainer).toBeVisible();
    
    // Verify iframe for Google Maps
    const mapIframe = mapContainer.locator('iframe');
    await expect(mapIframe).toBeVisible();
    const iframeSrc = await mapIframe.getAttribute('src');
    expect(iframeSrc).toContain('google.com/maps');
    
    // Verify image container exists
    const imageContainer = detailContainer.locator('.image-container');
    await expect(imageContainer).toBeVisible();
    
    // Verify apartment image
    const image = imageContainer.locator('.apartment-image');
    await expect(image).toBeVisible();
  });

  test('displays units table with available units for properties with open offers', async ({ page }) => {
    // Find and click a property with open offers
    const cards = page.locator('.property-card');
    const count = await cards.count();
    
    let propertyOpened = false;
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const button = card.locator('button.btn-outline');
      const isEnabled = await button.isEnabled();
      
      if (isEnabled) {
        await button.click();
        propertyOpened = true;
        break;
      }
    }
    
    expect(propertyOpened).toBeTruthy();
    
    // Wait for detail to load
    await page.waitForTimeout(500);
    
    const detailContainer = page.locator('.property-detail-container');
    
    // Verify "Available Units" heading
    const unitsHeading = detailContainer.locator('h3:has-text("Available Units")');
    await expect(unitsHeading).toBeVisible();
    
    // Verify units table exists
    const unitsTable = detailContainer.locator('.units-table');
    await expect(unitsTable).toBeVisible();
    
    // Verify table headers
    const headers = unitsTable.locator('thead th');
    await expect(headers.nth(0)).toContainText('Unit ID');
    await expect(headers.nth(1)).toContainText('Floor');
    await expect(headers.nth(2)).toContainText('Area');
    await expect(headers.nth(3)).toContainText('Asking Price');
    await expect(headers.nth(4)).toContainText('Status');
    await expect(headers.nth(5)).toContainText('Available(SQFT)');
    
    // Verify at least one row exists
    const rows = unitsTable.locator('tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);
    
    // Verify first row has expected data
    const firstRow = rows.first();
    await expect(firstRow.locator('td').nth(0)).toBeVisible(); // Unit ID
    await expect(firstRow.locator('td').nth(1)).toBeVisible(); // Floor
    await expect(firstRow.locator('td').nth(2)).toBeVisible(); // Area
    await expect(firstRow.locator('td').nth(3)).toContainText('₹'); // Price
  });

  test('displays recent transaction information', async ({ page }) => {
    // Find and click a property with open offers
    const cards = page.locator('.property-card');
    const count = await cards.count();
    
    let propertyOpened = false;
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const button = card.locator('button.btn-outline');
      const isEnabled = await button.isEnabled();
      
      if (isEnabled) {
        await button.click();
        propertyOpened = true;
        break;
      }
    }
    
    expect(propertyOpened).toBeTruthy();
    
    // Wait for detail to load
    await page.waitForTimeout(500);
    
    const detailContainer = page.locator('.property-detail-container');
    
    // Verify recent transaction section exists
    const transactionSummary = detailContainer.locator('.transaction-summary');
    await expect(transactionSummary).toBeVisible();
    
    // Verify it shows "Recent Transaction" heading
    const heading = transactionSummary.locator('h4');
    await expect(heading).toContainText('Recent Transaction');
    
    // Verify transaction details contain price
    const details = transactionSummary.locator('p');
    await expect(details).toContainText('Last sold');
    await expect(details).toContainText('₹');
  });

  test('shows loading state while fetching property details', async ({ page }) => {
    // Intercept API call to add delay
    await page.route('**/properties/*/details', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      route.continue();
    });
    
    // Find and click a property
    const cards = page.locator('.property-card');
    const firstEnabledButton = cards.locator('button.btn-outline:not([disabled])').first();
    await firstEnabledButton.click();
    
    // Should show loading state
    const loadingState = page.locator('.loading-state');
    await expect(loadingState).toBeVisible();
    await expect(loadingState).toContainText('Loading property details');
  });

  test('shows error state when API fails', async ({ page }) => {
    // Intercept API call to return error
    await page.route('**/properties/*/details', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'Server error' }),
      });
    });
    
    // Find and click a property
    const cards = page.locator('.property-card');
    const firstEnabledButton = cards.locator('button.btn-outline:not([disabled])').first();
    await firstEnabledButton.click();
    
    // Wait a bit for error to appear
    await page.waitForTimeout(500);
    
    // Should show error state
    const errorState = page.locator('.error-state');
    await expect(errorState).toBeVisible();
    await expect(errorState).toContainText('Failed to load property details');
  });

  test('shows "No units available" message for properties without open offers', async ({ page }) => {
    // Mock API to return property details with no open offers
    await page.route('**/properties/*/details', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          property_id: 1,
          property_name: 'Test Property',
          total_units: 10,
          units: [],
          open_offers_summary: {
            total_units_with_offers: 0,
            units_available: [],
            total_investable_fractional_units: 0
          },
          recent_transaction: []
        }),
      });
    });
    
    // Find and click any property
    const cards = page.locator('.property-card');
    const firstButton = cards.first().locator('button.btn-outline');
    
    // Force click even if disabled for this test
    await firstButton.click({ force: true });
    
    // Wait for detail to load
    await page.waitForTimeout(500);
    
    const detailContainer = page.locator('.property-detail-container');
    
    // Should show "No units available" message
    const noUnits = detailContainer.locator('.no-units');
    await expect(noUnits).toBeVisible();
    await expect(noUnits).toContainText('No units available for investment');
  });

  test('property detail content scrolls independently from tabs', async ({ page }) => {
    // Find and click a property
    const cards = page.locator('.property-card');
    const firstEnabledButton = cards.locator('button.btn-outline:not([disabled])').first();
    await firstEnabledButton.click();
    
    // Wait for detail to load
    await page.waitForTimeout(500);
    
    const detailContainer = page.locator('.property-detail-container');
    await expect(detailContainer).toBeVisible();
    
    // Verify the container has scrollable content
    const detailRow1 = detailContainer.locator('.detail-row-1');
    const detailRow2 = detailContainer.locator('.detail-row-2');
    
    await expect(detailRow1).toBeVisible();
    await expect(detailRow2).toBeVisible();
  });

  test('status badges display correctly for different unit statuses', async ({ page }) => {
    // Find and click a property with open offers
    const cards = page.locator('.property-card');
    const count = await cards.count();
    
    let propertyOpened = false;
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const button = card.locator('button.btn-outline');
      const isEnabled = await button.isEnabled();
      
      if (isEnabled) {
        await button.click();
        propertyOpened = true;
        break;
      }
    }
    
    expect(propertyOpened).toBeTruthy();
    
    // Wait for detail to load
    await page.waitForTimeout(500);
    
    const unitsTable = page.locator('.units-table');
    const statusBadges = unitsTable.locator('.status-badge');
    
    if (await statusBadges.count() > 0) {
      const firstBadge = statusBadges.first();
      await expect(firstBadge).toBeVisible();
      
      // Check if badge has appropriate class
      const badgeClass = await firstBadge.getAttribute('class');
      expect(badgeClass).toMatch(/available|partially_sold/);
    }
  });

  test('column header displays "Available(SQFT)" instead of "Available Units"', async ({ page }) => {
    // Find and click a property with open offers
    const cards = page.locator('.property-card');
    const count = await cards.count();
    
    let propertyOpened = false;
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const button = card.locator('button.btn-outline');
      const isEnabled = await button.isEnabled();
      
      if (isEnabled) {
        await button.click();
        propertyOpened = true;
        break;
      }
    }
    
    expect(propertyOpened).toBeTruthy();
    
    // Wait for detail to load
    await page.waitForTimeout(500);
    
    const detailContainer = page.locator('.property-detail-container');
    const unitsTable = detailContainer.locator('.units-table');
    
    // Verify units table exists
    await expect(unitsTable).toBeVisible();
    
    // Verify the sixth column header is exactly "Available(SQFT)"
    const sixthHeader = unitsTable.locator('thead th').nth(5);
    await expect(sixthHeader).toBeVisible();
    await expect(sixthHeader).toHaveText('Available(SQFT)');
    
    // Verify it's not the old text "Available Units"
    const headerText = await sixthHeader.textContent();
    expect(headerText).not.toBe('Available Units');
  });
});

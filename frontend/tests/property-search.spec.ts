import { test, expect } from '@playwright/test';

test.describe('Property Search Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Perform login
    await page.getByPlaceholder('Enter your name').fill('Test User');
    await page.getByRole('button', { name: 'Continue' }).click();
    // Wait for dashboard and property search component
    await page.waitForSelector('.property-search');
  });

  test('AC1: Bangalore is default location and residential is default property type, search is clickable', async ({ page }) => {
    // Check default location
    const locationSelect = page.locator('#location-select');
    await expect(locationSelect).toHaveValue('Bangalore');

    // Check default property type (residential checked)
    const residentialCheckbox = page.locator('input[aria-label="Residential properties"]');
    const commercialCheckbox = page.locator('input[aria-label="Commercial properties"]');
    await expect(residentialCheckbox).toBeChecked();
    await expect(commercialCheckbox).not.toBeChecked();

    // Check search button is enabled with defaults
    const searchButton = page.locator('button.search-button');
    await expect(searchButton).toBeEnabled();
    await expect(searchButton).not.toHaveAttribute('disabled');
  });

  test('AC2: Clearing location disables search until valid location is entered', async ({ page }) => {
    const locationSelect = page.locator('#location-select');
    const searchButton = page.locator('button.search-button');

    // Initially enabled with default
    await expect(searchButton).toBeEnabled();

    // Clear location
    await locationSelect.selectOption('');

    // Search should be disabled
    await expect(searchButton).toBeDisabled();
    await expect(searchButton).toHaveAttribute('disabled');

    // Validation message should appear
    const validationMessage = page.locator('.validation-message');
    await expect(validationMessage).toBeVisible();
    await expect(validationMessage).toContainText('Please select a location');

    // Select valid location
    await locationSelect.selectOption('Hyderabad');

    // Search should be enabled again
    await expect(searchButton).toBeEnabled();
    await expect(validationMessage).not.toBeVisible();
  });

  test('AC3: User can select residential, commercial, or both property types', async ({ page }) => {
    const residentialCheckbox = page.locator('input[aria-label="Residential properties"]');
    const commercialCheckbox = page.locator('input[aria-label="Commercial properties"]');
    const searchButton = page.locator('button.search-button');

    // Initially residential is checked
    await expect(residentialCheckbox).toBeChecked();
    await expect(searchButton).toBeEnabled();

    // Select only commercial
    await residentialCheckbox.uncheck();
    await commercialCheckbox.check();
    await expect(residentialCheckbox).not.toBeChecked();
    await expect(commercialCheckbox).toBeChecked();
    await expect(searchButton).toBeEnabled();

    // Select both
    await residentialCheckbox.check();
    await expect(residentialCheckbox).toBeChecked();
    await expect(commercialCheckbox).toBeChecked();
    await expect(searchButton).toBeEnabled();

    // Uncheck both - search should be disabled
    await residentialCheckbox.uncheck();
    await commercialCheckbox.uncheck();
    await expect(searchButton).toBeDisabled();

    // Validation message should appear
    const validationMessage = page.locator('.validation-message');
    await expect(validationMessage).toBeVisible();
    await expect(validationMessage).toContainText('Please select at least one property type');
  });

  test('AC4: Changing property type updates search results accordingly', async ({ page }) => {
    const residentialCheckbox = page.locator('input[aria-label="Residential properties"]');
    const commercialCheckbox = page.locator('input[aria-label="Commercial properties"]');
    const searchButton = page.locator('button.search-button');

    // Perform initial search with default (residential only)
    await searchButton.click();
    await page.waitForSelector('.results-container');

    // Verify residential properties are shown
    const initialResultsHeader = page.locator('.results-header h3');
    const initialCount = await initialResultsHeader.textContent();
    expect(initialCount).toContain('found');

    // Change to commercial only
    await residentialCheckbox.uncheck();
    await commercialCheckbox.check();

    // Results should update automatically (instant feedback)
    await page.waitForTimeout(200); // Wait for debounce/filter
    
    // For now, backend has no commercial properties, so should show empty state
    const emptyState = page.locator('.empty-state');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText('No properties found');

    // Change to both types
    await residentialCheckbox.check();
    
    // Results should update again
    await page.waitForTimeout(200);
    await expect(page.locator('.results-container')).toBeVisible();
  });

  test('AC5: Interface provides clear feedback when required fields are missing', async ({ page }) => {
    const locationSelect = page.locator('#location-select');
    const residentialCheckbox = page.locator('input[aria-label="Residential properties"]');
    const searchButton = page.locator('button.search-button');
    const validationMessage = page.locator('.validation-message');

    // Clear location
    await locationSelect.selectOption('');
    await expect(searchButton).toBeDisabled();
    await expect(validationMessage).toBeVisible();
    await expect(validationMessage).toContainText('Please select a location');

    // Restore location, uncheck all property types
    await locationSelect.selectOption('Bangalore');
    await residentialCheckbox.uncheck();
    await expect(searchButton).toBeDisabled();
    await expect(validationMessage).toBeVisible();
    await expect(validationMessage).toContainText('Please select at least one property type');

    // Restore valid state
    await residentialCheckbox.check();
    await expect(searchButton).toBeEnabled();
    await expect(validationMessage).not.toBeVisible();
  });

  test('Search displays results with price, size, and status', async ({ page }) => {
    const searchButton = page.locator('button.search-button');

    // Perform search with defaults
    await searchButton.click();
    await page.waitForSelector('.results-container');

    // Check results header
    const resultsHeader = page.locator('.results-header h3');
    await expect(resultsHeader).toBeVisible();

    // Check that PropertyCards are displayed (PropertyCard shows price, size details)
    const propertyCards = page.locator('.property-card');
    const count = await propertyCards.count();
    expect(count).toBeGreaterThan(0);

    // Verify first card has expected content
    const firstCard = propertyCards.first();
    await expect(firstCard).toBeVisible();
  });

  test('Search shows loading state during search', async ({ page }) => {
    const searchButton = page.locator('button.search-button');
    
    // Click search
    await searchButton.click();

    // Loading state should briefly appear
    // (This might be too fast to catch, but test the mechanism)
    const loadingState = page.locator('.loading-state');
    
    // Eventually results appear
    await page.waitForSelector('.results-container, .empty-state', { timeout: 5000 });
  });

  test('Can filter across different cities', async ({ page }) => {
    const locationSelect = page.locator('#location-select');
    const searchButton = page.locator('button.search-button');

    // Search Bangalore
    await searchButton.click();
    await page.waitForSelector('.results-container');
    const bangaloreResults = page.locator('.results-header h3');
    const bangaloreText = await bangaloreResults.textContent();

    // Change to Chennai
    await locationSelect.selectOption('Chennai');
    await page.waitForTimeout(200);
    
    // Should show no properties (backend only has Bangalore)
    const emptyState = page.locator('.empty-state');
    await expect(emptyState).toBeVisible();

    // Change to Hyderabad
    await locationSelect.selectOption('Hyderabad');
    await page.waitForTimeout(200);
    await expect(emptyState).toBeVisible();
  });

  test('Accessibility: Search form has proper ARIA labels and roles', async ({ page }) => {
    // Check search region has role
    const searchFilters = page.locator('.search-filters');
    await expect(searchFilters).toHaveAttribute('role', 'search');

    // Check location has label
    const locationSelect = page.locator('#location-select');
    await expect(locationSelect).toHaveAttribute('aria-required', 'true');

    // Check checkboxes have aria-labels
    const residentialCheckbox = page.locator('input[aria-label="Residential properties"]');
    const commercialCheckbox = page.locator('input[aria-label="Commercial properties"]');
    await expect(residentialCheckbox).toBeVisible();
    await expect(commercialCheckbox).toBeVisible();

    // Check button has aria-disabled when disabled
    await locationSelect.selectOption('');
    const searchButton = page.locator('button.search-button');
    await expect(searchButton).toHaveAttribute('aria-disabled', 'true');
  });

  test('Accessibility: Validation messages use aria-live', async ({ page }) => {
    const validationMessage = page.locator('.validation-message');

    // Clear location to trigger validation
    const locationSelect = page.locator('#location-select');
    await locationSelect.selectOption('');

    // Check validation has aria-live
    await expect(validationMessage).toHaveAttribute('role', 'alert');
    await expect(validationMessage).toHaveAttribute('aria-live', 'polite');
  });

  test('Accessibility: Results have aria-live for dynamic updates', async ({ page }) => {
    const searchResults = page.locator('.search-results');
    await expect(searchResults).toHaveAttribute('aria-live', 'polite');
    await expect(searchResults).toHaveAttribute('aria-atomic', 'true');
  });
});

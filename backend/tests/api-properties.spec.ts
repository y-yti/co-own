import { test, expect } from '@playwright/test';

// Backend API test using Playwright's request context
// Assumes backend server running locally on http://localhost:8000

const API_BASE = process.env.API_BASE || 'http://localhost:8000';

test.describe('Backend properties API', () => {
  test('returns properties with lat/lng', async ({ request }) => {
    const res = await request.get(`${API_BASE}/properties`);
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(Array.isArray(data.items)).toBeTruthy();

    for (const item of data.items) {
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('address');
      expect(item).toHaveProperty('lat');
      expect(item).toHaveProperty('lng');
      expect(typeof item.lat === 'number').toBeTruthy();
      expect(typeof item.lng === 'number').toBeTruthy();
    }
  });
});

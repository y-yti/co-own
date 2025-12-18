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

  test('returns all properties from all cities by default', async ({ request }) => {
    const res = await request.get(`${API_BASE}/properties`);
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(Array.isArray(data.items)).toBeTruthy();
    expect(data.items.length).toBeGreaterThan(0);

    // Verify properties from multiple cities are returned
    const cities = [...new Set(data.items.map((p: any) => p.city))];
    expect(cities.length).toBeGreaterThan(1);
    expect(cities).toContain('Bangalore');
    expect(cities).toContain('Hyderabad');
    expect(cities).toContain('Chennai');
  });

  test('filters properties by city when city parameter is provided', async ({ request }) => {
    const res = await request.get(`${API_BASE}/properties?city=Hyderabad`);
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(Array.isArray(data.items)).toBeTruthy();

    // All returned properties should be from Hyderabad
    for (const item of data.items) {
      expect(item.city).toBe('Hyderabad');
    }
  });

  test('filters properties by property type when type parameter is provided', async ({ request }) => {
    const res = await request.get(`${API_BASE}/properties?property_type=residential`);
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(Array.isArray(data.items)).toBeTruthy();

    // All returned properties should be residential
    for (const item of data.items) {
      expect(item.type).toBe('residential');
    }
  });

  test('filters by both city and property type', async ({ request }) => {
    const res = await request.get(`${API_BASE}/properties?city=Chennai&property_type=residential`);
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(Array.isArray(data.items)).toBeTruthy();

    for (const item of data.items) {
      expect(item.city).toBe('Chennai');
      expect(item.type).toBe('residential');
    }
  });

  test('returns property details for a specific property', async ({ request }) => {
    const res = await request.get(`${API_BASE}/properties/1/details`);
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    
    expect(data).toHaveProperty('property_id');
    expect(data.property_id).toBe(1);
    expect(data).toHaveProperty('property_name');
    expect(data).toHaveProperty('units');
    expect(Array.isArray(data.units)).toBeTruthy();
    expect(data).toHaveProperty('open_offers_summary');
    expect(data).toHaveProperty('recent_transaction');
  });

  test('returns 404 for non-existent property details', async ({ request }) => {
    const res = await request.get(`${API_BASE}/properties/999/details`);
    expect(res.status()).toBe(404);
  });
});


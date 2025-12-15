// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  timeout: 30_000,
  fullyParallel: true,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  use: {
    headless: true,
    trace: 'on-first-retry',
  },
  projects: [
    // Frontend UI tests: run on Vite dev server
    {
      name: 'chromium-frontend',
      testMatch: ['frontend/tests/**/*.spec.ts'],
      use: { ...devices['Desktop Chrome'], baseURL: process.env.BASE_URL || 'http://127.0.0.1:5173' },
    },
    // Backend API tests (no browser navigation needed)
    {
      name: 'api-backend',
      testMatch: ['backend/tests/**/*.spec.ts'],
      use: { baseURL: process.env.API_BASE || 'http://localhost:8000' },
    },
  ],
});

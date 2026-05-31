import { test, expect } from '@playwright/test';

test.describe('Authentication Middleware Interception', () => {
  const protectedRoutes = ['/dashboard', '/resume', '/interview'];

  for (const route of protectedRoutes) {
    test(`should redirect unauthenticated request to sign-in from protected path: ${route}`, async ({ page }, testInfo) => {
      const baseURL = testInfo.project.use.baseURL ?? 'http://127.0.0.1:3100';
      const response = await page.request.fetch(`${baseURL}${route}`, { maxRedirects: 0 });

      expect(response.status()).toBe(307);
      expect(response.headers()['location']).toContain('/sign-in');
    });
  }
});

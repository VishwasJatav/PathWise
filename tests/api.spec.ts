import { test, expect } from '@playwright/test';

test.describe('API and Webhook Routing Interception Tests', () => {
  test('should mock Inngest API webhook endpoints successfully', async ({ page }) => {
    // Navigate to initialize page window context
    await page.goto('/');

    // Mock the Inngest API hook
    await page.route('**/api/inngest', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Inngest webhook mock intercept successful',
          status: 'success'
        }),
      });
    });

    // Make an API request from within the page context
    const result = await page.evaluate(async () => {
      const response = await fetch('/api/inngest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'test.inngest.event',
          data: {}
        })
      });
      return {
        status: response.status,
        body: await response.json()
      };
    });

    // Assert custom mocked responses
    expect(result.status).toBe(200);
    expect(result.body.status).toBe('success');
    expect(result.body.message).toContain('mock intercept');
  });
});

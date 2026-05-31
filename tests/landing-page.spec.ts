import { test, expect } from '@playwright/test';

test.describe('Landing Page E2E Tests', () => {
  let consoleErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('main', { timeout: 15000 });
  });

  test('should render navbar and essential CTA components', async ({ page }) => {
    const logo = page.getByRole('link', { name: /rixora/i }).first();
    await expect(logo).toBeVisible();

    await expect(page.getByText(/navigate your/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /start architecting/i })).toBeVisible();
  });

  test('should verify responsive viewport and mobile navigation menu', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    await expect(page.getByRole('link', { name: /rixora/i }).first()).toBeVisible();
  });

  test('should verify there are no critical console errors on load', async () => {
    expect(consoleErrors).toEqual([]);
  });

  test('should support visual regression checks', async ({ page }) => {
    await page.waitForTimeout(5000);
    await page.addStyleTag({
      content: '* { animation-duration: 0s !important; transition-duration: 0s !important; }'
    });

    await expect(page.locator('main > section').first()).toHaveScreenshot({ maxDiffPixels: 1200, timeout: 15000 });
  });
});

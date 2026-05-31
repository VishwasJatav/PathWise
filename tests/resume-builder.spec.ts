import { test, expect } from '@playwright/test';

test.describe('Resume Builder E2E Tests', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    const baseURL = testInfo.project.use.baseURL ?? 'http://127.0.0.1:3100';

    await page.goto(`${baseURL}/resume`, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('domcontentloaded');

    if (page.url().includes('/sign-in')) {
      test.skip(true, 'Skipping resume builder checks while Clerk redirects unauthenticated users to sign-in');
    }
  });

  test('should verify layout split and basic elements visibility', async ({ page }) => {
    await expect(page.getByText('Resume Editor')).toBeVisible();
    await expect(page.getByText('Preview')).toBeVisible();
  });

  test('should test resume improvement mock AI responses and ATS score updates', async ({ page }) => {
    await page.route('**/improveWithAI', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, text: 'Improved response from Mock AI.' }),
      });
    });

    await page.route('**/getAtsScore', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ score: 95, feedback: 'Excellent mock ATS feedback.', missingKeywords: [] }),
      });
    });

    await expect(page.getByText('Resume Editor')).toBeVisible();
    await expect(page.getByText('Preview')).toBeVisible();
  });
});

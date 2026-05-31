import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow E2E Tests', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    const baseURL = testInfo.project.use.baseURL ?? 'http://127.0.0.1:3100';

    await page.goto(`${baseURL}/onboarding`, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('domcontentloaded');

    if (page.url().includes('/sign-in')) {
      test.skip(true, 'Skipping onboarding flow checks while Clerk redirects unauthenticated users to sign-in');
    }
  });

  test('should validate onboarding inputs and trigger client-side validation errors', async ({ page }) => {
    const expInput = page.locator('#experience');
    const skillsInput = page.locator('#skills');
    const bioTextarea = page.locator('#bio');
    const submitBtn = page.locator('button[type="submit"]');

    await expect(expInput).toBeVisible();
    await expect(skillsInput).toBeVisible();
    await expect(bioTextarea).toBeVisible();

    await submitBtn.click();

    const industryError = page.locator('text=Please select an industry');
    await expect(industryError).toBeVisible();
  });

  test('should fill out onboarding form successfully', async ({ page }) => {
    await page.click('role=combobox[name="Search and select an industry..."]');
    await page.click('role=option >> nth=0');

    await page.click('role=combobox[name="Search your specialization..."]');
    await page.click('role=option >> nth=0');

    await page.fill('#experience', '5');
    await page.fill('#skills', 'TypeScript, Playwright, E2E, Next.js');
    await page.fill('#bio', 'I am an automated QA testing profile.');

    await page.route('**/_next/data/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.click('button[type="submit"]');
  });
});

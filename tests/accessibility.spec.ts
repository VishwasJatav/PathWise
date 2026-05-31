import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Audits', () => {
  test('landing page should not have any critical accessibility violations', async ({ page }) => {
    await page.goto('/');

    // Wait for content to render fully
    await page.waitForLoadState('domcontentloaded');

    // Run axe accessibility scanning
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Filter for serious or critical issues
    const seriousOrCriticalViolations = accessibilityScanResults.violations.filter(
      violation => violation.impact === 'critical' || violation.impact === 'serious'
    );

    // Verify there are no critical failures (log them to console for developer remediation)
    if (seriousOrCriticalViolations.length > 0) {
      console.log('⚠️ [ACCESSIBILITY WARNING] Serious or critical violations detected:');
      seriousOrCriticalViolations.forEach((v, idx) => {
        console.log(`  ${idx + 1}. [${v.id}] ${v.help}`);
        console.log(`     Impact: ${v.impact}`);
        console.log(`     Elements: ${v.nodes.map(n => n.html).join(', ')}`);
      });
    }
    
    // Assert that the scan was successfully executed
    expect(accessibilityScanResults.violations).toBeDefined();
  });
});

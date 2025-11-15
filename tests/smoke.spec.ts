import { test, expect } from '@playwright/test';

test('AI Bio Booster smoke', async ({ page }) => {
  await page.goto('/tools/ai-bio-booster/');
  await page.locator('#prompt').fill('Product designer, SaaS B2B, focus UX ROI, FR/EN');
  await page.locator('#tone').selectOption({ label: 'LinkedIn' });
  await page.getByRole('button', { name: 'Générer ma bio' }).click();
  await expect(page.locator('#status')).toContainText('✅');
  await expect(page.locator('#result')).not.toBeEmpty();
});

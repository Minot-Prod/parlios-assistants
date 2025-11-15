import { test, expect } from '@playwright/test';
test('headline-wizard smoke', async ({ page }) => {
  await page.goto('/tools/headline-wizard/');
  await page.locator('#prompt').fill('Contexte test rapide');
  await page.locator('#tone').selectOption({ label: 'LinkedIn' });
  await page.getByRole('button', { name: 'Générer' }).click();
  await expect(page.locator('#status')).toContainText('✅');
  await expect(page.locator('#result')).not.toBeEmpty();
});

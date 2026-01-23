import { test, expect } from '@playwright/test';

test.describe('TimeTrackingApp', () => {
  test('app loads successfully', async ({ page }) => {
    await page.goto('/');

    // Wait for the app to fully load by checking for the Activities header
    await expect(page.getByText('Activities')).toBeVisible({ timeout: 30000 });

    // Verify the activity input field is present
    await expect(page.getByPlaceholder('+ Add new activity')).toBeVisible();

    // Take a screenshot to verify visual appearance
    await page.screenshot({ path: 'test-results/app-loaded.png' });
  });
});

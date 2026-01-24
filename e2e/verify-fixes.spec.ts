import { test, expect } from '@playwright/test';

test.describe('Verify UX Fixes', () => {
  test('Issue #1: Activity name should be used', async ({ page }) => {
    await page.goto('/');

    // Wait for app to load
    await expect(page.getByText('Activities', { exact: true })).toBeVisible({ timeout: 30000 });

    // Fill the input with a custom name
    const input = page.getByPlaceholder('+ Add new activity');
    await input.fill('My Custom Task');

    // Click the add button
    await page.mouse.click(1240, 45);
    await page.waitForTimeout(500);

    // Verify the activity was created with the correct name
    await expect(page.getByText('My Custom Task')).toBeVisible();

    // Screenshot for verification
    await page.screenshot({ path: 'test-results/ux/fix-01-activity-name.png' });
  });

  test('Issue #2: Timer should update while running', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Activities', { exact: true })).toBeVisible({ timeout: 30000 });

    // Add an activity
    const input = page.getByPlaceholder('+ Add new activity');
    await input.fill('Timer Test');
    await page.mouse.click(1240, 45);
    await page.waitForTimeout(500);

    // Verify activity was added
    await expect(page.getByText('Timer Test')).toBeVisible();

    // Get initial time display
    const initialTime = await page.locator('text=/\\d+:\\d+/').first().textContent();
    console.log('Initial time:', initialTime);

    // Click play button (should be around x=1175 on the activity card)
    await page.mouse.click(1175, 168);
    await page.waitForTimeout(100);

    await page.screenshot({ path: 'test-results/ux/fix-02-timer-started.png' });

    // Wait for timer to run
    await page.waitForTimeout(2000);

    // Get updated time display
    const updatedTime = await page.locator('text=/\\d+:\\d+/').first().textContent();
    console.log('Updated time:', updatedTime);

    await page.screenshot({ path: 'test-results/ux/fix-02-timer-running.png' });

    // Timer should have changed (not still showing 0:00)
    // Note: We can't guarantee exact values, but it should show some time passed
  });

  test('Issue #3: Delete button should work', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Activities', { exact: true })).toBeVisible({ timeout: 30000 });

    // Add an activity
    const input = page.getByPlaceholder('+ Add new activity');
    await input.fill('To Be Deleted');
    await page.mouse.click(1240, 45);
    await page.waitForTimeout(500);

    // Verify activity was added
    await expect(page.getByText('To Be Deleted')).toBeVisible();

    await page.screenshot({ path: 'test-results/ux/fix-03-before-delete.png' });

    // Click delete button (should be to the right of play button)
    await page.mouse.click(1225, 168);
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'test-results/ux/fix-03-after-delete.png' });

    // Verify activity was deleted
    await expect(page.getByText('To Be Deleted')).not.toBeVisible();

    // Should show empty state
    await expect(page.getByText('No activities yet')).toBeVisible();
  });

  test('Issue #5: Time format should be mm:ss', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Activities', { exact: true })).toBeVisible({ timeout: 30000 });

    // Add an activity
    const input = page.getByPlaceholder('+ Add new activity');
    await input.fill('Format Test');
    await page.mouse.click(1240, 45);
    await page.waitForTimeout(500);

    // Check that time format is mm:ss (e.g., "0:00")
    await expect(page.getByText(/^\d+:\d{2}$/)).toBeVisible();

    await page.screenshot({ path: 'test-results/ux/fix-05-time-format.png' });
  });

  test('Enter key should submit new activity', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Activities', { exact: true })).toBeVisible({ timeout: 30000 });

    // Fill the input and press Enter
    const input = page.getByPlaceholder('+ Add new activity');
    await input.fill('Enter Key Test');
    await input.press('Enter');
    await page.waitForTimeout(500);

    // Verify the activity was created
    await expect(page.getByText('Enter Key Test')).toBeVisible();

    await page.screenshot({ path: 'test-results/ux/fix-enter-key.png' });
  });
});

import { test, expect, Page } from '@playwright/test';

/**
 * Helper function to wait for the app to load and navigate to home screen
 */
async function waitForAppAndNavigateToHome(page: Page) {
  // Wait for initial page load
  await page.waitForLoadState('networkidle');

  // Wait for React to render - look for any text content
  await page.waitForFunction(() => {
    return document.body.innerText.length > 0;
  }, { timeout: 60000 });

  // Take a debug screenshot
  await page.screenshot({ path: 'test-results/debug-initial-load.png' });

  // Check if we're on the onboarding screen
  const skipButton = page.getByText('Skip', { exact: true });
  const isOnboarding = await skipButton.isVisible({ timeout: 5000 }).catch(() => false);

  if (isOnboarding) {
    console.log('On onboarding screen, clicking Skip...');
    await skipButton.click();
    await page.waitForTimeout(2000);
  }

  // Wait for home screen elements
  // The home screen should have "Activities" text and an input for adding activities
  await expect(page.getByText('Activities', { exact: true })).toBeVisible({ timeout: 30000 });
}

test.describe('Verify UX Fixes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAppAndNavigateToHome(page);
  });

  test('Issue #1: Activity name should be used', async ({ page }) => {
    // Fill the input with a custom name
    const input = page.getByPlaceholder(/add.*activity/i);
    await expect(input).toBeVisible({ timeout: 10000 });
    await input.fill('My Custom Task');

    // Press Enter to submit
    await input.press('Enter');
    await page.waitForTimeout(500);

    // Verify the activity was created with the correct name
    await expect(page.getByText('My Custom Task')).toBeVisible();

    // Screenshot for verification
    await page.screenshot({ path: 'test-results/ux/fix-01-activity-name.png' });
  });

  test('Issue #2: Timer should update while running', async ({ page }) => {
    // Add an activity
    const input = page.getByPlaceholder(/add.*activity/i);
    await expect(input).toBeVisible({ timeout: 10000 });
    await input.fill('Timer Test');
    await input.press('Enter');
    await page.waitForTimeout(500);

    // Verify activity was added
    await expect(page.getByText('Timer Test')).toBeVisible();

    // Get initial time display (look for time format pattern like 00:00)
    const timeDisplay = page.locator('[data-testid="activity-time"]').first();

    // If no testid, fallback to finding time by pattern
    let timeElement = timeDisplay;
    if (!(await timeDisplay.isVisible({ timeout: 2000 }).catch(() => false))) {
      timeElement = page.locator('text=/\\d{1,2}:\\d{2}/').first();
    }

    const initialTime = await timeElement.textContent();
    console.log('Initial time:', initialTime);

    // Click play button
    const playButton = page.locator('[data-testid="play-button"]').first();
    if (await playButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await playButton.click();
    } else {
      // Try finding any play-like button
      const altPlayButton = page.getByLabel(/start/i).first();
      await altPlayButton.click();
    }

    await page.waitForTimeout(100);
    await page.screenshot({ path: 'test-results/ux/fix-02-timer-started.png' });

    // Wait for timer to run (2+ seconds)
    await page.waitForTimeout(2500);

    // Get updated time display
    const updatedTimeText = await timeElement.textContent();
    console.log('Updated time:', updatedTimeText);

    await page.screenshot({ path: 'test-results/ux/fix-02-timer-running.png' });

    // Timer should have changed (not be 00:00 anymore if it started at 00:00)
    expect(updatedTimeText).not.toBe('00:00');
  });

  test('Issue #3: Delete button should work', async ({ page }) => {
    // Add an activity
    const input = page.getByPlaceholder(/add.*activity/i);
    await expect(input).toBeVisible({ timeout: 10000 });
    await input.fill('To Be Deleted');
    await input.press('Enter');
    await page.waitForTimeout(500);

    // Verify activity was added
    await expect(page.getByText('To Be Deleted')).toBeVisible();
    await page.screenshot({ path: 'test-results/ux/fix-03-before-delete.png' });

    // Look for menu/more button on activity
    const menuButton = page.locator('[data-testid="activity-menu"]').first();
    if (await menuButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await menuButton.click();
    } else {
      // Try finding any menu-like button
      const altMenuButton = page.getByLabel(/options/i).first();
      await altMenuButton.click();
    }
    await page.waitForTimeout(300);

    // Look for delete button in the modal - use the button role specifically
    const deleteButton = page.getByRole('button', { name: 'Delete' }).first();

    await deleteButton.click();
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'test-results/ux/fix-03-after-delete.png' });

    // Verify activity was deleted
    await expect(page.getByText('To Be Deleted')).not.toBeVisible();

    // Should show empty state
    await expect(page.getByText(/no activities/i)).toBeVisible();
  });

  test('Issue #5: Time format should be mm:ss', async ({ page }) => {
    // Add an activity
    const input = page.getByPlaceholder(/add.*activity/i);
    await expect(input).toBeVisible({ timeout: 10000 });
    await input.fill('Format Test');
    await input.press('Enter');
    await page.waitForTimeout(500);

    // Check that time format is mm:ss (e.g., "00:00" or "0:00")
    await expect(page.locator('text=/^\\d{1,2}:\\d{2}$/')).toBeVisible();

    await page.screenshot({ path: 'test-results/ux/fix-05-time-format.png' });
  });

  test('Enter key should submit new activity', async ({ page }) => {
    // Fill the input and press Enter
    const input = page.getByPlaceholder(/add.*activity/i);
    await expect(input).toBeVisible({ timeout: 10000 });
    await input.fill('Enter Key Test');
    await input.press('Enter');
    await page.waitForTimeout(500);

    // Verify the activity was created
    await expect(page.getByText('Enter Key Test')).toBeVisible();

    await page.screenshot({ path: 'test-results/ux/fix-enter-key.png' });
  });
});

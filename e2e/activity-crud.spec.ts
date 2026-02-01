import { test, expect } from '@playwright/test';

test.describe('Activity CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Skip auth if needed
    const skipButton = page.getByText('Skip', { exact: true });
    if (await skipButton.isVisible().catch(() => false)) {
      await skipButton.click();
      await page.waitForTimeout(1000);
    }

    // Wait for main screen
    await page.waitForSelector('input, [data-testid="activity-input"]', { timeout: 10000 });
  });

  test('should create a new activity', async ({ page }) => {
    const activityName = 'Test Activity ' + Date.now();

    // Find input and add activity
    const input = page.getByPlaceholder(/add.*activity/i);
    await input.fill(activityName);
    await input.press('Enter');
    await page.waitForTimeout(500);

    // Verify activity appears
    await expect(page.getByText(activityName)).toBeVisible();

    await page.screenshot({ path: 'test-results/crud/create-activity.png' });
  });

  test('should create multiple activities', async ({ page }) => {
    const activities = ['Work', 'Study', 'Exercise'];

    for (const name of activities) {
      const input = page.getByPlaceholder(/add.*activity/i);
      await input.fill(name);
      await input.press('Enter');
      await page.waitForTimeout(300);
    }

    // Verify all activities appear
    for (const name of activities) {
      await expect(page.getByText(name, { exact: true })).toBeVisible();
    }

    await page.screenshot({ path: 'test-results/crud/multiple-activities.png' });
  });

  test('should start and stop timer', async ({ page }) => {
    // Create activity
    const input = page.getByPlaceholder(/add.*activity/i);
    await input.fill('Timer Test');
    await input.press('Enter');
    await page.waitForTimeout(500);

    // Find and click play button
    const activityRow = page.locator('text=Timer Test').locator('..').locator('..');

    // Start timer - click the play icon
    await activityRow.locator('svg, [data-testid*="play"]').first().click().catch(async () => {
      // Fallback: click on the activity card
      await activityRow.click();
    });

    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/crud/timer-running.png' });

    // Stop timer - click again
    await activityRow.locator('svg, [data-testid*="pause"], [data-testid*="stop"]').first().click().catch(async () => {
      await activityRow.click();
    });

    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/crud/timer-stopped.png' });

    // Time should not be 0:00 anymore
    const timeText = await activityRow.locator('text=/\\d+:\\d{2}/').first().textContent();
    expect(timeText).not.toBe('0:00');
  });

  test('should delete activity', async ({ page }) => {
    const activityName = 'Delete Me ' + Date.now();

    // Create activity
    const input = page.getByPlaceholder(/add.*activity/i);
    await input.fill(activityName);
    await input.press('Enter');
    await page.waitForTimeout(500);

    // Verify it exists
    await expect(page.getByText(activityName)).toBeVisible();

    // Find and click menu button on activity
    const activityRow = page.locator(`text=${activityName}`).locator('..').locator('..');

    // Try to find menu/more button
    const menuButton = activityRow.locator('[data-testid*="menu"], svg[name*="ellipsis"]').first();
    if (await menuButton.isVisible().catch(() => false)) {
      await menuButton.click();
      await page.waitForTimeout(300);
    }

    // Click delete button
    const deleteButton = page.getByText('Delete', { exact: true });
    await deleteButton.click();
    await page.waitForTimeout(500);

    // Verify activity is gone
    await expect(page.getByText(activityName)).not.toBeVisible();

    await page.screenshot({ path: 'test-results/crud/after-delete.png' });
  });

  test('should show empty state when no activities', async ({ page }) => {
    // Look for empty state message
    const hasEmptyState = await page.getByText('No activities yet').isVisible().catch(() => false);

    if (!hasEmptyState) {
      // Delete all existing activities first
      const deleteButtons = page.locator('[data-testid*="delete"], text=Delete');
      const count = await deleteButtons.count();

      for (let i = 0; i < count; i++) {
        await deleteButtons.first().click();
        await page.waitForTimeout(300);
      }
    }

    // Now check for empty state
    await expect(page.getByText('No activities yet')).toBeVisible();

    await page.screenshot({ path: 'test-results/crud/empty-state.png' });
  });

  test('should persist activities after page refresh', async ({ page }) => {
    const activityName = 'Persist Test ' + Date.now();

    // Create activity
    const input = page.getByPlaceholder(/add.*activity/i);
    await input.fill(activityName);
    await input.press('Enter');
    await page.waitForTimeout(500);

    // Verify it exists
    await expect(page.getByText(activityName)).toBeVisible();

    // Refresh page
    await page.reload();
    await page.waitForTimeout(1000);

    // Verify activity still exists
    await expect(page.getByText(activityName)).toBeVisible();

    await page.screenshot({ path: 'test-results/crud/persist-after-refresh.png' });
  });

  test('should navigate between tabs', async ({ page }) => {
    // Find tab bar and navigate
    const timerTab = page.locator('[data-testid="timer-tab"]').or(
      page.getByLabel('Timer')
    );
    const homeTab = page.locator('[data-testid="home-tab"]').or(
      page.getByLabel('Home')
    );
    const dataTab = page.locator('[data-testid="data-tab"]').or(
      page.getByLabel('Data')
    );

    // Navigate to Timer tab
    if (await timerTab.isVisible().catch(() => false)) {
      await timerTab.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/crud/timer-tab.png' });
    }

    // Navigate to Data tab
    if (await dataTab.isVisible().catch(() => false)) {
      await dataTab.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/crud/data-tab.png' });
    }

    // Navigate back to Home tab
    if (await homeTab.isVisible().catch(() => false)) {
      await homeTab.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/crud/home-tab.png' });
    }
  });

  test('should open calendar modal', async ({ page }) => {
    // Look for calendar button
    const calendarButton = page.getByLabel('Calendar').or(
      page.locator('[data-testid="calendar-button"]')
    );

    if (await calendarButton.isVisible().catch(() => false)) {
      await calendarButton.click();
      await page.waitForTimeout(500);

      // Calendar modal should be visible
      const hasCalendar =
        (await page.getByText('Go to Today').isVisible().catch(() => false)) ||
        (await page.locator('[data-testid="calendar-modal"]').isVisible().catch(() => false));

      await page.screenshot({ path: 'test-results/crud/calendar-modal.png' });

      expect(hasCalendar).toBeTruthy();
    }
  });
});

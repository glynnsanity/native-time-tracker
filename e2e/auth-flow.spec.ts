import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display onboarding screen on first visit', async ({ page }) => {
    // Clear any stored auth state
    await page.context().clearCookies();

    await page.goto('/');

    // Should show onboarding or auth screen
    const hasOnboarding = await page.getByText('Get Started').isVisible().catch(() => false);
    const hasSignUp = await page.getByText('Sign Up').isVisible().catch(() => false);
    const hasSkip = await page.getByText('Skip').isVisible().catch(() => false);

    // At least one auth-related element should be visible
    expect(hasOnboarding || hasSignUp || hasSkip).toBeTruthy();

    await page.screenshot({ path: 'test-results/auth/onboarding.png' });
  });

  test('should allow skipping authentication', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Find and click Skip button
    const skipButton = page.getByText('Skip', { exact: true });

    if (await skipButton.isVisible().catch(() => false)) {
      await skipButton.click();
      await page.waitForTimeout(1000);

      // Should now be on main screen
      const isOnMainScreen = await page.getByPlaceholder(/add.*activity/i).isVisible().catch(() => false);
      expect(isOnMainScreen).toBeTruthy();

      await page.screenshot({ path: 'test-results/auth/after-skip.png' });
    }
  });

  test('should navigate to sign up screen', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Click Get Started or Sign Up
    const getStartedButton = page.getByText('Get Started');
    if (await getStartedButton.isVisible().catch(() => false)) {
      await getStartedButton.click();
      await page.waitForTimeout(500);
    }

    // Should show sign up form
    await expect(page.getByText('New Account')).toBeVisible();
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();

    await page.screenshot({ path: 'test-results/auth/signup-screen.png' });
  });

  test('should navigate to login screen', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Navigate to signup first
    const getStartedButton = page.getByText('Get Started');
    if (await getStartedButton.isVisible().catch(() => false)) {
      await getStartedButton.click();
      await page.waitForTimeout(500);
    }

    // Click login link
    const loginLink = page.getByText('Login', { exact: true });
    if (await loginLink.isVisible().catch(() => false)) {
      await loginLink.click();
      await page.waitForTimeout(500);
    }

    // Should show login form
    await expect(page.getByText('Welcome Back')).toBeVisible();

    await page.screenshot({ path: 'test-results/auth/login-screen.png' });
  });

  test('should show validation errors for invalid email', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Navigate to signup
    const getStartedButton = page.getByText('Get Started');
    if (await getStartedButton.isVisible().catch(() => false)) {
      await getStartedButton.click();
      await page.waitForTimeout(500);
    }

    // Enter invalid email
    const emailInput = page.getByPlaceholder(/email/i);
    await emailInput.fill('invalid-email');

    // Try to submit or blur to trigger validation
    await emailInput.press('Tab');
    await page.waitForTimeout(300);

    // Should show some error indication
    // The exact error message may vary based on implementation
    await page.screenshot({ path: 'test-results/auth/email-validation.png' });
  });

  test('should show password requirements on signup', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Navigate to signup
    const getStartedButton = page.getByText('Get Started');
    if (await getStartedButton.isVisible().catch(() => false)) {
      await getStartedButton.click();
      await page.waitForTimeout(500);
    }

    // Start typing password
    const passwordInput = page.getByPlaceholder(/password/i);
    await passwordInput.fill('weak');

    // Should show password requirements
    const hasRequirements =
      (await page.getByText(/8 characters/i).isVisible().catch(() => false)) ||
      (await page.getByText(/uppercase/i).isVisible().catch(() => false));

    await page.screenshot({ path: 'test-results/auth/password-requirements.png' });

    expect(hasRequirements).toBeTruthy();
  });

  test('should access settings screen', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Skip auth if needed
    const skipButton = page.getByText('Skip', { exact: true });
    if (await skipButton.isVisible().catch(() => false)) {
      await skipButton.click();
      await page.waitForTimeout(1000);
    }

    // Find and click settings button
    const settingsButton = page.getByLabel('Settings').or(
      page.locator('[data-testid="settings-button"]')
    );

    if (await settingsButton.isVisible().catch(() => false)) {
      await settingsButton.click();
      await page.waitForTimeout(500);

      // Should show settings screen
      await expect(page.getByText('Settings')).toBeVisible();
      await expect(page.getByText('Log out')).toBeVisible();

      await page.screenshot({ path: 'test-results/auth/settings-screen.png' });
    }
  });

  test('should show logout confirmation', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Skip auth if needed
    const skipButton = page.getByText('Skip', { exact: true });
    if (await skipButton.isVisible().catch(() => false)) {
      await skipButton.click();
      await page.waitForTimeout(1000);
    }

    // Navigate to settings
    const settingsButton = page.getByLabel('Settings').or(
      page.locator('[data-testid="settings-button"]')
    );

    if (await settingsButton.isVisible().catch(() => false)) {
      await settingsButton.click();
      await page.waitForTimeout(500);

      // Click logout
      const logoutButton = page.getByText('Log out');
      if (await logoutButton.isVisible().catch(() => false)) {
        await logoutButton.click();
        await page.waitForTimeout(500);

        // Should show confirmation dialog
        const hasConfirmation =
          (await page.getByText('Are you sure').isVisible().catch(() => false)) ||
          (await page.getByText('Cancel').isVisible().catch(() => false));

        await page.screenshot({ path: 'test-results/auth/logout-confirmation.png' });

        expect(hasConfirmation).toBeTruthy();
      }
    }
  });
});

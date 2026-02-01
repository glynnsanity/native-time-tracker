import { test, expect } from '@playwright/test';

test('Debug app loading', async ({ page }) => {
  const errors: string[] = [];
  const logs: string[] = [];

  // Listen for console messages BEFORE navigating
  page.on('console', msg => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', err => {
    errors.push(`PAGE ERROR: ${err.message}`);
  });

  // Navigate to app
  await page.goto('/');

  // Wait for page to load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(10000);

  // Take screenshot
  await page.screenshot({ path: 'test-results/debug-load.png', fullPage: true });

  // Print all logs and errors
  console.log('\n=== BROWSER CONSOLE LOGS ===');
  logs.forEach(log => console.log(log));

  console.log('\n=== PAGE ERRORS ===');
  errors.forEach(err => console.log(err));

  // Get page content
  const bodyText = await page.locator('body').innerText();
  console.log('\n=== PAGE TEXT ===');
  console.log(bodyText || '(empty)');

  // Get the root div content
  const rootHtml = await page.locator('#root').innerHTML();
  console.log('\n=== ROOT DIV HTML ===');
  console.log(rootHtml || '(empty)');
});

import { test, expect } from '@playwright/test';

test('debug login flow', async ({ page }) => {
    await page.goto('/');
    await page.screenshot({ path: 'debug-home.png' });

    // Try to find login button
    await page.click('text=Log in');
    await page.screenshot({ path: 'debug-login-page.png' });

    // Try login
    await page.fill('#email', 'marsh11272@yahoo.com');
    await page.fill('#password', 'TestPassword123!');
    await page.screenshot({ path: 'debug-before-submit.png' });

    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'debug-after-submit.png' });

    // Check what's on the page
    const content = await page.content();
    console.log('Page content length:', content.length);

    // Look for any error messages
    const errorMessages = await page.locator('[class*="error"], .alert, [role="alert"]').allTextContents();
    console.log('Error messages:', errorMessages);

    // Check current URL
    console.log('Current URL:', page.url());

    // Check if there are any console errors
    page.on('console', msg => console.log('Browser console:', msg.text()));
});
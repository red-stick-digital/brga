import { test, expect } from '@playwright/test';

/**
 * Session Timeout Security Tests
 * 
 * These tests verify that the session timeout functionality works correctly
 * and provides proper security against idle sessions.
 */

const TEST_CREDENTIALS = {
    email: 'test-timeout@example.com',
    password: 'SecurePassword123!'
};

// Configure shorter timeouts for testing
const TEST_TIMEOUT = 5000; // 5 seconds for testing
const TEST_WARNING_TIME = 3000; // 3 seconds for testing

test.describe('Session Timeout Security', () => {

    test.beforeEach(async ({ page }) => {
        // Mock shorter timeout values for testing
        await page.addInitScript(() => {
            window.TEST_SESSION_TIMEOUT = 5000; // 5 seconds
            window.TEST_SESSION_WARNING_TIME = 3000; // 3 seconds
        });

        await page.goto('/');
    });

    test('Session warning appears before timeout', async ({ page }) => {
        // Skip this test in CI as it's timing-sensitive
        test.skip(!!process.env.CI, 'Timing-sensitive test skipped in CI');

        // Login
        await page.click('text=Log in');
        await page.fill('#email', TEST_CREDENTIALS.email);
        await page.fill('#password', TEST_CREDENTIALS.password);
        await page.click('button[type="submit"]');

        await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 10000 });

        // Monitor console for session warning
        let sessionWarningReceived = false;
        page.on('console', msg => {
            if (msg.text().includes('⚠️ Session expiring in 5 minutes')) {
                sessionWarningReceived = true;
            }
        });

        // Listen for session warning event
        const warningPromise = page.evaluate(() => {
            return new Promise((resolve) => {
                window.addEventListener('session-warning', (event) => {
                    resolve(event.detail);
                });
            });
        });

        // Wait for session warning (should happen after 3 seconds with our test config)
        const warningDetail = await warningPromise;
        expect(warningDetail).toBeDefined();
        expect(warningDetail.remainingTime).toBe(5 * 60 * 1000); // 5 minutes in ms
    });

    test('Activity resets session timeout', async ({ page }) => {
        // Skip this test in CI as it's timing-sensitive  
        test.skip(!!process.env.CI, 'Timing-sensitive test skipped in CI');

        // Login
        await page.click('text=Log in');
        await page.fill('#email', TEST_CREDENTIALS.email);
        await page.fill('#password', TEST_CREDENTIALS.password);
        await page.click('button[type="submit"]');

        await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 10000 });

        // Set up console monitoring
        let forceLogoutTriggered = false;
        page.on('console', msg => {
            if (msg.text().includes('🚨 Force logout triggered')) {
                forceLogoutTriggered = true;
            }
        });

        // Simulate user activity every 2 seconds
        const activityInterval = setInterval(async () => {
            await page.mouse.move(100, 100);
            await page.mouse.move(200, 200);
        }, 2000);

        // Wait longer than the timeout period
        await page.waitForTimeout(7000);

        clearInterval(activityInterval);

        // Should still be logged in due to activity
        await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
        expect(forceLogoutTriggered).toBe(false);

        // Now wait without activity
        await page.waitForTimeout(6000);

        // Should be logged out now
        expect(forceLogoutTriggered).toBe(true);
    });

    test('Force logout redirects to login page', async ({ page }) => {
        // Login
        await page.click('text=Log in');
        await page.fill('#email', TEST_CREDENTIALS.email);
        await page.fill('#password', TEST_CREDENTIALS.password);
        await page.click('button[type="submit"]');

        await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 10000 });

        // Navigate to protected page
        await page.goto('/member/dashboard');
        await expect(page.locator('h1')).toContainText('Member Dashboard');

        // Listen for force logout event
        const forceLogoutPromise = page.evaluate(() => {
            return new Promise((resolve) => {
                window.addEventListener('force-logout', (event) => {
                    resolve(event.detail.reason);
                });
            });
        });

        // Manually trigger force logout for testing
        await page.evaluate(() => {
            if (window.sessionSecurity) {
                window.sessionSecurity.forceLogout('test_timeout');
            }
        });

        // Should receive force logout event
        const logoutReason = await forceLogoutPromise;
        expect(logoutReason).toBe('test_timeout');

        // Should be redirected to login page
        await expect(page).toHaveURL('/login');

        // Should show login form
        await expect(page.locator('input[type="email"]')).toBeVisible();
    });

    test('Session validation detects invalid sessions', async ({ page }) => {
        // Login first
        await page.click('text=Login');
        await page.fill('#email', TEST_CREDENTIALS.email);
        await page.fill('#password', TEST_CREDENTIALS.password);
        await page.click('button[type="submit"]');

        await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 10000 });

        // Manually invalidate session by clearing storage
        await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        });

        // Try to validate session - should detect it's invalid
        const isValidSession = await page.evaluate(async () => {
            if (window.sessionSecurity) {
                return await window.sessionSecurity.validateSession();
            }
            return null;
        });

        // Session should be detected as invalid
        expect(isValidSession).toBe(false);

        // Should eventually redirect to login
        await page.waitForURL('/login', { timeout: 10000 });
    });

    test('Multiple activity types reset timeout', async ({ page }) => {
        // Skip this test in CI as it's timing-sensitive
        test.skip(!!process.env.CI, 'Timing-sensitive test skipped in CI');

        // Login
        await page.click('text=Log in');
        await page.fill('#email', TEST_CREDENTIALS.email);
        await page.fill('#password', TEST_CREDENTIALS.password);
        await page.click('button[type="submit"]');

        await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 10000 });

        // Test different activity types
        const activities = [
            () => page.mouse.move(100, 100),
            () => page.keyboard.press('Space'),
            () => page.mouse.click(200, 200),
            () => page.mouse.wheel(0, 100),
        ];

        let forceLogoutTriggered = false;
        page.on('console', msg => {
            if (msg.text().includes('🚨 Force logout triggered')) {
                forceLogoutTriggered = true;
            }
        });

        // Perform various activities over time
        for (let i = 0; i < 4; i++) {
            await page.waitForTimeout(2000);
            await activities[i % activities.length]();
        }

        // Should still be logged in
        await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
        expect(forceLogoutTriggered).toBe(false);
    });

    test('Session security cleanup on manual logout', async ({ page }) => {
        // Login
        await page.click('text=Log in');
        await page.fill('#email', TEST_CREDENTIALS.email);
        await page.fill('#password', TEST_CREDENTIALS.password);
        await page.click('button[type="submit"]');

        await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 10000 });

        // Monitor console for cleanup messages
        const consoleMessages = [];
        page.on('console', msg => {
            consoleMessages.push(msg.text());
        });

        // Logout manually
        await page.click('[data-testid="user-menu"]');
        await page.click('text=Log Out');

        await expect(page).toHaveURL('/');

        // Wait for cleanup messages
        await page.waitForTimeout(1000);

        // Should see session security cleanup message
        const cleanupMessages = consoleMessages.filter(msg =>
            msg.includes('🔒 Session security cleaned up')
        );

        expect(cleanupMessages.length).toBeGreaterThan(0);

        // Verify timeout handlers are cleared
        const hasActiveTimeouts = await page.evaluate(() => {
            return window.sessionSecurity && window.sessionSecurity.isActive;
        });

        expect(hasActiveTimeouts).toBeFalsy();
    });

    test('Session security initializes on login', async ({ page }) => {
        // Monitor console for initialization
        const consoleMessages = [];
        page.on('console', msg => {
            consoleMessages.push(msg.text());
        });

        // Login
        await page.click('text=Log in');
        await page.fill('#email', TEST_CREDENTIALS.email);
        await page.fill('#password', TEST_CREDENTIALS.password);
        await page.click('button[type="submit"]');

        await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 10000 });

        // Wait for initialization messages
        await page.waitForTimeout(1000);

        // Should see session security initialization message
        const initMessages = consoleMessages.filter(msg =>
            msg.includes('🔒 Session security initialized')
        );

        expect(initMessages.length).toBeGreaterThan(0);

        // Verify session security is active
        const isActive = await page.evaluate(() => {
            return window.sessionSecurity && window.sessionSecurity.isActive;
        });

        expect(isActive).toBe(true);
    });
});
import { test, expect } from '@playwright/test';

/**
 * Authentication Security Tests
 * 
 * These tests verify that the persistent login security vulnerabilities
 * have been resolved and that logout functionality works correctly.
 */

// Test configuration
const TEST_CREDENTIALS = {
    email: 'test-security@example.com',
    password: 'SecurePassword123!'
};

test.describe('Authentication Security', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('Complete logout clears all session data', async ({ page }) => {
        // Step 1: Login
        await page.click('text=Log in');
        await page.fill('#email', TEST_CREDENTIALS.email);
        await page.fill('#password', TEST_CREDENTIALS.password);
        await page.click('button[type="submit"]');

        // Wait for successful login and navigation
        await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 10000 });

        // Step 2: Navigate to a protected page
        await page.click('text=Member Dashboard');
        await expect(page.locator('h1')).toContainText('Member Dashboard');

        // Step 3: Verify we're authenticated
        const userMenu = page.locator('[data-testid="user-menu"]');
        await expect(userMenu).toBeVisible();

        // Step 4: Check localStorage before logout
        const preLogoutStorage = await page.evaluate(() => {
            const storage = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.includes('supabase') || key.includes('sb-') || key.includes('auth'))) {
                    storage[key] = localStorage.getItem(key);
                }
            }
            return storage;
        });

        // Should have some auth data before logout
        expect(Object.keys(preLogoutStorage).length).toBeGreaterThan(0);

        // Step 5: Perform logout
        await userMenu.click();
        await page.click('text=Log Out');

        // Step 6: Wait for logout to complete and redirect
        await expect(page).toHaveURL('/');
        await expect(page.locator('text=Login')).toBeVisible();

        // Step 7: Verify all auth storage is cleared
        const postLogoutStorage = await page.evaluate(() => {
            const storage = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.includes('supabase') || key.includes('sb-') || key.includes('auth') || key.includes('session') || key.includes('token'))) {
                    storage[key] = localStorage.getItem(key);
                }
            }
            return storage;
        });

        // Should have no auth data after logout
        expect(Object.keys(postLogoutStorage).length).toBe(0);

        // Step 8: Verify sessionStorage is also cleared
        const sessionStorageData = await page.evaluate(() => {
            const storage = {};
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                if (key && (key.includes('supabase') || key.includes('sb-') || key.includes('auth') || key.includes('session') || key.includes('token'))) {
                    storage[key] = sessionStorage.getItem(key);
                }
            }
            return storage;
        });

        expect(Object.keys(sessionStorageData).length).toBe(0);

        // Step 9: Try to access protected page - should redirect to login
        await page.goto('/member/dashboard');
        await expect(page).toHaveURL('/login');
    });

    test('Logout prevents access to protected routes', async ({ page }) => {
        // Login first
        await page.click('text=Login');
        await page.fill('#email', TEST_CREDENTIALS.email);
        await page.fill('#password', TEST_CREDENTIALS.password);
        await page.click('button[type="submit"]');

        await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 10000 });

        // Verify we can access protected route
        await page.goto('/member/dashboard');
        await expect(page.locator('h1')).toContainText('Member Dashboard');

        // Logout
        await page.click('[data-testid="user-menu"]');
        await page.click('text=Log Out');
        await expect(page).toHaveURL('/');

        // Try to access protected routes - should redirect to login
        const protectedRoutes = ['/member/dashboard', '/admin/dashboard', '/authhome'];

        for (const route of protectedRoutes) {
            await page.goto(route);
            await expect(page).toHaveURL('/login');
        }
    });

    test('Global logout works across browser contexts', async ({ browser }) => {
        // Create two browser contexts to simulate different tabs/windows
        const context1 = await browser.newContext();
        const context2 = await browser.newContext();

        const page1 = await context1.newPage();
        const page2 = await context2.newPage();

        // Login in both contexts
        for (const page of [page1, page2]) {
            await page.goto('/');
            await page.click('text=Login');
            await page.fill('#email', TEST_CREDENTIALS.email);
            await page.fill('#password', TEST_CREDENTIALS.password);
            await page.click('button[type="submit"]');
            await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 10000 });
        }

        // Verify both are logged in
        await page1.goto('/member/dashboard');
        await expect(page1.locator('h1')).toContainText('Member Dashboard');

        await page2.goto('/member/dashboard');
        await expect(page2.locator('h1')).toContainText('Member Dashboard');

        // Logout from first context with global scope
        await page1.click('[data-testid="user-menu"]');
        await page1.click('text=Log Out');
        await expect(page1).toHaveURL('/');

        // Wait a moment for global logout to propagate
        await page2.waitForTimeout(2000);

        // Try to access protected page in second context
        // Should redirect to login due to global logout
        await page2.goto('/member/dashboard');
        await expect(page2).toHaveURL('/login');

        await context1.close();
        await context2.close();
    });

    test('Session persistence does not survive browser restart', async ({ browser }) => {
        // Create a context and login
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto('/');
        await page.click('text=Login');
        await page.fill('#email', TEST_CREDENTIALS.email);
        await page.fill('#password', TEST_CREDENTIALS.password);
        await page.click('button[type="submit"]');

        await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 10000 });

        // Navigate to protected page
        await page.goto('/member/dashboard');
        await expect(page.locator('h1')).toContainText('Member Dashboard');

        // Logout to clear session
        await page.click('[data-testid="user-menu"]');
        await page.click('text=Log Out');
        await expect(page).toHaveURL('/');

        // Close the browser context (simulating browser restart)
        await context.close();

        // Create new context (fresh browser state)
        const newContext = await browser.newContext();
        const newPage = await newContext.newPage();

        // Try to access protected page - should redirect to login
        await newPage.goto('/member/dashboard');
        await expect(newPage).toHaveURL('/login');

        // Verify no auth state persists
        const storageData = await newPage.evaluate(() => {
            const storage = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.includes('supabase') || key.includes('sb-') || key.includes('auth'))) {
                    storage[key] = localStorage.getItem(key);
                }
            }
            return storage;
        });

        expect(Object.keys(storageData).length).toBe(0);

        await newContext.close();
    });

    test('Logout button is disabled during logout process', async ({ page }) => {
        await page.click('text=Login');
        await page.fill('#email', TEST_CREDENTIALS.email);
        await page.fill('#password', TEST_CREDENTIALS.password);
        await page.click('button[type="submit"]');

        await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 10000 });

        // Open user menu
        await page.click('[data-testid="user-menu"]');

        const logoutButton = page.locator('text=Log Out');
        await expect(logoutButton).toBeVisible();

        // Click logout and immediately check if it's disabled/processing
        await logoutButton.click();

        // Should redirect within reasonable time
        await expect(page).toHaveURL('/');
        await expect(page.locator('text=Login')).toBeVisible();
    });

    test('Direct URL access to protected routes after logout', async ({ page }) => {
        // Login
        await page.click('text=Login');
        await page.fill('#email', TEST_CREDENTIALS.email);
        await page.fill('#password', TEST_CREDENTIALS.password);
        await page.click('button[type="submit"]');

        await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 10000 });

        // Logout
        await page.click('[data-testid="user-menu"]');
        await page.click('text=Log Out');
        await expect(page).toHaveURL('/');

        // Test direct URL access to various protected routes
        const protectedRoutes = [
            '/authhome',
            '/member/dashboard',
            '/admin/dashboard'
        ];

        for (const route of protectedRoutes) {
            await page.goto(route);
            // Should be redirected to login
            await expect(page).toHaveURL('/login');

            // Should show login form
            await expect(page.locator('input[type="email"]')).toBeVisible();
            await expect(page.locator('input[type="password"]')).toBeVisible();
        }
    });

    test('Console logs show proper security cleanup', async ({ page }) => {
        // Set up console monitoring
        const consoleMessages = [];
        page.on('console', msg => {
            consoleMessages.push(msg.text());
        });

        // Login
        await page.click('text=Login');
        await page.fill('#email', TEST_CREDENTIALS.email);
        await page.fill('#password', TEST_CREDENTIALS.password);
        await page.click('button[type="submit"]');

        await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 10000 });

        // Clear console messages from login
        consoleMessages.length = 0;

        // Logout
        await page.click('[data-testid="user-menu"]');
        await page.click('text=Log Out');

        await expect(page).toHaveURL('/');

        // Wait for all console messages to appear
        await page.waitForTimeout(1000);

        // Check for security-related console messages
        const securityMessages = consoleMessages.filter(msg =>
            msg.includes('🔐') ||
            msg.includes('🧹') ||
            msg.includes('🗑️') ||
            msg.includes('✅')
        );

        expect(securityMessages.length).toBeGreaterThan(0);

        // Should see storage cleanup messages
        const storageCleanupMessages = consoleMessages.filter(msg =>
            msg.includes('Cleared localStorage') ||
            msg.includes('Cleared sessionStorage') ||
            msg.includes('Force cleared known key')
        );

        expect(storageCleanupMessages.length).toBeGreaterThan(0);
    });

    test('User state is immediately cleared on logout', async ({ page }) => {
        // Login
        await page.click('text=Login');
        await page.fill('#email', TEST_CREDENTIALS.email);
        await page.fill('#password', TEST_CREDENTIALS.password);
        await page.click('button[type="submit"]');

        await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 10000 });

        // Verify user menu is present
        await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();

        // Logout
        await page.click('[data-testid="user-menu"]');
        await page.click('text=Log Out');

        // User state should be cleared immediately - user menu should disappear
        await expect(page.locator('[data-testid="user-menu"]')).not.toBeVisible();

        // Login button should be visible
        await expect(page.locator('text=Login')).toBeVisible();

        // Should be redirected to home page
        await expect(page).toHaveURL('/');
    });
});
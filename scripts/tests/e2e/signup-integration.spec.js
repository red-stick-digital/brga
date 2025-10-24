import { test, expect } from '@playwright/test';

test.describe('Signup Integration Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/signup');
    });

    test('should have proper page title and heading', async ({ page }) => {
        await expect(page).toHaveTitle(/baton rouge/i);
        await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible();
    });

    test('should show all required form fields', async ({ page }) => {
        // Check all expected fields are present
        await expect(page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)')).toBeVisible();
        await expect(page.locator('#email')).toBeVisible();
        await expect(page.locator('#password')).toBeVisible();
        await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();

        // Check for helpful text
        await expect(page.getByText('Enter the three-word approval code provided by an admin')).toBeVisible();
    });

    test('should handle network errors gracefully', async ({ page }) => {
        // Fill out the form
        await page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)').fill('network-error-test');
        await page.locator('#email').fill('test@example.com');
        await page.locator('#password').fill('password123');

        // Intercept the signup request to simulate network error
        await page.route('**/auth/v1/signup', (route) => {
            route.abort('internetdisconnected');
        });

        await page.getByRole('button', { name: /sign up/i }).click();

        // Should show appropriate error message
        await expect(page.getByText(/network error|connection.*failed|try again|error/i)).toBeVisible();
    });

    test('should handle server errors gracefully', async ({ page }) => {
        // Fill out the form
        await page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)').fill('server-error-test');
        await page.locator('#email').fill('test@example.com');
        await page.locator('#password').fill('password123');

        // Intercept the signup request to simulate server error
        await page.route('**/auth/v1/signup', (route) => {
            route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Internal server error' })
            });
        });

        await page.getByRole('button', { name: /sign up/i }).click();

        // Should show appropriate error message
        await expect(page.getByText(/server error|something went wrong|try again|error/i)).toBeVisible();
    });

    test('should validate email format with HTML5 validation', async ({ page }) => {
        const emailInput = page.locator('#email');
        const approvalCodeInput = page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)');
        const passwordInput = page.locator('#password');

        // Fill valid approval code and password
        await approvalCodeInput.fill('test-code-format');
        await passwordInput.fill('password123');

        // Test invalid email
        await emailInput.fill('invalid-email');

        // Try to submit - HTML5 validation should prevent it
        await page.getByRole('button', { name: /sign up/i }).click();

        // Should remain on the same page (form didn't submit)
        await expect(page).toHaveURL('/signup');
    });

    test('should prevent double submission', async ({ page }) => {
        await page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)').fill('double-submit-test');
        await page.locator('#email').fill('test@example.com');
        await page.locator('#password').fill('password123');

        const signUpButton = page.getByRole('button', { name: /sign up/i });

        // Submit the form
        await signUpButton.click();

        // Button should become disabled or show loading state
        await expect(page.getByRole('button', { name: /validating/i }).or(signUpButton.locator('[disabled]'))).toBeVisible();
    });
});

test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
        await page.goto('/signup');

        // All form elements should still be visible and functional
        await expect(page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)')).toBeVisible();
        await expect(page.locator('#email')).toBeVisible();
        await expect(page.locator('#password')).toBeVisible();
        await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();

        // Test form interaction on mobile
        await page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)').fill('mobile-test-code');
        await page.locator('#email').fill('mobile@example.com');
        await page.locator('#password').fill('password123');

        const signUpButton = page.getByRole('button', { name: /sign up/i });
        await signUpButton.click();

        // Should show loading or error state appropriately
        await expect(page.getByText(/approval code.*not found|validating/i)).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 }); // iPad size
        await page.goto('/signup');

        // Form should be properly laid out
        await expect(page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)')).toBeVisible();
        await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();
    });
});
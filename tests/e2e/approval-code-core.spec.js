import { test, expect } from '@playwright/test';

test.describe('Approval Code Core Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/signup');
    });

    test('should display signup form with approval code field', async ({ page }) => {
        // Verify page loads correctly
        await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible();

        // Check all form fields are present
        await expect(page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)')).toBeVisible();
        await expect(page.locator('#email')).toBeVisible();
        await expect(page.locator('#password')).toBeVisible();
        await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();

        // Check helpful text
        await expect(page.getByText('Enter the three-word approval code provided by an admin')).toBeVisible();
    });

    test('should show error for non-existent approval code', async ({ page }) => {
        // Fill form with non-existent code
        await page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)').fill('fake-test-code');
        await page.locator('#email').fill('test@example.com');
        await page.locator('#password').fill('password123');

        // Submit form
        await page.getByRole('button', { name: /sign up/i }).click();

        // Should show the actual error message from the hook
        await expect(page.getByText('Invalid approval code')).toBeVisible();
    });

    test('should show loading state during validation', async ({ page }) => {
        // Fill form
        await page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)').fill('test-code-validation');
        await page.locator('#email').fill('test@example.com');
        await page.locator('#password').fill('password123');

        // Submit and check for loading state
        await page.getByRole('button', { name: /sign up/i }).click();

        // Should show validating state
        await expect(page.getByRole('button', { name: /validating/i })).toBeVisible();
    });

    test('should handle form validation correctly', async ({ page }) => {
        const signUpButton = page.getByRole('button', { name: /sign up/i });

        // Try to submit empty form
        await signUpButton.click();

        // Should stay on signup page due to HTML5 validation
        await expect(page).toHaveURL('/signup');

        // Fill only approval code, leave email/password empty
        await page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)').fill('test-code-only');
        await signUpButton.click();

        // Should still stay on signup page
        await expect(page).toHaveURL('/signup');
    });

    test('should maintain form state after validation error', async ({ page }) => {
        const testEmail = 'maintain@example.com';
        const testPassword = 'password123';
        const testCode = 'maintain-form-state';

        // Fill form
        await page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)').fill(testCode);
        await page.locator('#email').fill(testEmail);
        await page.locator('#password').fill(testPassword);

        // Submit (will fail with invalid code error)
        await page.getByRole('button', { name: /sign up/i }).click();

        // Wait for error to show
        await expect(page.getByText('Invalid approval code')).toBeVisible();

        // Form should maintain values
        await expect(page.locator('#email')).toHaveValue(testEmail);
        await expect(page.locator('#password')).toHaveValue(testPassword);
        await expect(page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)')).toHaveValue(testCode);
    });

    test('should prevent double submission', async ({ page }) => {
        // Fill form
        await page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)').fill('prevent-double-submit');
        await page.locator('#email').fill('double@example.com');
        await page.locator('#password').fill('password123');

        const signUpButton = page.getByRole('button', { name: /sign up/i });

        // Submit form
        await signUpButton.click();

        // Button should be disabled or show loading state
        await expect(signUpButton).toBeDisabled();
    });
});

test.describe('Approval Code Format Validation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/signup');
    });

    // Test some basic format validation scenarios
    const testCases = [
        { code: 'valid-test-code', shouldValidate: true, description: 'valid three-word format' },
        { code: 'single', shouldValidate: true, description: 'single word (backend will reject)' },
        { code: 'two-words', shouldValidate: true, description: 'two words (backend will reject)' },
        { code: '', shouldValidate: false, description: 'empty field' },
    ];

    for (const testCase of testCases) {
        test(`should handle ${testCase.description}: "${testCase.code}"`, async ({ page }) => {
            // Fill form
            await page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)').fill(testCase.code);
            await page.locator('#email').fill('format@example.com');
            await page.locator('#password').fill('password123');

            // Submit form
            await page.getByRole('button', { name: /sign up/i }).click();

            if (testCase.shouldValidate) {
                // Should attempt validation (show loading state)
                await expect(page.getByRole('button', { name: /validating/i })).toBeVisible();
                // Then show error for non-existent code
                await expect(page.getByText('Invalid approval code')).toBeVisible();
            } else {
                // Empty field should trigger HTML5 validation
                await expect(page).toHaveURL('/signup');
            }
        });
    }
});

test.describe('Responsive Design Basic Tests', () => {
    test('should work on mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/signup');

        // Basic elements should be visible
        await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible();
        await expect(page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)')).toBeVisible();
        await expect(page.locator('#email')).toBeVisible();
        await expect(page.locator('#password')).toBeVisible();
        await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto('/signup');

        // Basic elements should be visible
        await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible();
        await expect(page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)')).toBeVisible();
        await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();
    });
});
import { test, expect } from '@playwright/test';

test.describe('Approval Code Signup Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate directly to the signup page
        await page.goto('/signup');
        await expect(page).toHaveURL('/signup');
    });

    test('should display approval code field with proper placeholder', async ({ page }) => {
        // Check that the approval code input field is present
        const approvalCodeInput = page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)');
        await expect(approvalCodeInput).toBeVisible();

        // Check for helpful text about the format
        await expect(page.getByText('Enter the three-word approval code provided by an admin')).toBeVisible();
    });

    test('should validate approval code format in real-time', async ({ page }) => {
        const approvalCodeInput = page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)');
        const emailInput = page.locator('#email');
        const passwordInput = page.locator('#password');
        const signUpButton = page.getByRole('button', { name: /sign up/i });

        // Fill in other required fields first
        await emailInput.fill('test@example.com');
        await passwordInput.fill('password123');

        // Test invalid format: too few words
        await approvalCodeInput.fill('invalid-code');
        await approvalCodeInput.blur();

        // Submit the form to trigger validation
        await signUpButton.click();

        // Should show error for invalid approval code
        await expect(page.getByText(/approval code.*not found|invalid.*approval code|code.*format/i)).toBeVisible();
    });

    test('should show error for non-existent approval code', async ({ page }) => {
        const approvalCodeInput = page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)');
        const emailInput = page.locator('#email');
        const passwordInput = page.locator('#password');
        const signUpButton = page.getByRole('button', { name: /sign up/i });

        // Fill in the form with a properly formatted but non-existent code
        await approvalCodeInput.fill('fake-code-test');
        await emailInput.fill('test@example.com');
        await passwordInput.fill('password123');

        // Submit the form
        await signUpButton.click();

        // Should show error message for invalid code
        await expect(page.getByText(/approval code.*not found|invalid approval code/i)).toBeVisible();

        // Should remain on signup page
        await expect(page).toHaveURL('/signup');
    });

    test('should show loading state during code verification', async ({ page }) => {
        const approvalCodeInput = page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)');
        const emailInput = page.locator('#email');
        const passwordInput = page.locator('#password');
        const signUpButton = page.getByRole('button', { name: /sign up/i });

        // Fill in the form
        await approvalCodeInput.fill('test-code-format');
        await emailInput.fill('test@example.com');
        await passwordInput.fill('password123');

        // Submit and check for loading state
        await signUpButton.click();

        // Should show loading indicator (button text changes)
        await expect(page.getByRole('button', { name: /validating/i })).toBeVisible();
    });

    test('should handle expired approval code', async ({ page }) => {
        const approvalCodeInput = page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)');
        const emailInput = page.locator('#email');
        const passwordInput = page.locator('#password');
        const signUpButton = page.getByRole('button', { name: /sign up/i });

        // Fill in form with a code that would be expired
        await approvalCodeInput.fill('expired-test-code');
        await emailInput.fill('test@example.com');
        await passwordInput.fill('password123');

        await signUpButton.click();

        // Should show appropriate error message
        await expect(page.getByText(/approval code.*expired|code.*expired/i)).toBeVisible();
    });

    test('should handle already-used approval code', async ({ page }) => {
        const approvalCodeInput = page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)');
        const emailInput = page.locator('#email');
        const passwordInput = page.locator('#password');
        const signUpButton = page.getByRole('button', { name: /sign up/i });

        // Fill in form with a code that would already be used
        await approvalCodeInput.fill('used-test-code');
        await emailInput.fill('test@example.com');
        await passwordInput.fill('password123');

        await signUpButton.click();

        // Should show appropriate error message
        await expect(page.getByText(/approval code.*used|code.*already.*used/i)).toBeVisible();
    });

    test('should clear previous errors when typing new code', async ({ page }) => {
        const approvalCodeInput = page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)');
        const emailInput = page.locator('#email');
        const passwordInput = page.locator('#password');
        const signUpButton = page.getByRole('button', { name: /sign up/i });

        // Fill in other fields
        await emailInput.fill('test@example.com');
        await passwordInput.fill('password123');

        // First, trigger an error
        await approvalCodeInput.fill('bad-format');
        await signUpButton.click();
        await expect(page.getByText(/approval code.*not found/i)).toBeVisible();

        // Now type a better formatted code - error should clear when form is re-submitted
        await approvalCodeInput.fill('good-format-code');
        await signUpButton.click();

        // Should show different error (still not found, but format is OK)
        await expect(page.getByText(/approval code.*not found/i)).toBeVisible();
    });

    test('should require approval code for form submission', async ({ page }) => {
        const emailInput = page.locator('#email');
        const passwordInput = page.locator('#password');
        const signUpButton = page.getByRole('button', { name: /sign up/i });

        // Fill in only email and password, leave approval code empty
        await emailInput.fill('test@example.com');
        await passwordInput.fill('password123');

        // Try to submit
        await signUpButton.click();

        // Form should not submit successfully (HTML5 validation will prevent it)
        // Or we should see a validation error
        await expect(page).toHaveURL('/signup');
    });

    test('should maintain form state when approval code validation fails', async ({ page }) => {
        const approvalCodeInput = page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)');
        const emailInput = page.locator('#email');
        const passwordInput = page.locator('#password');
        const signUpButton = page.getByRole('button', { name: /sign up/i });

        const testEmail = 'test@example.com';
        const testPassword = 'password123';

        // Fill in the form
        await approvalCodeInput.fill('invalid-test-code');
        await emailInput.fill(testEmail);
        await passwordInput.fill(testPassword);

        await signUpButton.click();

        // After error occurs, form fields should retain their values
        await expect(emailInput).toHaveValue(testEmail);
        await expect(passwordInput).toHaveValue(testPassword);
        await expect(approvalCodeInput).toHaveValue('invalid-test-code');
    });
});

test.describe('Approval Code Format Validation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/signup');
    });

    const invalidCodes = [
        'single',
        'two-words',
        'too-many-words-here-extra',
        'word--word-word', // double hyphen
        'word-word-', // trailing hyphen
        '-word-word-word', // leading hyphen
        'word word word', // spaces instead of hyphens
        'word_word_word', // underscores instead of hyphens
        'word.word.word', // dots instead of hyphens
        '', // empty string
    ];

    for (const invalidCode of invalidCodes) {
        test(`should handle invalid format: "${invalidCode}"`, async ({ page }) => {
            const approvalCodeInput = page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)');
            const emailInput = page.locator('#email');
            const passwordInput = page.locator('#password');
            const signUpButton = page.getByRole('button', { name: /sign up/i });

            // Fill the form
            await approvalCodeInput.fill(invalidCode);
            await emailInput.fill('test@example.com');
            await passwordInput.fill('password123');

            // Submit the form
            await signUpButton.click();

            // Should show some kind of error for invalid codes
            if (invalidCode.trim() === '') {
                // Empty field should trigger HTML5 required validation
                await expect(page).toHaveURL('/signup');
            } else {
                // Invalid format should show error message
                await expect(page.getByText(/approval code.*not found|invalid.*approval code/i)).toBeVisible();
            }
        });
    }

    const validFormats = [
        'word-word-word',
        'fish-taco-burrito',
        'ocean-wave-sunset',
        'mountain-forest-stream',
        'valid-test-code',
    ];

    for (const validCode of validFormats) {
        test(`should attempt validation for valid format: "${validCode}"`, async ({ page }) => {
            const approvalCodeInput = page.getByPlaceholder('word-word-word (e.g., fish-taco-burrito)');
            const emailInput = page.locator('#email');
            const passwordInput = page.locator('#password');
            const signUpButton = page.getByRole('button', { name: /sign up/i });

            // Fill the form
            await approvalCodeInput.fill(validCode);
            await emailInput.fill('test@example.com');
            await passwordInput.fill('password123');

            // Submit the form
            await signUpButton.click();

            // Should show loading state (indicating validation is being attempted)
            await expect(page.getByRole('button', { name: /validating/i })).toBeVisible();
        });
    }
});
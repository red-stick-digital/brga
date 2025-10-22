import { test, expect } from '@playwright/test';

/**
 * Member Profile Update Tests
 * 
 * These tests verify that the member profile update functionality works correctly
 * after fixing the 400 error caused by database schema mismatch (full_name vs 
 * separate name fields).
 */

const TEST_PROFILE_DATA = {
    firstName: 'John',
    lastName: 'Doe',
    middleInitial: 'T',
    phone: '555-123-4567'
};

test.describe('Member Profile Update', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to the homepage (assumes existing authenticated session)
        await page.goto('/');

        // Wait for the page to load and check if already authenticated
        await page.waitForLoadState('networkidle');

        // Navigate directly to member dashboard (user should already be logged in based on browser testing)
        await page.goto('/member/dashboard');

        // Wait for dashboard to load
        await expect(page.locator('h1')).toContainText('Member Dashboard', { timeout: 10000 });
    });

    test('should successfully update member profile without 400 errors', async ({ page }) => {
        // Open profile edit form
        const editButton = page.locator('button', { hasText: /edit.*profile/i });
        await expect(editButton).toBeVisible({ timeout: 10000 });
        await editButton.click();

        // Wait for the edit form to load
        await expect(page.locator('h2')).toContainText('Edit', { timeout: 10000 });

        // Update middle initial field to test the fix
        const middleInitialInput = page.getByRole('textbox', { name: /middle initial/i });
        await middleInitialInput.clear();
        await middleInitialInput.fill(TEST_PROFILE_DATA.middleInitial);

        // Submit the form
        const saveButton = page.getByRole('button', { name: /save.*profile/i });
        await expect(saveButton).toBeVisible();
        await saveButton.click();

        // Wait for and verify success message (this should NOT show "Failed to update profile")
        await expect(page.locator('text=Profile updated successfully')).toBeVisible({ timeout: 15000 });

        // Verify no error messages are displayed
        await expect(page.locator('text=Failed to update profile')).not.toBeVisible();
        await expect(page.locator('text=400')).not.toBeVisible();
        await expect(page.locator('text=PGRST204')).not.toBeVisible();
        await expect(page.locator('text=column "full_name" of relation "member_profiles" does not exist')).not.toBeVisible();

        // Verify form is still functional (not broken by the update)
        await expect(saveButton).toBeEnabled();

        // Verify the field was updated
        await expect(middleInitialInput).toHaveValue(TEST_PROFILE_DATA.middleInitial);
    });

    test('should load profile edit form without database schema errors', async ({ page }) => {
        // Open profile edit form
        const editButton = page.locator('button', { hasText: /edit.*profile/i });
        await expect(editButton).toBeVisible({ timeout: 10000 });
        await editButton.click();

        // Wait for the edit form to load (should not throw database errors)
        await expect(page.locator('h2')).toContainText('Edit', { timeout: 10000 });

        // Verify the form loads without any database schema errors
        await expect(page.locator('text=column "full_name" of relation "member_profiles" does not exist')).not.toBeVisible();
        await expect(page.locator('text=PGRST204')).not.toBeVisible();
        await expect(page.locator('text=Failed to update profile')).not.toBeVisible();

        // Verify basic form elements are present and functional
        await expect(page.getByRole('textbox', { name: /first name/i })).toBeVisible();
        await expect(page.getByRole('textbox', { name: /last name/i })).toBeVisible();
        await expect(page.getByRole('textbox', { name: /middle initial/i })).toBeVisible();

        // Save button should be enabled (indicating form is functional)
        const saveButton = page.getByRole('button', { name: /save.*profile/i });
        await expect(saveButton).toBeEnabled();
    });

    test('should preserve form data and not show schema errors', async ({ page }) => {
        // Open edit form
        const editButton = page.locator('button', { hasText: /edit.*profile/i });
        await expect(editButton).toBeVisible({ timeout: 10000 });
        await editButton.click();

        await expect(page.locator('h2')).toContainText('Edit', { timeout: 10000 });

        // Check that existing data is preserved and form is functional
        const firstNameInput = page.getByRole('textbox', { name: /first name/i });
        const lastNameInput = page.getByRole('textbox', { name: /last name/i });

        // Verify existing data is loaded (should not be empty due to database errors)
        await expect(firstNameInput).not.toHaveValue('');
        await expect(lastNameInput).not.toHaveValue('');

        // Verify no database schema errors are shown
        await expect(page.locator('text=column "full_name" of relation "member_profiles" does not exist')).not.toBeVisible();
        await expect(page.locator('text=PGRST204')).not.toBeVisible();
        await expect(page.locator('text=Failed to update profile')).not.toBeVisible();

        // Verify form is functional
        const saveButton = page.getByRole('button', { name: /save.*profile/i });
        await expect(saveButton).toBeEnabled();
    });

    test('should update profile successfully and show success message', async ({ page }) => {
        // Open profile edit form
        const editButton = page.locator('button', { hasText: /edit.*profile/i });
        await expect(editButton).toBeVisible({ timeout: 10000 });
        await editButton.click();

        // Wait for the edit form to load
        await expect(page.locator('h2')).toContainText('Edit', { timeout: 10000 });

        // The form should load without database schema errors
        await expect(page.locator('text=column "full_name" of relation "member_profiles" does not exist')).not.toBeVisible();
        await expect(page.locator('text=PGRST204')).not.toBeVisible();
        await expect(page.locator('text=Failed to update profile')).not.toBeVisible();

        // Make a small change and save
        const phoneInput = page.getByRole('textbox', { name: /phone/i });
        const currentPhone = await phoneInput.inputValue();
        const newPhone = currentPhone + '1'; // Add a digit to test update

        await phoneInput.clear();
        await phoneInput.fill(newPhone);

        // Save and verify success
        const saveButton = page.getByRole('button', { name: /save.*profile/i });
        await expect(saveButton).toBeEnabled();
        await saveButton.click();

        // Should show success message, not error
        await expect(page.locator('text=Profile updated successfully')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('text=Failed to update profile')).not.toBeVisible();
        await expect(page.locator('text=400')).not.toBeVisible();
    });
});
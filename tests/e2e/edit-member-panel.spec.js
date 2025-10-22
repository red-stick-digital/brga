import { test, expect } from '@playwright/test';

/**
 * EditMemberPanel E2E Tests
 * 
 * These tests verify that the User Management EditMemberPanel functionality
 * works correctly, including form population, home group dropdowns, field editing,
 * and save operations with UI state refresh.
 */

// Test configuration
const ADMIN_CREDENTIALS = {
    email: 'marsh11272@yahoo.com',
    password: 'TestPassword123!'
};

test.describe('EditMemberPanel Functionality', () => {

    test.beforeEach(async ({ page }) => {
        // Skip authentication test for now due to test environment setup issues
        // Instead, directly navigate to admin dashboard with mock authentication
        await page.goto('/');

        // Set mock authentication in localStorage to bypass login
        await page.evaluate(() => {
            // Mock Supabase session
            const mockSession = {
                access_token: 'mock-token',
                token_type: 'bearer',
                expires_in: 3600,
                refresh_token: 'mock-refresh-token',
                user: {
                    id: 'mock-user-id',
                    email: 'marsh11272@yahoo.com',
                    user_metadata: {
                        role: 'superadmin'
                    }
                }
            };

            localStorage.setItem('sb-localhost-auth-token', JSON.stringify({
                access_token: mockSession.access_token,
                token_type: mockSession.token_type,
                expires_in: mockSession.expires_in,
                refresh_token: mockSession.refresh_token,
                user: mockSession.user
            }));
        });

        // Navigate directly to admin dashboard
        await page.goto('/admin/dashboard');
        await page.waitForTimeout(2000); // Wait for auth to load

        // Navigate to User Management tab
        await page.click('text=User Management');
        await expect(page.locator('h2')).toContainText('User Management');
    });

    test('EditMemberPanel opens and populates with member data', async ({ page }) => {
        // Wait for member list to load
        await expect(page.locator('table')).toBeVisible({ timeout: 10000 });

        // Find the first edit button and click it
        const editButton = page.locator('button[title="Edit member"]').first();
        await expect(editButton).toBeVisible();
        await editButton.click();

        // Verify EditMemberPanel opens
        await expect(page.locator('text=Edit Member:')).toBeVisible();

        // Verify modal structure
        await expect(page.locator('h3')).toContainText('Edit Member:');
        await expect(page.locator('text=Profile Information')).toBeVisible();

        // Verify form fields are present and populated
        await expect(page.locator('#first_name')).toBeVisible();
        await expect(page.locator('#last_name')).toBeVisible();
        await expect(page.locator('#middle_initial')).toBeVisible();
        await expect(page.locator('#phone')).toBeVisible();
        await expect(page.locator('#clean_date')).toBeVisible();
        await expect(page.locator('#home_group_id')).toBeVisible();

        // Verify checkboxes are present
        await expect(page.locator('input[name="listed_in_directory"]')).toBeVisible();
        await expect(page.locator('input[name="willing_to_sponsor"]')).toBeVisible();

        // Verify save button is present
        await expect(page.locator('text=Save Profile Changes')).toBeVisible();
    });

    test('Home group dropdown loads and displays options', async ({ page }) => {
        // Wait for member list to load
        await expect(page.locator('table')).toBeVisible({ timeout: 10000 });

        // Open EditMemberPanel
        const editButton = page.locator('button[title="Edit member"]').first();
        await editButton.click();

        // Wait for modal to open
        await expect(page.locator('text=Edit Member:')).toBeVisible();

        // Check home group dropdown
        const homeGroupSelect = page.locator('#home_group_id');
        await expect(homeGroupSelect).toBeVisible();

        // Verify dropdown has options
        await homeGroupSelect.click();

        // Wait for options to be visible and check that we have more than just the default option
        const options = page.locator('#home_group_id option');
        const optionCount = await options.count();

        // Should have at least the default "Select a home group" plus actual groups
        expect(optionCount).toBeGreaterThan(1);

        // Verify default option exists
        await expect(page.locator('option:has-text("Select a home group")')).toBeVisible();

        // Check that actual home groups are loaded
        const homeGroupOptions = page.locator('#home_group_id option:not(:has-text("Select a home group"))');
        const homeGroupCount = await homeGroupOptions.count();
        expect(homeGroupCount).toBeGreaterThan(0);
    });

    test('Profile form fields can be edited', async ({ page }) => {
        // Open EditMemberPanel
        await expect(page.locator('table')).toBeVisible({ timeout: 10000 });
        const editButton = page.locator('button[title="Edit member"]').first();
        await editButton.click();
        await expect(page.locator('text=Edit Member:')).toBeVisible();

        // Test editing name fields
        const firstNameField = page.locator('#first_name');
        const lastNameField = page.locator('#last_name');
        const middleInitialField = page.locator('#middle_initial');

        await firstNameField.clear();
        await firstNameField.fill('TestFirst');
        await expect(firstNameField).toHaveValue('TestFirst');

        await lastNameField.clear();
        await lastNameField.fill('TestLast');
        await expect(lastNameField).toHaveValue('TestLast');

        await middleInitialField.clear();
        await middleInitialField.fill('M');
        await expect(middleInitialField).toHaveValue('M');

        // Test editing phone number
        const phoneField = page.locator('#phone');
        await phoneField.clear();
        await phoneField.fill('(555) 123-4567');
        await expect(phoneField).toHaveValue('(555) 123-4567');

        // Test editing clean date
        const cleanDateField = page.locator('#clean_date');
        await cleanDateField.fill('2020-01-15');
        await expect(cleanDateField).toHaveValue('2020-01-15');

        // Test home group selection
        const homeGroupSelect = page.locator('#home_group_id');
        await homeGroupSelect.selectOption({ index: 1 }); // Select first non-default option

        // Test directory listing checkbox
        const directoryCheckbox = page.locator('input[name="listed_in_directory"]');
        const isChecked = await directoryCheckbox.isChecked();
        await directoryCheckbox.click();
        await expect(directoryCheckbox).toBeChecked(!isChecked);

        // Test willing to sponsor checkbox
        const sponsorCheckbox = page.locator('input[name="willing_to_sponsor"]');
        const wasSponsorChecked = await sponsorCheckbox.isChecked();
        await sponsorCheckbox.click();
        await expect(sponsorCheckbox).toBeChecked(!wasSponsorChecked);
    });

    test('Profile save operation works and refreshes UI state', async ({ page }) => {
        // Open EditMemberPanel
        await expect(page.locator('table')).toBeVisible({ timeout: 10000 });
        const editButton = page.locator('button[title="Edit member"]').first();
        await editButton.click();
        await expect(page.locator('text=Edit Member:')).toBeVisible();

        // Get original name from member list for comparison
        const originalMemberRow = page.locator('tbody tr').first();
        const originalName = await originalMemberRow.locator('td').first().textContent();

        // Edit the name with a timestamp to ensure uniqueness
        const timestamp = Date.now();
        const newFirstName = `Updated-${timestamp}`;
        const newLastName = `TestLast-${timestamp}`;

        const firstNameField = page.locator('#first_name');
        const lastNameField = page.locator('#last_name');
        await firstNameField.clear();
        await firstNameField.fill(newFirstName);
        await lastNameField.clear();
        await lastNameField.fill(newLastName);

        // Select a home group if options are available
        const homeGroupSelect = page.locator('#home_group_id');
        const optionCount = await page.locator('#home_group_id option').count();
        if (optionCount > 1) {
            await homeGroupSelect.selectOption({ index: 1 });
        }

        // Click save button
        const saveButton = page.locator('text=Save Profile Changes');
        await saveButton.click();

        // Wait for save operation (button should show "Saving..." then return to normal)
        await expect(page.locator('text=Saving...')).toBeVisible();
        await expect(page.locator('text=Saving...')).not.toBeVisible({ timeout: 10000 });

        // Wait for modal to close (indicating success)
        await expect(page.locator('text=Edit Member:')).not.toBeVisible({ timeout: 10000 });

        // Verify the member list has been refreshed with updated data
        await expect(page.locator('table')).toBeVisible();

        // Check that the name has been updated in the member list
        const updatedMemberRow = page.locator('tbody tr').first();
        await expect(updatedMemberRow.locator('td').first()).toContainText(newName);
    });

    test('Home group selection saves correctly and displays in member list', async ({ page }) => {
        // Open EditMemberPanel
        await expect(page.locator('table')).toBeVisible({ timeout: 10000 });
        const editButton = page.locator('button[title="Edit member"]').first();
        await editButton.click();
        await expect(page.locator('text=Edit Member:')).toBeVisible();

        // Select a specific home group
        const homeGroupSelect = page.locator('#home_group_id');
        const options = page.locator('#home_group_id option:not(:has-text("Select a home group"))');
        const optionCount = await options.count();

        // Only proceed if we have home groups to select
        if (optionCount > 0) {
            // Get the text of the first available home group
            const firstOption = options.first();
            const selectedGroupName = await firstOption.textContent();
            const selectedValue = await firstOption.getAttribute('value');

            // Select this home group
            await homeGroupSelect.selectOption({ value: selectedValue });
            await expect(homeGroupSelect).toHaveValue(selectedValue);

            // Save the changes
            const saveButton = page.locator('text=Save Profile Changes');
            await saveButton.click();

            // Wait for save to complete and modal to close
            await expect(page.locator('text=Saving...')).toBeVisible();
            await expect(page.locator('text=Edit Member:')).not.toBeVisible({ timeout: 10000 });

            // Verify the home group appears in the member list
            await expect(page.locator('table')).toBeVisible();
            const memberRow = page.locator('tbody tr').first();
            const homeGroupCell = memberRow.locator('td').nth(3); // Home group is 4th column (0-indexed)

            // The cell should show the selected home group name (not just "-")
            await expect(homeGroupCell).toContainText(selectedGroupName);
            await expect(homeGroupCell).not.toContainText('-');
        }
    });

    test('Tab navigation works correctly', async ({ page }) => {
        // Open EditMemberPanel
        await expect(page.locator('table')).toBeVisible({ timeout: 10000 });
        const editButton = page.locator('button[title="Edit member"]').first();
        await editButton.click();
        await expect(page.locator('text=Edit Member:')).toBeVisible();

        // Verify Profile Information tab is active by default
        const profileTab = page.locator('text=Profile Information');
        await expect(profileTab).toHaveClass(/border-blue-500 text-blue-600/);

        // Verify profile fields are visible
        await expect(page.locator('#first_name')).toBeVisible();

        // Click Member Info tab
        const infoTab = page.locator('text=Member Info');
        await infoTab.click();

        // Verify Member Info tab becomes active
        await expect(infoTab).toHaveClass(/border-blue-500 text-blue-600/);

        // Verify info content is visible
        await expect(page.locator('text=Account Information')).toBeVisible();
        await expect(page.locator('text=Email:')).toBeVisible();
        await expect(page.locator('text=User ID:')).toBeVisible();

        // Go back to Profile tab
        await profileTab.click();
        await expect(profileTab).toHaveClass(/border-blue-500 text-blue-600/);
        await expect(page.locator('#first_name')).toBeVisible();
    });

    test('Modal closes correctly without saving changes', async ({ page }) => {
        // Open EditMemberPanel
        await expect(page.locator('table')).toBeVisible({ timeout: 10000 });
        const editButton = page.locator('button[title="Edit member"]').first();
        await editButton.click();
        await expect(page.locator('text=Edit Member:')).toBeVisible();

        // Make some changes but don't save
        const firstNameField = page.locator('#first_name');
        const originalValue = await firstNameField.inputValue();
        await firstNameField.clear();
        await firstNameField.fill('TemporaryChange');

        // Close modal using X button
        const closeButton = page.locator('button').filter({ has: page.locator('svg') }).first();
        await closeButton.click();

        // Verify modal is closed
        await expect(page.locator('text=Edit Member:')).not.toBeVisible();

        // Verify member list still shows original data
        await expect(page.locator('table')).toBeVisible();
        const memberRow = page.locator('tbody tr').first();
        // The name should not have the temporary change
        await expect(memberRow.locator('td').first()).not.toContainText('TemporaryChange');
    });

    test('Form validation prevents saving with empty required fields', async ({ page }) => {
        // Open EditMemberPanel
        await expect(page.locator('table')).toBeVisible({ timeout: 10000 });
        const editButton = page.locator('button[title="Edit member"]').first();
        await editButton.click();
        await expect(page.locator('text=Edit Member:')).toBeVisible();

        // Clear required fields (first name and last name)
        const firstNameField = page.locator('#first_name');
        const lastNameField = page.locator('#last_name');
        await firstNameField.clear();
        await lastNameField.clear();

        // Try to save
        const saveButton = page.locator('text=Save Profile Changes');
        await saveButton.click();

        // Verify validation errors appear
        await expect(page.locator('text=First name is required')).toBeVisible();
        await expect(page.locator('text=Last name is required')).toBeVisible();

        // Verify modal doesn't close (save failed)
        await expect(page.locator('text=Edit Member:')).toBeVisible();

        // Fill in the required fields
        await firstNameField.fill('ValidFirst');
        await lastNameField.fill('ValidLast');

        // Verify errors clear when user starts typing
        await expect(page.locator('text=First name is required')).not.toBeVisible();
        await expect(page.locator('text=Last name is required')).not.toBeVisible();
    });

    test('Future clean date validation works correctly', async ({ page }) => {
        // Open EditMemberPanel
        await expect(page.locator('table')).toBeVisible({ timeout: 10000 });
        const editButton = page.locator('button[title="Edit member"]').first();
        await editButton.click();
        await expect(page.locator('text=Edit Member:')).toBeVisible();

        // Set clean date to future date
        const cleanDateField = page.locator('#clean_date');
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30); // 30 days in future
        const futureDateString = futureDate.toISOString().split('T')[0];

        await cleanDateField.fill(futureDateString);

        // Try to save
        const saveButton = page.locator('text=Save Profile Changes');
        await saveButton.click();

        // Verify validation error appears
        await expect(page.locator('text=Clean date cannot be in the future')).toBeVisible();

        // Verify modal doesn't close (save failed)
        await expect(page.locator('text=Edit Member:')).toBeVisible();

        // Set valid date (in the past)
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 30); // 30 days ago
        const pastDateString = pastDate.toISOString().split('T')[0];

        await cleanDateField.fill(pastDateString);

        // Verify error clears
        await expect(page.locator('text=Clean date cannot be in the future')).not.toBeVisible();
    });

    test('Loading states are handled properly during save', async ({ page }) => {
        // Open EditMemberPanel
        await expect(page.locator('table')).toBeVisible({ timeout: 10000 });
        const editButton = page.locator('button[title="Edit member"]').first();
        await editButton.click();
        await expect(page.locator('text=Edit Member:')).toBeVisible();

        // Make a small change
        const firstNameField = page.locator('#first_name');
        await firstNameField.fill(await firstNameField.inputValue() + ' Test');

        // Click save and immediately check loading state
        const saveButton = page.locator('text=Save Profile Changes');
        await saveButton.click();

        // Verify loading state appears
        await expect(page.locator('text=Saving...')).toBeVisible();

        // Verify button is disabled during save
        await expect(saveButton).toBeDisabled();

        // Wait for save to complete
        await expect(page.locator('text=Saving...')).not.toBeVisible({ timeout: 10000 });

        // Verify modal closes after successful save
        await expect(page.locator('text=Edit Member:')).not.toBeVisible({ timeout: 5000 });
    });

    test.afterEach(async ({ page }) => {
        // Clean up: close any open modals
        const closeButton = page.locator('button').filter({ has: page.locator('svg') }).first();
        if (await closeButton.isVisible()) {
            await closeButton.click();
        }
    });

});
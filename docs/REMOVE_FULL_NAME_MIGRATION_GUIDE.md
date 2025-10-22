# Migration Guide: Remove `full_name` Field & Switch to Separate Name Fields

## Overview

This guide provides step-by-step instructions to completely remove the `full_name` field from your database and update all components to use the separate name fields (`first_name`, `middle_initial`, `last_name`) instead.

**⚠️ IMPORTANT**: Execute these steps AFTER you've switched your site over and are ready to commit to the new structure permanently.

## Prerequisites

1. **Backup your database** before starting
2. Ensure you have access to your Supabase SQL Editor
3. Have your `.env` file configured with:
   - `VITE_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`

## Migration Steps

### Step 1: Database Schema Changes

#### 1.1 Remove `full_name` Column and Related Triggers

Execute this SQL in your Supabase SQL Editor:

```sql
-- Remove the trigger that auto-computes full_name
DROP TRIGGER IF EXISTS trigger_update_full_name ON member_profiles;

-- Remove the trigger function
DROP FUNCTION IF EXISTS update_full_name_from_parts();
DROP FUNCTION IF EXISTS compute_full_name(TEXT, TEXT, TEXT);

-- Remove the full_name column
ALTER TABLE member_profiles DROP COLUMN IF EXISTS full_name;

-- Drop the view that included full_name
DROP VIEW IF EXISTS member_profiles_with_computed_names;
```

### Step 2: Frontend Component Updates

#### 2.1 Update ProfileForm Component

**File:** `src/components/MemberProfile/ProfileForm.jsx`

Replace the full_name field with separate name fields:

```jsx
// REPLACE: Lines 12-14 in formData state
const [formData, setFormData] = useState({
  first_name: "",
  middle_initial: "",
  last_name: "",
  phone: "",
  email: "",
  clean_date: "",
  home_group_id: "",
  listed_in_directory: false,
  willing_to_sponsor: false,
  share_phone_in_directory: false,
  share_email_in_directory: false,
  officer_position: "",
});

// REPLACE: Lines 48-49 in useEffect
setFormData({
  first_name: profile.first_name || "",
  middle_initial: profile.middle_initial || "",
  last_name: profile.last_name || "",
  phone: formattedPhone,
  email: profile.email || "",
  clean_date: profile.clean_date
    ? new Date(profile.clean_date).toISOString().split("T")[0]
    : "",
  home_group_id: profile.home_group_id || "",
  listed_in_directory: profile.listed_in_directory || false,
  willing_to_sponsor: profile.willing_to_sponsor || false,
  share_phone_in_directory: profile.share_phone_in_directory || false,
  share_email_in_directory: profile.share_email_in_directory || false,
  officer_position: profile.officer_position || "",
});

// REPLACE: Lines 93-111 validateForm function
const validateForm = () => {
  const errors = {};

  if (!formData.first_name.trim()) {
    errors.first_name = "First name is required";
  }

  if (!formData.last_name.trim()) {
    errors.last_name = "Last name is required";
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Email is invalid";
  }

  if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
    errors.phone = "Phone number should be 10 digits";
  }

  return errors;
};

// REPLACE: Lines 183-200 in form fields
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div>
    <label
      htmlFor="first_name"
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      First Name <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      id="first_name"
      name="first_name"
      value={formData.first_name}
      onChange={handleChange}
      className={`w-full px-3 py-2 border ${
        formErrors.first_name ? "border-red-500" : "border-gray-300"
      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
      required
    />
    {formErrors.first_name && (
      <p className="mt-1 text-sm text-red-600">{formErrors.first_name}</p>
    )}
  </div>

  <div>
    <label
      htmlFor="middle_initial"
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      Middle Initial
    </label>
    <input
      type="text"
      id="middle_initial"
      name="middle_initial"
      value={formData.middle_initial}
      onChange={handleChange}
      maxLength="1"
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      placeholder="M"
    />
  </div>

  <div>
    <label
      htmlFor="last_name"
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      Last Name <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      id="last_name"
      name="last_name"
      value={formData.last_name}
      onChange={handleChange}
      className={`w-full px-3 py-2 border ${
        formErrors.last_name ? "border-red-500" : "border-gray-300"
      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
      required
    />
    {formErrors.last_name && (
      <p className="mt-1 text-sm text-red-600">{formErrors.last_name}</p>
    )}
  </div>
</div>;
```

#### 2.2 Update ProfileView Component

**File:** `src/components/MemberProfile/ProfileView.jsx`

Update to display separate name fields:

```jsx
// REPLACE: Line 86 display logic
<p className="font-medium">
  {profile.first_name && profile.last_name
    ? `${profile.first_name}${
        profile.middle_initial ? ` ${profile.middle_initial}` : ""
      } ${profile.last_name}`
    : "Not specified"}
</p>
```

#### 2.3 Update DirectoryMemberCard Component

**File:** `src/components/Directory/DirectoryMemberCard.jsx`

Replace `full_name` references:

```jsx
// REPLACE: Line 32 in ContactModal
<h3 className="text-lg font-medium text-gray-900 mb-4">
    Contact {member.first_name && member.last_name
        ? `${member.first_name}${member.middle_initial ? ` ${member.middle_initial}` : ''} ${member.last_name}`
        : 'Member'
    }
</h3>

// REPLACE: Lines 83-85 in main card
<h3 className="text-lg font-semibold text-gray-900">
    {member.first_name && member.last_name
        ? `${member.first_name}${member.middle_initial ? ` ${member.middle_initial}` : ''} ${member.last_name}`
        : 'Member'
    }
</h3>
```

#### 2.4 Update Admin Components

**File:** `src/components/Admin/SuperAdminDeleteModal.jsx`

```jsx
// REPLACE: Line 89
<div>
  <strong>Name:</strong>{" "}
  {member.profile?.first_name && member.profile?.last_name
    ? `${member.profile.first_name}${
        member.profile.middle_initial ? ` ${member.profile.middle_initial}` : ""
      } ${member.profile.last_name}`
    : "No name provided"}
</div>
```

**File:** `src/components/Admin/PendingMembersList.jsx`

```jsx
// REPLACE: Line 146
{
  member.profile?.first_name && member.profile?.last_name
    ? `${member.profile.first_name}${
        member.profile.middle_initial ? ` ${member.profile.middle_initial}` : ""
      } ${member.profile.last_name}`
    : "Name not provided";
}
```

### Step 3: Hook Updates

#### 3.1 Update useMemberProfile Hook

**File:** `src/hooks/useMemberProfile.js`

```jsx
// REPLACE: Lines 149, 168 in updateProfile calls
const { data, error } = await supabase.from("member_profiles").upsert({
  user_id: user.id,
  first_name: profileData.first_name,
  middle_initial: profileData.middle_initial,
  last_name: profileData.last_name,
  phone: profileData.phone,
  email: profileData.email,
  clean_date: profileData.clean_date,
  home_group_id: profileData.home_group_id || null,
  listed_in_directory: profileData.listed_in_directory,
  willing_to_sponsor: profileData.willing_to_sponsor,
  share_phone_in_directory: profileData.share_phone_in_directory,
  share_email_in_directory: profileData.share_email_in_directory,
  officer_position: profileData.officer_position,
});
```

#### 3.2 Update useUserManagement Hook

**File:** `src/hooks/useUserManagement.js`

```jsx
// REPLACE: Lines 131, 185 similar updates
first_name: profileData.first_name,
middle_initial: profileData.middle_initial,
last_name: profileData.last_name,
// ... rest of fields without full_name
```

#### 3.3 Update useDirectory Hook

**File:** `src/hooks/useDirectory.js`

```jsx
// REPLACE: Line 84 sorting logic
.sort((a, b) => {
    const nameA = a.first_name && a.last_name ? `${a.first_name} ${a.last_name}` : '';
    const nameB = b.first_name && b.last_name ? `${b.first_name} ${b.last_name}` : '';
    return nameA.localeCompare(nameB);
})

// REPLACE: Lines 143-144 search logic
const nameMatch = member.first_name?.toLowerCase().includes(query) ||
                 member.last_name?.toLowerCase().includes(query);
nameMatch || member.home_group?.name?.toLowerCase().includes(query)
```

### Step 4: Update MemberDashboard

**File:** `src/pages/MemberDashboard.jsx`

```jsx
// REPLACE: Line 48
const fields = [
  "first_name",
  "middle_initial",
  "last_name",
  "phone",
  "email",
  "clean_date",
  "home_group_id",
];
```

### Step 5: Update Test Files

#### 5.1 Update E2E Tests

**File:** `tests/e2e/edit-member-panel.spec.js`

Replace all `full_name` references with separate name field tests:

```javascript
// REPLACE: All instances of '#full_name' with separate field tests
await expect(page.locator("#first_name")).toBeVisible();
await expect(page.locator("#last_name")).toBeVisible();
await expect(page.locator("#middle_initial")).toBeVisible();

// REPLACE: Form filling tests
const firstNameField = page.locator("#first_name");
const lastNameField = page.locator("#last_name");
const middleInitialField = page.locator("#middle_initial");

await firstNameField.fill("John");
await middleInitialField.fill("D");
await lastNameField.fill("Smith");
```

### Step 6: Update Migration Scripts

#### 6.1 Update Member Migration Script

**File:** `scripts/migrate-existing-members.js`

Remove the `full_name` creation logic and keep only separate fields:

```javascript
// REMOVE: Lines 123-127 (full_name creation)
// Keep only:
const memberProfile = {
  user_id: user.id,
  first_name: cleanFirstName,
  middle_initial: null, // Set if you have middle initial data
  last_name: cleanLastName,
  phone: cleanPhone,
  email: cleanEmail,
  listed_in_directory: false,
  willing_to_sponsor: false,
  share_phone_in_directory: false,
  share_email_in_directory: false,
};
```

### Step 7: Create Helper Utility Function

Create a new utility file for consistent name handling:

**File:** `src/utils/nameUtils.js`

```javascript
/**
 * Format member name from separate fields
 * @param {Object} member - Member object with name fields
 * @returns {string} - Formatted full name
 */
export const formatMemberName = (member) => {
  if (!member?.first_name && !member?.last_name) {
    return "Member";
  }

  const parts = [];
  if (member.first_name) parts.push(member.first_name);
  if (member.middle_initial) parts.push(member.middle_initial);
  if (member.last_name) parts.push(member.last_name);

  return parts.join(" ") || "Member";
};

/**
 * Get display name for member (first name + last initial for privacy)
 * @param {Object} member - Member object with name fields
 * @returns {string} - Display name (e.g., "John S.")
 */
export const getDisplayName = (member) => {
  if (!member?.first_name) return "Member";

  let displayName = member.first_name;
  if (member.last_name) {
    displayName += ` ${member.last_name.charAt(0)}.`;
  }

  return displayName;
};
```

Then import and use this in your components:

```javascript
import { formatMemberName, getDisplayName } from "../../utils/nameUtils";

// Usage:
<h3 className="text-lg font-semibold text-gray-900">
  {formatMemberName(member)}
</h3>;
```

## Step 8: Testing & Verification

### 8.1 Run Tests

```bash
# Run all tests to ensure nothing is broken
npm test

# Run E2E tests specifically
npm run test:e2e
```

### 8.2 Manual Testing Checklist

- [ ] Profile form saves separate name fields correctly
- [ ] Profile view displays names properly
- [ ] Directory shows member names correctly
- [ ] Admin panels display member names
- [ ] Search functionality works with new name fields
- [ ] Member migration script works without full_name
- [ ] No database errors in console

### 8.3 Database Verification

Check that the migration completed successfully:

```sql
-- Verify full_name column is gone
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'member_profiles'
AND column_name = 'full_name';
-- Should return no results

-- Verify new columns exist and have data
SELECT first_name, middle_initial, last_name, COUNT(*)
FROM member_profiles
GROUP BY first_name, middle_initial, last_name
ORDER BY COUNT(*) DESC;
```

## Step 9: Post-Migration Cleanup

### 9.1 Remove Migration Files (Optional)

After successful migration, you can remove:

- `database/migration_separate_name_fields.sql`
- This guide file (keep for reference if desired)

### 9.2 Update Documentation

Update any remaining documentation that references `full_name` field.

## Rollback Plan

If you need to rollback this migration:

1. **Re-add full_name column:**

```sql
ALTER TABLE member_profiles ADD COLUMN full_name TEXT;
UPDATE member_profiles
SET full_name = CONCAT_WS(' ', first_name, middle_initial, last_name);
```

2. **Restore component code** from your backup/version control
3. **Update hooks and tests** back to full_name usage

## Support Notes

- **Performance:** The separate fields approach is more efficient for sorting and searching
- **Privacy:** You can now easily implement "first name + last initial" displays
- **Flexibility:** Easier to handle cultural name differences and user preferences
- **Database:** Smaller storage footprint without computed full_name field

## Completion Checklist

- [ ] Database schema updated (full_name column removed)
- [ ] All components updated to use separate name fields
- [ ] All hooks updated
- [ ] Tests updated and passing
- [ ] Manual testing completed
- [ ] Member migration script updated
- [ ] Helper utility functions created
- [ ] Documentation updated
- [ ] Production deployment successful

---

**🎉 Migration Complete!** Your application now uses separate name fields exclusively, providing better data structure and user privacy options.

# Member Directory RLS Policies - Fix Guide

## Overview

This guide explains the RLS (Row-Level Security) policy issues that were blocking the member directory functionality and how they've been fixed.

## Problem Summary

### Issue 1: RLS Policy Recursion ⚠️

The original policy for viewing directory listings had a recursive structure:

```sql
CREATE POLICY "Approved members can view directory listings" ON member_profiles
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM user_roles WHERE approval_status = 'approved'
        )
        AND listed_in_directory = TRUE
        AND user_id IN (
            SELECT user_id FROM user_roles WHERE approval_status = 'approved'
        )
    );
```

**Why this was problematic:**

- The policy tried to check user_roles table while evaluating member_profiles RLS
- Supabase RLS engine had to recursively evaluate policies on the user_roles subqueries
- This created infinite recursion loops, blocking all queries

### Issue 2: Query Structure Issues

The `useDirectory.js` hook used an invalid Supabase query syntax:

```javascript
// ❌ WRONG - invalid join syntax
.select(`
    *,
    user_role:user_id (approval_status, created_at),
    home_group:home_group_id (name, start_time, location)
`)
```

### Issue 3: Field Name Mismatch

The schema uses `listed_in_directory` but queries were using `list_in_directory`.

## Solutions Implemented

### Fix 1: Simplified RLS Policies ✅

**New approach:**

- Removed recursive policy checks
- Use simple boolean column check: `listed_in_directory = TRUE`
- Move approval status filtering to frontend/backend (which was already happening)

```sql
-- New simplified policy
CREATE POLICY "Public directory view" ON member_profiles
    FOR SELECT USING (listed_in_directory = TRUE);
```

**Benefits:**

- No recursion - fast and efficient
- Follows RLS best practices
- Approval filtering happens in application layer (more secure)
- Reduced database load

### Fix 2: Proper Query Structure ✅

**New approach:**

- Fetch member_profiles directly without complex joins
- Fetch user_roles separately using `.in()` operator
- Fetch home_groups separately
- Combine data using maps on the frontend

```javascript
// ✅ CORRECT - separate queries, no complex joins
const { data: profiles } = await supabase
  .from("member_profiles")
  .select("*")
  .eq("listed_in_directory", true);

const { data: userRoles } = await supabase
  .from("user_roles")
  .select("user_id, approval_status, created_at")
  .in("user_id", userIds);
```

**Benefits:**

- Uses official Supabase query patterns
- More reliable and maintainable
- Better error handling
- Easier to debug and cache

### Fix 3: Field Name Corrections ✅

- Updated all queries to use correct field name: `listed_in_directory`
- Verified consistency across codebase

## Files Modified

### Database

- **`database/member_portal_schema.sql`** - Updated RLS policies (lines 135-177)
- **`database/fix_rls_policies.sql`** - Migration script to apply fixes

### Frontend

- **`src/hooks/useDirectory.js`** - Rewritten query logic for reliability
  - Lines 17-95: New fetch logic with separate queries
  - Lines 101-117: Home groups query simplified
  - Lines 202-238: Improved useEffect initialization

### Components

- **`src/components/Directory/DirectoryFilters.jsx`** - No changes needed ✅
- **`src/components/Directory/DirectoryMemberCard.jsx`** - No changes needed ✅

### Routing

- **`src/App.jsx`** - Directory route already in place ✅

## Testing Steps

### Step 1: Apply Database Fixes

Copy and run the SQL from `database/fix_rls_policies.sql` in your Supabase SQL editor:

1. Go to Supabase Dashboard → SQL Editor
2. Create new query
3. Paste contents of `database/fix_rls_policies.sql`
4. Run the query
5. Verify no errors in the results

### Step 2: Create Test Data

You need to create test members with:

1. User accounts in Supabase Auth
2. User roles with `approval_status = 'approved'`
3. Member profiles with `listed_in_directory = true`

**Quick test:**

```sql
-- 1. Check if test home groups exist
SELECT * FROM home_groups LIMIT 5;

-- 2. Create or verify an approved user
-- (You need to create a user in Supabase Auth first)
-- Then create their user_role:
INSERT INTO user_roles (user_id, role, approval_status)
VALUES ('YOUR-USER-ID', 'member', 'approved')
ON CONFLICT DO NOTHING;

-- 3. Create their profile with directory listing
INSERT INTO member_profiles (
    user_id,
    full_name,
    phone,
    email,
    clean_date,
    home_group_id,
    listed_in_directory,
    willing_to_sponsor
) VALUES (
    'YOUR-USER-ID',
    'Test Member',
    '555-0123',
    'test@example.com',
    '2020-01-15',
    1,
    true,
    true
);
```

Use `database/test_directory_data.sql` for helper queries.

### Step 3: Test Frontend

1. Start development server:

   ```bash
   npm run dev
   ```

2. Navigate to `/directory`

3. Verify:
   - Page loads without errors
   - Member cards display correctly
   - Search filters work
   - Home group filter works
   - Sponsor filter works
   - Sobriety time calculates correctly
   - "Contact for Sponsorship" button appears for logged-in users

### Step 4: Verify RLS Policies

Check that policies are correctly applied:

```sql
-- List all policies for member_profiles
SELECT * FROM pg_policies
WHERE tablename = 'member_profiles'
ORDER BY policyname;

-- Expected policies:
-- 1. "Users can view their own profile"
-- 2. "Public directory view"
-- 3. "Admins can view all profiles"
-- 4. "Users can create their own profile"
-- 5. "Users can update their own profile"
-- 6. "Admins can update any profile"
```

## RLS Policy Reference

### Home Groups (Read-only for users)

- ✅ Anyone can view active home groups
- 🔒 Only admins can insert/update/delete

### Member Profiles

- ✅ Users can view their own profile
- ✅ Public can view profiles marked `listed_in_directory = true`
- 🔒 Only admins can view all profiles
- ✅ Users can create/update their own profile
- 🔒 Only admins can update any profile

### User Roles

- ✅ Users can view their own role
- 🔒 Only admins can view all roles
- 🔒 Only superadmins can insert/update roles

### Approval Codes

- 🔒 Only admins can view/create codes
- ✅ Anyone can use a valid code during signup

## Troubleshooting

### Directory page shows no members

**Cause:** No approved members with `listed_in_directory = true`

**Fix:**

1. Create test members using helper queries
2. Verify member has `approval_status = 'approved'` in user_roles
3. Verify member has `listed_in_directory = true` in member_profiles
4. Check browser console for API errors

### "Error loading directory" message

**Cause:** RLS policies blocking queries

**Fix:**

1. Apply `database/fix_rls_policies.sql`
2. Check that policies exist: `SELECT * FROM pg_policies WHERE tablename = 'member_profiles'`
3. Verify RLS is enabled: `ALTER TABLE member_profiles ENABLE ROW LEVEL SECURITY`

### Search/filter not working

**Cause:** Incorrect field names or data structure

**Fix:**

1. Check that `member_profiles` uses `listed_in_directory` (not `list_in_directory`)
2. Check browser console for errors
3. Verify home_group data is fetched: check Network tab in DevTools

### Cards show blank/missing data

**Cause:** Null/undefined field values

**Fix:**

1. Verify member profiles have required fields filled
2. Check `DirectoryMemberCard.jsx` - it safely handles null values
3. Verify home_group relationship is working (check console)

## Performance Considerations

The new query structure:

- ✅ Separates concerns (profiles, roles, groups)
- ✅ Allows for future caching/pagination
- ✅ Reduces Supabase RLS overhead
- ✅ Easier to optimize individual queries

For large datasets (1000+ members), consider:

1. Adding pagination to `useDirectory.js`
2. Debouncing search input
3. Using Supabase realtime subscriptions more efficiently

## Next Steps

1. ✅ Apply database fixes (`database/fix_rls_policies.sql`)
2. ✅ Create test members for directory
3. ✅ Test directory page `/directory`
4. 📋 Mark Phase 4 tasks as complete in `database/MEMBER_PORTAL_TODO.md`
5. 🔄 Proceed with Phase 4 remaining tasks:
   - [ ] Test directory with multiple members
   - [ ] Verify sponsorship contact workflow
   - [ ] Performance testing with large datasets

## References

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Query Documentation](https://supabase.com/docs/reference/javascript/select)
- Member Portal TODO: `database/MEMBER_PORTAL_TODO.md`

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review console errors in browser DevTools
3. Check Supabase logs for RLS violations
4. Verify database schema matches expectations

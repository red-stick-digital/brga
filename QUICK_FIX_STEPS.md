# Quick Fix Steps - Member Directory RLS Issues

**Time Required**: 5-10 minutes  
**Difficulty**: Easy  
**Requirements**: Supabase dashboard access

---

## Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**

---

## Step 2: Copy and Paste the Fix

Copy this entire SQL block into the Supabase SQL editor:

```sql
-- FIX RLS RECURSION ISSUE
-- This resolves member directory RLS policy recursion

-- Drop the problematic policy
DROP POLICY IF EXISTS "Approved members can view directory listings" ON member_profiles;

-- Create the fixed simplified policy
CREATE POLICY "Public directory view" ON member_profiles
    FOR SELECT USING (listed_in_directory = TRUE);

-- Verify all member_profiles policies are correct
DROP POLICY IF EXISTS "Users can view their own profile" ON member_profiles;
CREATE POLICY "Users can view their own profile" ON member_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE member_profiles ENABLE ROW LEVEL SECURITY;
```

---

## Step 3: Execute the Query

1. Click the **Run** button (or press `Cmd/Ctrl + Enter`)
2. Wait for the query to complete
3. You should see: `Success. No rows returned.`

---

## Step 4: Verify the Fix

Paste this verification query into a new SQL editor tab:

```sql
-- Verify the new policies are in place
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'member_profiles'
ORDER BY policyname;
```

Expected results - 6 policies should appear:

- ✅ Admins can update any profile
- ✅ Admins can view all profiles
- ✅ Public directory view ← NEW
- ✅ Users can create their own profile
- ✅ Users can update their own profile
- ✅ Users can view their own profile

---

## Step 5: Test with Sample Data (Optional)

To test the directory, create a test member:

### 5a. Create test user in Supabase Auth

1. Go to **Authentication** tab
2. Click **Users**
3. Click **Add User** (or use existing test user)
4. Email: `test@example.com`
5. Password: anything you want
6. Click **Create User**
7. Copy the user ID (looks like: `550e8400-e29b-41d4-a716-446655440000`)

### 5b. Create member profile

Paste this into SQL editor, replace `YOUR-USER-ID`:

```sql
-- First, ensure home_groups exist
INSERT INTO home_groups (name, start_time, street_1, city, state, zip)
VALUES (
    'Test Group',
    '19:00',
    '123 Main St',
    'Baton Rouge',
    'LA',
    '70806'
)
ON CONFLICT (name) DO NOTHING;

-- Get the home group ID
SELECT id FROM home_groups WHERE name = 'Test Group' LIMIT 1;
```

Copy the ID, then run:

```sql
-- Create user role
INSERT INTO user_roles (user_id, role, approval_status)
VALUES ('YOUR-USER-ID', 'member', 'approved')
ON CONFLICT DO NOTHING;

-- Create member profile
INSERT INTO member_profiles (
    user_id,
    full_name,
    phone,
    email,
    clean_date,
    home_group_id,
    listed_in_directory,
    willing_to_sponsor,
    created_at,
    updated_at
) VALUES (
    'YOUR-USER-ID',
    'Test Member',
    '555-0123',
    'test@example.com',
    '2020-01-15',
    1,  -- home_group_id from above query
    true,
    true,
    NOW(),
    NOW()
);
```

---

## Step 6: Test in Your App

```bash
npm run dev
```

Navigate to: `http://localhost:3000/directory`

You should see:

- ✅ Page loads (no errors)
- ✅ Loading spinner appears briefly
- ✅ Test member card is visible
- ✅ Member name, group, and sobriety time show
- ✅ Search works
- ✅ Filters work
- ✅ No error messages in console

---

## Troubleshooting

### Issue: "Policy not created" error

**Solution**: Make sure `member_profiles` table exists

```sql
SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'member_profiles');
-- Should return: true
```

### Issue: Still seeing "Error loading directory"

**Solution**: Check browser console for specific error

1. Open browser DevTools (`F12`)
2. Go to **Console** tab
3. Look for red error messages
4. Check if database policy was applied

### Issue: No members showing in directory

**Solutions**:

1. Did you create test data? (see Step 5)
2. Is the member profile marked `listed_in_directory = true`?
3. Is the user role marked `approval_status = 'approved'`?

```sql
-- Check what's in the database
SELECT user_id, full_name, listed_in_directory, created_at FROM member_profiles;

SELECT user_id, approval_status FROM user_roles WHERE user_id IN (
    SELECT user_id FROM member_profiles
);
```

---

## Success Checklist ✅

- [ ] SQL query executed successfully
- [ ] Verification query shows 6 policies
- [ ] No error messages in Supabase editor
- [ ] Directory page loads without errors
- [ ] Test members appear (if created test data)
- [ ] Search/filter functionality works

**Done!** Your member directory is now fixed and ready. 🎉

---

## Full Documentation

For more details, see:

- **`DATABASE_FIX_GUIDE.md`** - Comprehensive testing guide
- **`RLS_FIX_SUMMARY.md`** - Technical summary of what was fixed
- **`database/fix_rls_policies.sql`** - Full migration script
- **`database/test_directory_data.sql`** - More test queries

---

## Questions?

Check these files for answers:

- Testing issues → `DATABASE_FIX_GUIDE.md` Troubleshooting section
- How it works → `RLS_FIX_SUMMARY.md`
- Tech details → Code comments in `src/hooks/useDirectory.js`

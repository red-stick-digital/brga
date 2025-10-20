# Fix: Error Loading Profile

**Problem**: After logging in, you see "Error Loading Profile" with message about trying again later.

**Root Cause**: The `user_roles` table has recursive RLS policies that block queries, preventing the app from fetching the user's role.

---

## Quick Fix (2 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** → **New Query**

### Step 2: Copy and Run the Fix

Copy and paste this entire SQL block:

```sql
-- FIX USER ROLES RLS RECURSION ISSUE
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Drop ALL policies - dynamically finds and drops all existing policies
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE tablename = 'user_roles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON user_roles', pol.policyname);
    END LOOP;
END $$;

-- Create SIMPLE NON-RECURSIVE policies
CREATE POLICY "Users can view own role" ON user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role all access" ON user_roles
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Authenticated users can create role" ON user_roles
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update role" ON user_roles
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete role" ON user_roles
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Verify result
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'user_roles'
ORDER BY policyname;
```

Click **Run** (or press `Cmd/Ctrl + Enter`)

### Step 3: Verify Success

You should see: `Success. No rows returned.`

### Step 4: Test in App

1. Refresh your browser tab with the app (or press `Cmd/Ctrl + R`)
2. Try logging in again with marsh11272@yahoo.com
3. You should now see your Member Dashboard ✅

---

## What Changed?

**Before** ❌

- Policies tried to check admin status by querying `user_roles` table
- This created infinite recursion loops
- All queries to `user_roles` were blocked

**After** ✅

- Policies are simple: just check if it's your own row or if you're authenticated
- No recursion - fast and reliable
- Application handles admin checks in the frontend

---

## Still Having Issues?

Check the browser console (`F12` → Console tab):

**If you see**: `RLS Policy blocking user_roles access`

- The fix didn't apply correctly
- Try Step 2 again, make sure all SQL ran without errors

**If you see other errors**:

- Clear browser cache (`Cmd/Ctrl + Shift + R` to hard refresh)
- Try logging out and logging back in
- Contact support with the error details

---

## Additional Fix (if needed)

If you also previously applied the member_profiles RLS fix, you're all set! Both tables now use simple, non-recursive policies.

**Related**: See `QUICK_FIX_STEPS.md` for the member_profiles directory fix (if not already applied).

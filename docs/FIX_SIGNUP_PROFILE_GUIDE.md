# Fix Signup Profile Creation - Application Guide

## Problem

Users are being created in `auth.users` table but not getting entries in `member_profiles` and sometimes `user_roles`.

**Example**: User `deb0430d-60f9-46b1-97a9-460bc9fb80e8` exists in auth but has no profile.

## Root Cause

1. No database trigger to auto-create `member_profiles` when new user signs up
2. Signup code only created `user_roles`, forgot to create `member_profiles`

## Solution Applied

### Code Fix (Already Deployed)

✅ Updated `src/hooks/useAuth.js` to create both:

- `user_roles` entry (existing)
- `member_profiles` entry (NEW)

This will work for **all new signups going forward**.

### Database Fix (NEEDS TO BE APPLIED)

**You need to run this SQL in Supabase SQL Editor:**

```sql
-- File: database/fix_signup_profile_creation.sql
```

## How to Apply the SQL Fix

### Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard/project/nrpwrxeypphbduvlozbr
2. Click **SQL Editor** in left sidebar
3. Click **New Query**

### Step 2: Run the Migration

1. Copy the entire contents of `database/fix_signup_profile_creation.sql`
2. Paste into the SQL Editor
3. Click **Run** or press `Cmd+Enter`

### Step 3: Verify the Fix

The script will output something like:

```
users_in_auth | profiles_created
--------------|------------------
     5        |        5
```

This confirms all users now have profiles.

### Step 4: Check Specific User

Run this query to verify user `deb0430d-60f9-46b1-97a9-460bc9fb80e8`:

```sql
-- Check if user now has profile and role
SELECT
    au.id,
    au.email,
    mp.id as profile_id,
    ur.role,
    ur.approval_status
FROM auth.users au
LEFT JOIN member_profiles mp ON au.id = mp.user_id
LEFT JOIN user_roles ur ON au.id = ur.user_id
WHERE au.id = 'deb0430d-60f9-46b1-97a9-460bc9fb80e8';
```

Expected result:

- `profile_id`: Should have a value (not NULL)
- `role`: Should be 'member'
- `approval_status`: Should be 'pending' or 'approved'

## What the Fix Does

### 1. Creates Database Trigger

```sql
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();
```

This automatically creates a `member_profiles` entry whenever a new user signs up.

### 2. Backfills Existing Users

Creates profiles for any users who don't have one yet (like user `deb0430d-...`).

### 3. Future Signups

- **Database trigger**: Auto-creates profile (primary method)
- **Signup code**: Also creates profile (backup in case trigger fails)

## Testing the Fix

### Test New Signup

1. Sign up with a new test email
2. Check Supabase:
   - Should appear in `auth.users` ✓
   - Should appear in `user_roles` ✓
   - Should appear in `member_profiles` ✓ (NEW)

### SQL to Check New User

```sql
SELECT
    au.email,
    mp.id as has_profile,
    ur.role,
    ur.approval_status
FROM auth.users au
LEFT JOIN member_profiles mp ON au.id = mp.user_id
LEFT JOIN user_roles ur ON au.id = ur.user_id
ORDER BY au.created_at DESC
LIMIT 5;
```

## Troubleshooting

### User still has no profile after applying SQL

1. Check if trigger was created:

```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

2. Manually create profile:

```sql
INSERT INTO member_profiles (user_id, email)
VALUES ('deb0430d-60f9-46b1-97a9-460bc9fb80e8', 'user@example.com')
ON CONFLICT (user_id) DO NOTHING;
```

### RLS Policy Issues

If profile creation fails due to RLS:

```sql
-- Temporarily check policies
SELECT * FROM pg_policies WHERE tablename = 'member_profiles';
```

The policy `"Users can create their own profile"` should allow this.

## Summary

✅ **Code deployed** - New signups will create profiles  
⚠️ **SQL needed** - Apply `fix_signup_profile_creation.sql` in Supabase  
✅ **Backfill included** - Existing users will get profiles automatically

After applying SQL, test by:

1. Logging in as user `deb0430d-60f9-46b1-97a9-460bc9fb80e8`
2. Navigate to `/member/profile`
3. Should see profile page (not error)

# Member Dashboard - Sorting & Display Fix

## Issue 1: Home Groups Not Sorting Correctly

**Root Cause**: The `day_of_week` column either doesn't exist or has no values set for your groups.

### Fix Step 1: Verify Column Exists

Go to Supabase SQL Editor and run:

```sql
-- Check if day_of_week column exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'home_groups'
ORDER BY column_name;
```

**Expected result**: Should see `day_of_week` with type `integer`

If column is **missing**, run:

```sql
ALTER TABLE home_groups
ADD COLUMN IF NOT EXISTS day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6) DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_home_groups_day_of_week ON home_groups(day_of_week);
```

### Fix Step 2: Set day_of_week Values

First, view all your home groups:

```sql
SELECT id, name FROM home_groups ORDER BY name;
```

Then set the day_of_week for each group:

```
0 = Sunday
1 = Monday
2 = Tuesday
3 = Wednesday
4 = Thursday
5 = Friday
6 = Saturday
```

**Example** - if you have a "Monday Lunch" group:

```sql
UPDATE home_groups
SET day_of_week = 1
WHERE name = 'Monday Lunch';
```

Or if your group names contain the day, you can do bulk updates:

```sql
UPDATE home_groups SET day_of_week = 1 WHERE name ILIKE '%Monday%' AND day_of_week IS NULL;
UPDATE home_groups SET day_of_week = 2 WHERE name ILIKE '%Tuesday%' AND day_of_week IS NULL;
UPDATE home_groups SET day_of_week = 3 WHERE name ILIKE '%Wednesday%' AND day_of_week IS NULL;
UPDATE home_groups SET day_of_week = 4 WHERE name ILIKE '%Thursday%' AND day_of_week IS NULL;
UPDATE home_groups SET day_of_week = 5 WHERE name ILIKE '%Friday%' AND day_of_week IS NULL;
UPDATE home_groups SET day_of_week = 6 WHERE name ILIKE '%Saturday%' AND day_of_week IS NULL;
```

### Fix Step 3: Verify All Groups Have Values

```sql
-- Check for any missing day_of_week values
SELECT id, name, day_of_week
FROM home_groups
ORDER BY day_of_week, name;
```

All groups should now show a day (0-6), not NULL.

---

## Issue 2: Phone Number Not Updating Without Refresh

**Root Cause**: The form wasn't displaying the phone number in the proper format when loaded from the database.

**Fix Applied**: Updated `ProfileForm.jsx` to format phone numbers correctly when loading the profile (now displays as `337-889-8123` instead of `3378898123`).

### What to Test

1. Go to **Member Dashboard**
2. Click **Edit Profile**
3. Phone should display as `XXX-XXX-XXXX` format
4. Edit any field and click **Save**
5. Should immediately go back to view without needing refresh
6. Phone should display correctly in the view

### If Still Having Issues

**Clear browser cache** and refresh:

- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

Or open DevTools and disable cache:

1. Press `F12` (or `Cmd+Opt+I` on Mac)
2. Right-click the reload button → "Empty cache and hard reload"

---

## Verification Checklist

- [ ] `day_of_week` column added to `home_groups` table
- [ ] All home groups have `day_of_week` values (0-6)
- [ ] Phone number displays as `XXX-XXX-XXXX` in edit form
- [ ] Dropdown sorts: Monday → Tuesday → Wednesday → Thursday → Friday → Saturday → Sunday
- [ ] After saving, profile updates appear immediately (no refresh needed)

---

## Quick SQL Check

Run this to see everything at once:

```sql
SELECT
  id,
  name,
  day_of_week,
  start_time
FROM home_groups
ORDER BY day_of_week, start_time
LIMIT 20;
```

If `day_of_week` shows `NULL` or `0` for all rows, you need to set the values manually.

# Latest Updates - Member Dashboard Fixes

## Changes Made

### 1. ✅ Phone Number Display Fix

**File**: `src/components/MemberProfile/ProfileForm.jsx`

- Phone numbers now display in formatted `XXX-XXX-XXXX` format when the form loads
- Previously showed raw digits `3378898123` which confused users
- Auto-formats as user types and stores as digits in database for flexibility

**What changed**:

- Phone numbers are formatted when loading profile data into the form
- Applied same logic as the real-time onChange handler

---

### 2. ✅ Home Groups Sorting Improvements

**Files Updated**:

- `src/components/MemberProfile/ProfileForm.jsx`
- `src/hooks/useMemberProfile.js`
- `src/hooks/useDirectory.js`

**Changes**:

- **Primary sort**: By `day_of_week` (0-6 where 0=Sunday, 1=Monday, etc.)
- **Secondary sort**: By `start_time` (earliest meeting first)
- Added fallback client-side sorting in case database query has issues
- Groups now appear in order: Monday → Tuesday → Wednesday → Thursday → Friday → Saturday → Sunday

**Sorting logic improved**:

```
Before: Just sorted by day_of_week
After:  Primary by day_of_week, secondary by start_time
        With fallback handling for NULL/missing values
```

---

## What You Need to Do Now

### Critical: Set day_of_week Values

The sorting won't work unless you populate the `day_of_week` column for each home group.

**Go to Supabase SQL Editor and run**:

```sql
-- View all your home groups
SELECT id, name, start_time FROM home_groups ORDER BY name;
```

Then set the day for each:

```
0 = Sunday
1 = Monday
2 = Tuesday
3 = Wednesday
4 = Thursday
5 = Friday
6 = Saturday
```

**Example**:

```sql
UPDATE home_groups SET day_of_week = 1 WHERE name ILIKE '%Monday%';
UPDATE home_groups SET day_of_week = 2 WHERE name ILIKE '%Tuesday%';
-- ... etc for your groups
```

Or if you want to check which ones are missing values:

```sql
SELECT id, name, day_of_week, start_time
FROM home_groups
WHERE day_of_week IS NULL
ORDER BY name;
```

---

## Testing Checklist

- [ ] Go to Member Dashboard → Edit Profile
- [ ] Phone displays as `337-889-8123` (formatted with dashes)
- [ ] Open Home Group dropdown
- [ ] Groups are sorted by day: Monday first, then Tuesday, etc.
- [ ] Groups on same day are sorted by start time
- [ ] Edit and save profile
- [ ] Updates appear immediately (no page refresh needed)
- [ ] Refresh page to verify phone still displays correctly

---

## Files Modified

1. **ProfileForm.jsx**

   - Line 30-42: Phone formatting on initial load
   - Line 266-272: Two-level sorting (day_of_week + start_time)

2. **useMemberProfile.js**

   - Line 178-209: Improved fetchHomeGroups with fallback sorting

3. **useDirectory.js**
   - Line 101-128: Improved fetchHomeGroups for directory view

---

## Troubleshooting

### Groups still not in correct order?

- Verify `day_of_week` column exists:
  ```sql
  SELECT column_name FROM information_schema.columns
  WHERE table_name = 'home_groups';
  ```
- Check if values are set:
  ```sql
  SELECT id, name, day_of_week FROM home_groups LIMIT 10;
  ```

### Phone number still showing without dashes?

- Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache in DevTools (F12)
- Try logging out and back in

### Updates still require refresh?

- Check browser console (F12 → Console) for errors
- Verify your Supabase RLS policies allow updates
- Try hard refresh after saving

---

## Next Steps

1. **Set day_of_week values** for all home groups (see SQL above)
2. **Test the dropdown** - should show Monday first
3. **Test phone display** - should show `XXX-XXX-XXXX` format
4. **Test save without refresh** - updates should appear immediately

Questions? Check `MEMBER_DASHBOARD_FIX.md` for detailed diagnostics.

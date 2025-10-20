# Member Dashboard Updates

## Changes Made

### 1. ✅ Phone Number Formatting

- **Display format**: `337-889-8123` (no parentheses)
- **Storage format**: `3378898123` (digits only in database)
- **Input behavior**: Auto-formats as user types
  - Types `3378898123` → displays as `337-889-8123`
  - Removes all non-digits automatically
  - Limits to 10 digits

### 2. ✅ Home Groups Sorted by Day of Week

- **Order**: Monday → Tuesday → Wednesday → Thursday → Friday → Saturday → Sunday
- **Code**: `0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday`
- **Where it's sorted**:
  - ✅ Member Dashboard (profile edit form)
  - ✅ Member Directory (group filter dropdown)
  - ✅ Database queries (sorted server-side)

---

## Database Setup Required

Run this SQL in Supabase to add the day_of_week column:

```sql
-- Add day_of_week column to home_groups table
ALTER TABLE home_groups
ADD COLUMN IF NOT EXISTS day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6) DEFAULT 0;

-- Create index for faster sorting
CREATE INDEX IF NOT EXISTS idx_home_groups_day_of_week ON home_groups(day_of_week);
```

Then update your home groups with the correct day values:

```sql
-- Example: Update home groups with day_of_week values
-- Monday = 1, Tuesday = 2, Wednesday = 3, Thursday = 4, Friday = 5, Saturday = 6, Sunday = 0

UPDATE home_groups SET day_of_week = 1 WHERE name LIKE '%Monday%' OR name LIKE '%Monday Nite%';
UPDATE home_groups SET day_of_week = 2 WHERE name LIKE '%Tuesday%';
UPDATE home_groups SET day_of_week = 3 WHERE name LIKE '%Wednesday%';
UPDATE home_groups SET day_of_week = 4 WHERE name LIKE '%Thursday%';
UPDATE home_groups SET day_of_week = 5 WHERE name LIKE '%Friday%';
UPDATE home_groups SET day_of_week = 6 WHERE name LIKE '%Saturday%';
UPDATE home_groups SET day_of_week = 0 WHERE name LIKE '%Sunday%';

-- Verify the updates
SELECT id, name, day_of_week, start_time FROM home_groups ORDER BY day_of_week, start_time;
```

---

## File Changes Summary

| File                                           | Changes                                                         |
| ---------------------------------------------- | --------------------------------------------------------------- |
| `src/components/MemberProfile/ProfileForm.jsx` | Phone masking (337-889-8123), store as digits, sort home groups |
| `src/components/MemberProfile/ProfileView.jsx` | Display phone as 337-889-8123 format                            |
| `src/hooks/useMemberProfile.js`                | Sort home groups by day_of_week and start_time                  |
| `src/hooks/useDirectory.js`                    | Sort home groups by day_of_week and start_time                  |
| `database/add_day_of_week.sql`                 | Migration to add day_of_week column                             |

---

## Testing the Changes

### 1. Test Phone Format

1. Go to Member Dashboard
2. Click "Edit Profile"
3. In the Phone field, type: `3378898123`
4. Should display as: `337-889-8123`
5. Save the profile
6. View the profile - should still display as `337-889-8123`

### 2. Test Home Group Sorting

1. In Member Dashboard edit form, look at the "Home Group" dropdown
2. Groups should be ordered: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
3. Within each day, groups are sorted by start time (earliest first)

---

## Before and After

### Phone Numbers

```
Before: (337) 889-8123  (with parentheses)
After:  337-889-8123    (without parentheses)
DB:     3378898123      (digits only)
```

### Home Groups Dropdown

```
Before:
- Garden Club Thursday - 7:00 PM
- Monday Night Group - 6:00 PM
- Friday Fellowship - 8:00 PM

After:
- Monday Night Group - 6:00 PM
- Garden Club Thursday - 7:00 PM
- Friday Fellowship - 8:00 PM
```

---

## How It Works

### Phone Number Masking

The form automatically formats phone input as the user types:

- `3` → `3`
- `33` → `33`
- `337` → `337`
- `3378` → `337-8`
- `33789` → `337-89`
- `337898` → `337-898`
- `3378988` → `337-898-8`
- `33789881` → `337-898-81`
- `337898812` → `337-898-812`
- `3378988123` → `337-898-8123` (stops at 10 digits)

When saving, only digits are stored in the database. When displaying, the phone formatter converts back to XXX-XXX-XXXX format.

### Home Group Sorting

Database has a `day_of_week` field (0-6 where 0=Sunday, 1=Monday, etc.). When fetching:

1. Primary sort: `day_of_week` (ascending) → groups in day order
2. Secondary sort: `start_time` (ascending) → within same day, earliest time first

---

## Rollback (if needed)

To revert phone format changes, look for the phone formatting logic in:

- `ProfileForm.jsx` (handleChange function and handleSubmit)
- `ProfileView.jsx` (formatPhoneNumber function)

To remove day_of_week column:

```sql
ALTER TABLE home_groups DROP COLUMN day_of_week;
DROP INDEX IF EXISTS idx_home_groups_day_of_week;
```

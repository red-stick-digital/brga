# Member Dashboard Quick Setup

## What Was Updated

✅ **Phone Number Format**: Changed from `(337) 889-8123` to `337-889-8123`
- Input field auto-formats as you type
- Stores as digits only: `3378898123`
- Display shows: `337-889-8123`

✅ **Home Groups Ordered by Day of Week**
- Monday → Tuesday → Wednesday → Thursday → Friday → Saturday → Sunday
- Within each day, sorted by meeting time (earliest first)

---

## What You Need to Do

### Step 1: Add day_of_week Column to Database

Copy and paste this SQL into Supabase SQL Editor:

```sql
ALTER TABLE home_groups
ADD COLUMN IF NOT EXISTS day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6) DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_home_groups_day_of_week ON home_groups(day_of_week);
```

### Step 2: Populate day_of_week for Your Groups

Update each home group with the correct day number:
- **0** = Sunday
- **1** = Monday  
- **2** = Tuesday
- **3** = Wednesday
- **4** = Thursday
- **5** = Friday
- **6** = Saturday

Example:
```sql
UPDATE home_groups SET day_of_week = 1 WHERE name LIKE '%Monday%';
UPDATE home_groups SET day_of_week = 2 WHERE name LIKE '%Tuesday%';
-- ... etc for each day
```

Or use this to list all groups and update manually in Supabase editor:
```sql
SELECT id, name, day_of_week, start_time FROM home_groups ORDER BY name;
-- Then click the pencil icon next to each row to edit day_of_week
```

### Step 3: Test in Your App

1. Go to your Member Dashboard
2. Click "Edit Profile"
3. Try entering a phone number - it should auto-format to `337-889-8123`
4. Check the "Home Group" dropdown - groups should be in day order
5. Save your profile

---

## What Changed in Code

| File | Change |
|------|--------|
| ProfileForm.jsx | Auto-formatting phone input, sort groups by day |
| ProfileView.jsx | Display phone as 337-889-8123 |
| useMemberProfile.js | Sort home groups query by day_of_week |
| useDirectory.js | Sort home groups query by day_of_week |

**No code deployment needed** - just database setup!

---

## Example Before/After

### Before
```
Phone: (337) 889-8123
Groups dropdown:
- Friday Group - 7:00 PM
- Monday Group - 6:00 PM
- Thursday Meeting - 8:00 PM
```

### After
```
Phone: 337-889-8123
Groups dropdown:
- Monday Group - 6:00 PM
- Thursday Meeting - 8:00 PM
- Friday Group - 7:00 PM
```

---

## Questions?

See `MEMBER_DASHBOARD_UPDATES.md` for more detailed info.

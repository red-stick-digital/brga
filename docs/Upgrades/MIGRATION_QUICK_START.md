# Member Migration - Quick Start Guide

## Overview

We're ready to migrate 25 existing members from `members.csv` into the new Supabase-based website. Each user will receive a Magic Link email (24-hour expiration) to set their password.

---

## What Happens During Migration

For each member in the CSV:

1. ✅ **Auth User Created** - Can login after setting password
2. ✅ **Member Profile Created** - With name, phone, email from CSV
3. ✅ **User Role Created** - Set to 'member' with 'approved' status
4. ✅ **Magic Link Email Sent** - User clicks link to set password (valid for 24 hours)

---

## Before You Start

### Step 1: Customize Email Template (5 minutes)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project → **Authentication** → **Providers** → **Email**
3. Verify **"Email OTP Expiration"** is set to **86000 seconds** (~24 hours)
4. Navigate to **Authentication** → **Email Templates**
5. Click **"Reset Password"** template
6. Copy/paste the email template from `docs/EMAIL_TEMPLATE_SETUP.md`
7. Make sure expiration text says "24 hours" not "1 hour"
8. **Save** the template

### Step 2: Test Migration (2 minutes)

Run in test mode to process only first 2 users:

```bash
cd /Users/marshallnaquin/projects/batonrougega
node scripts/migrate-csv-members.js --test
```

Watch the terminal output - you should see:

- ✅ Auth user created
- ✅ Profile created
- ✅ Role created
- ✅ Magic Link email sent

Check the email inbox for those 2 test users and verify:

- Email received (check spam folder too)
- Template looks correct
- Link works and allows password setting
- User can login after setting password

---

## Run Full Migration

Once testing looks good, run for all 25 members:

```bash
node scripts/migrate-csv-members.js
```

**Time estimate**: ~2 minutes (2 second delay between each user to avoid rate limits)

---

## What to Expect

### Success Scenario

```
=================================================================
Processing member 1:
=================================================================
📧 Email: aledet4017@gmail.com
👤 Name: Adam Ledet
📱 Phone: 2253844127

📝 Step 1: Creating auth user...
✅ Auth user created (ID: abc-123...)

📝 Step 2: Creating member profile...
✅ Member profile created

📝 Step 3: Creating user role...
✅ User role created (member, approved)

📝 Step 4: Sending password reset email...
✅ Password reset email sent

✅ Migration complete for aledet4017@gmail.com
```

### Final Summary

```
================================================================================
MIGRATION SUMMARY
================================================================================
Total members: 25
✅ Successful: 22
❌ Failed: 0
⏭️  Skipped: 3 (invalid emails)
```

---

## Expected Skips

These entries have invalid/missing emails and will be skipped:

1. `debshark@hotmail.com` - No name/data
2. `lblalo2@gmail.com` - No name/data
3. `mmart33@gmail.com` - No name/data
4. `yolandethomas86@gmail.com` - No name/data

You can manually add these users later if you get valid contact info.

---

## After Migration

### User Experience

1. User receives email: "Set Your Password - Baton Rouge GA Member Portal"
2. Clicks "Set Your Password" button in email
3. Taken to password reset page
4. Sets new password (must be strong - Supabase requires 6+ characters)
5. Redirected to member profile page
6. Can now login anytime with email + new password

### Admin Tasks (Optional)

- Review users in Supabase Dashboard: **Authentication** → **Users**
- Verify all have profiles: Check `member_profiles` table
- Verify all have roles: Check `user_roles` table with `approval_status: 'approved'`

---

## Troubleshooting

### "Email already registered"

- User already exists in system
- Have them use "Forgot Password" on login page

### "Failed to send Magic Link email"

- User was created successfully
- Can manually send password reset:
  - Go to Supabase Dashboard → Authentication → Users
  - Find user → Click "Send password recovery"

### User reports "Link expired"

- Magic Links expire after 24 hours
- User can click "Forgot Password" on login page to get new link

### User can't find email

- Check spam/junk folder
- Verify email address is correct
- Can resend from Supabase Dashboard

---

## Support During Migration

If users call with issues:

1. **Can't find email**: Check spam, verify email address, can resend from dashboard
2. **Link expired**: Click "Forgot Password" on login page
3. **Can't login**: Verify they completed password reset, check Supabase dashboard
4. **Other issues**: Call Marshall at 337-889-8123

---

## Files Created

- ✅ `scripts/migrate-csv-members.js` - Migration script
- ✅ `docs/TASK_member_csv_migration.md` - Detailed task tracking
- ✅ `docs/EMAIL_TEMPLATE_SETUP.md` - Email template instructions
- ✅ `docs/MIGRATION_QUICK_START.md` - This file

---

## Ready to Go?

1. **Customize email template** (5 min)
2. **Test with 2 users**: `node scripts/migrate-csv-members.js --test`
3. **Run full migration**: `node scripts/migrate-csv-members.js`
4. **Monitor emails** and be available for support calls

That's it! 🚀

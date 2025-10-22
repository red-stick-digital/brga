# Member Migration Guide

This guide explains how to migrate existing members from your CSV file to the new Baton Rouge GA member portal.

## Overview

The migration process will:

1. Add separate name fields to the database (first_name, middle_initial, last_name)
2. Create user accounts for all valid members in your CSV
3. Set all users with the temporary password: `BRGApage17`
4. Send welcome emails to all migrated users
5. Create member profiles with their contact information

## Prerequisites

1. **Environment Variables**: Ensure these are set in your `.env` file:

   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (admin access)
   - `RESEND_API_KEY` - Your Resend API key for sending emails

2. **CSV File**: Your `members.csv` file should be in the root directory with columns:
   - `Email` - Member email address
   - `First name` - Member first name
   - `Last name` - Member last name
   - `Phone` - Member phone number (optional)

## Migration Steps

### Step 1: Apply Database Migration

First, add the new name fields to your database:

```bash
node scripts/apply-name-fields-migration.js
```

**If this fails**, manually run the SQL in Supabase:

1. Open your Supabase SQL Editor
2. Copy and paste the contents of `database/migration_separate_name_fields.sql`
3. Execute the SQL

### Step 2: Run Member Migration

After the database migration is complete, migrate your members:

```bash
node scripts/migrate-existing-members.js
```

This will:

- Process each row in `members.csv`
- Skip invalid entries (missing email, malformed emails, etc.)
- Create user accounts with password `BRGApage17`
- Create member profiles with separate name fields
- Send welcome emails to all users
- Display a detailed summary report

## What Gets Created

For each valid member, the migration creates:

1. **Auth User**:

   - Email/password authentication
   - Password set to `BRGApage17`
   - Email confirmation skipped (auto-confirmed)

2. **User Role**:

   - Role: `member`
   - Status: `approved` (no approval needed)

3. **Member Profile**:
   - `first_name`, `last_name` from CSV
   - `full_name` auto-computed from parts
   - `phone`, `email` from CSV
   - Directory preferences set to private by default
   - Users can update their own preferences after login

## Data Handling

- **Missing Names**: Entries with no name data are skipped
- **Invalid Emails**: Malformed email addresses are skipped
- **Duplicates**: Existing users are not overwritten
- **Privacy**: All users start with private directory settings
- **Phone Numbers**: Preserved as-is from CSV

## After Migration

### For Users

1. Users receive welcome emails with login instructions
2. They can login at `https://batonrougega.org/login`
3. Email: their email address
4. Password: `BRGApage17`
5. Users should change their password after first login
6. Users can update their profile and directory preferences

### For Admins

1. Review the migration summary for any failures
2. Handle failed migrations manually if needed
3. Monitor for support requests from users
4. Consider creating announcement about the new system

## Troubleshooting

### Common Issues

1. **Environment Variables Missing**

   - Ensure all required variables are in `.env`
   - Check that service role key has admin permissions

2. **Database Migration Fails**

   - Run the SQL manually in Supabase SQL Editor
   - Ensure you have database modification permissions

3. **Email Sending Fails**

   - Verify RESEND_API_KEY is correct
   - Check Resend domain configuration
   - Users can still login even if email fails

4. **CSV Parsing Issues**
   - Ensure CSV has correct column headers (case-sensitive)
   - Check for special characters or encoding issues
   - Review skipped entries in migration report

### Migration Report

The migration script provides a detailed report showing:

- ✅ Successful migrations with user details
- ❌ Failed migrations with error reasons
- ⏭️ Skipped entries (invalid data)
- 📊 Total summary statistics

### Rollback

To rollback the migration:

1. Delete users from Supabase Auth dashboard
2. Clear `member_profiles` and `user_roles` tables
3. Remove the name field columns if desired

## Security Notes

- All users start with the same temporary password
- Encourage users to change passwords immediately
- Directory sharing is disabled by default for privacy
- Email confirmation is skipped for migrated users
- Users maintain full control over their profile data

## Support

After migration, users may need help with:

- Password reset (if they can't remember to change it)
- Profile updates and directory preferences
- Understanding new features
- General navigation of the new system

Consider creating a help document or FAQ for common user questions.

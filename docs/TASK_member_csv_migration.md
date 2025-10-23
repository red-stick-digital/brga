# TASK: Member CSV Migration to New Site

**Created**: October 22, 2025  
**Status**: In Progress  
**Objective**: Migrate 25 existing members from members.csv into the new Supabase authentication system with OTP-based password reset flow.

---

## PROJECT CONTEXT

- **Current State**: New website is live with Supabase auth, but existing members need to be migrated
- **Member Data Source**: `/members.csv` (25 members)
- **Authentication Method**: Supabase Auth with Magic Link (24-hour expiration)
- **Database Schema**: Uses `member_profiles` with first_name, middle_initial, last_name, full_name fields

---

## MIGRATION REQUIREMENTS

### User Requirements

1. All users in members.csv must be able to login to the new site
2. Users receive email with Magic Link to set their password (24-hour expiration)
3. Custom email template with support contact (Marshall N. 337-889-8123)
4. Handle incomplete/malformed data gracefully
5. All users get 'approved' member status

### Technical Requirements

1. Create auth.users entries for each member
2. Create member_profiles entries with available CSV data
3. Create user_roles entries with role='member', approval_status='approved'
4. Use Supabase's built-in password recovery Magic Link flow (24-hour expiration)
5. Custom email template for password setup instructions

---

## MIGRATION PHASES

### Phase 1: Data Validation & Cleanup ✅

- [x] Review CSV data structure
- [x] Identify data quality issues
- [x] Confirm field mappings to database schema
- [x] Fix known email issues (ensmingerglen@gmail.com)

**CSV Issues Identified**:

- 3 entries with no email data (will skip)
- 2 entries with malformed emails (corrected: ensmingerglen@gmail.com, tonyjamedee@gmail.com)
- Several entries missing names (acceptable - will use placeholder)
- Phone numbers need formatting cleanup

**Field Mapping**:

```
CSV → Database
Email → email (in both auth.users and member_profiles)
First name → first_name
Last name → last_name
Phone → phone
Full name → first_name + " " + last_name
```

### Phase 2: Setup Email Template

- [ ] Access Supabase Dashboard → Email Templates
- [ ] Customize "Reset Password" email template with Magic Link instructions
- [ ] Verify expiration set to 86,000 seconds (24 hours) in Auth > Providers > Email
- [ ] Test email delivery

**Custom Email Content**:

```
Subject: Set Your Password - Baton Rouge GA Member Portal

Your email has been loaded into the updated website.

To set your password, click the button below and follow the instructions:

[Set Password Button]

If you have any trouble logging in or encounter any errors,
call Marshall N. at 337-889-8123.
```

### Phase 3: Create Migration Script ✅

- [x] Create `scripts/migrate-csv-members.js`
- [x] Implement CSV parsing
- [x] Implement Supabase Admin API calls for user creation
- [x] Handle member_profiles creation
- [x] Handle user_roles creation
- [x] Implement password reset email trigger
- [x] Add error handling and logging

**Script Functions**:

1. `parseCSV()` - Parse members.csv
2. `validateEmail()` - Check email validity
3. `createAuthUser()` - Create user in auth.users
4. `createMemberProfile()` - Create profile entry
5. `createUserRole()` - Create role entry with 'approved' status
6. `sendPasswordResetEmail()` - Trigger OTP password setup
7. `runMigration()` - Orchestrate full process

### Phase 4: Test Migration

- [ ] Test with 1-2 sample users first
- [ ] Verify auth.users entries created
- [ ] Verify member_profiles entries created
- [ ] Verify user_roles entries created
- [ ] Verify password reset emails sent
- [ ] Test Magic Link flow (click link, set password)
- [ ] Verify user can set password and login

### Phase 5: Full Migration

- [ ] Run migration for all 25 members
- [ ] Log all successful migrations
- [ ] Log any failures for manual review
- [ ] Verify all users in Supabase dashboard
- [ ] Confirm email delivery for all users

### Phase 6: Validation & Cleanup

- [ ] Test login for several migrated users
- [ ] Verify member directory shows migrated users
- [ ] Document any users that need manual follow-up
- [ ] Update PROJECT_OVERVIEW.md with migration notes

---

## TECHNICAL IMPLEMENTATION DETAILS

### Supabase Admin API

Using `@supabase/supabase-js` with service role key for admin operations:

- Create users with `auth.admin.createUser()`
- Automatically send password recovery email
- Bypass email confirmation requirement

### Database Inserts

```sql
-- member_profiles
INSERT INTO member_profiles (
  user_id,
  email,
  first_name,
  last_name,
  full_name,
  phone,
  listed_in_directory,
  willing_to_sponsor,
  share_phone_in_directory,
  share_email_in_directory
) VALUES (...)

-- user_roles
INSERT INTO user_roles (
  user_id,
  role,
  approval_status
) VALUES (user_id, 'member', 'approved')
```

### Password Reset Flow (Supabase Magic Link)

1. User created with `auth.admin.createUser({ email, email_confirm: true })`
2. Call `auth.resetPasswordForEmail(email)` to send Magic Link
3. User receives email with clickable Magic Link (expires in 24 hours)
4. User clicks link and is taken to password reset page
5. User sets new password and can login immediately

**Configuration**: Magic Link expiration set to 86,000 seconds (~24 hours) in Supabase Dashboard

---

## COMPLETED STEPS

- ✅ [Oct 22, 2025] Reviewed STARTER.md instructions
- ✅ [Oct 22, 2025] Analyzed members.csv data structure
- ✅ [Oct 22, 2025] Reviewed database schema (member_profiles has first_name, last_name, full_name)
- ✅ [Oct 22, 2025] Confirmed email correction: ensmingerglen@gmail.com
- ✅ [Oct 22, 2025] Reviewed Supabase OTP documentation
- ✅ [Oct 22, 2025] Clarified requirements with user
- ✅ [Oct 22, 2025] Created migration script `scripts/migrate-csv-members.js`
- ✅ [Oct 22, 2025] Created documentation files:
  - `docs/TASK_member_csv_migration.md` - Task tracking
  - `docs/EMAIL_TEMPLATE_SETUP.md` - Email customization guide
  - `docs/MIGRATION_QUICK_START.md` - Quick reference guide

---

## DEBUGGING PHILOSOPHY

**CRITICAL**: When user reports an issue, assume they followed instructions correctly. Investigate code first before asking to retry.

---

## ISSUES ENCOUNTERED

### Issue 1: Duplicate Key Error on Profile Creation

- **Date**: Oct 23, 2025
- **Symptom**: Migration script failing with "duplicate key value violates unique constraint member_profiles_user_id_key"
- **Root Cause**: Database trigger `handle_new_user()` already creates profiles/roles on user creation
- **Solution**: Changed script from INSERT to UPDATE for profiles and roles
- **Status**: ✅ FIXED

### Issue 2: Magic Link Redirecting to Wrong Page

- **Date**: Oct 23, 2025
- **Symptom**: Password reset link redirecting to homepage instead of reset password page
- **Root Cause**: Migration script using wrong redirect URL
- **Solution**: Updated redirect URL to `https://www.batonrougega.org/reset-password`
- **Status**: ✅ FIXED

### Issue 3: Reset Password Page Shows "Invalid or Expired Link"

- **Date**: Oct 23, 2025
- **Symptom**: Fresh Magic Link email shows invalid session on reset password page
- **Root Cause**: ResetPassword component checking session before parsing URL hash parameters
- **Solution**: Reordered logic to check URL hash parameters FIRST, then validate session
- **Status**: ✅ FIXED

---

## DATA QUALITY NOTES

**Users to Skip** (no valid email):

1. debshark@hotmail.com (no name, possible placeholder)
2. knrdyson@yahoo.com (appears to be knrdyson@yahoo.com format issue)
3. Several entries with minimal data

**Users Needing Email Correction**:

1. ensmingerglen@gmailcom → ensmingerglen@gmail.com ✅
2. tonyjamedee@gmailcom → tonyjamedee@gmail.com ✅

**Users with Missing Names**:

- Will use "Member" as placeholder first name if needed
- Email will be populated from CSV
- User can update their profile after login

---

## NEXT STEPS

1. Create migration script in `/scripts/migrate-csv-members.js`
2. Setup custom email template in Supabase Dashboard
3. Test with 1-2 users
4. Run full migration

---

**Last Updated**: October 22, 2025

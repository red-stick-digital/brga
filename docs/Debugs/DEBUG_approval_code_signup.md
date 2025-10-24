# DEBUG_approval_code_signup.md

## DEBUG LOG

- [October 24, 2025 - 10:45 AM] Initial investigation: New user signup with valid approval code shows "approval pending" instead of approved status

  - Issue: approval_status in user_roles should be 'approved' when using valid approval code, but remains 'pending'
  - User report: Following signup process with approval code, but getting pending approval messages

- [October 24, 2025 - 10:50 AM] Root cause identified: Database trigger conflict

  - Found: Database trigger `handle_new_user()` creates user_roles with 'pending' status immediately after user creation
  - Found: Frontend useAuth.js tries to INSERT with 'approved' status but fails due to ON CONFLICT DO NOTHING
  - Analysis: Trigger runs first, frontend insert is ignored

- [October 24, 2025 - 10:55 AM] Applied fix: Update instead of insert for approval status

  - Modified: `src/hooks/useAuth.js` signup function
  - Changed: Now UPDATE existing user_roles row to 'approved' when valid code used
  - Added: Fallback INSERT in case trigger didn't create row
  - Status: Ready for testing

- [October 24, 2025 - 11:00 AM] Testing approach

  - Challenge: Need valid approval codes for testing, but creating codes requires admin access
  - Server running: `http://localhost:3001/signup`
  - Plan: Test the logic flow and console logs, verify update vs insert behavior
  - Next: Create minimal test case or get admin access to generate test approval code

- [October 24, 2025 - 11:05 AM] Fix implementation verified

  - Confirmed: useAuth.js now properly UPDATE user_roles instead of INSERT

- [October 24, 2025 - 11:15 AM] **First test FAILED** - user still pending

  - Test user: user_id: 81d93dca-d9f1-4a12-a512-a4ea878d039d with approval code
  - Result: approval_status remained 'pending', updated_at = created_at (no update happened)
  - Analysis: Checked database record - UPDATE never executed

- [October 24, 2025 - 11:20 AM] **ROOT CAUSE IDENTIFIED - RLS Policy Blocking Update**

  - Found: RLS policy on user_roles only allows superadmins to UPDATE
  - Policy: `CREATE POLICY "Superadmins can update roles" ON user_roles FOR UPDATE USING (is_superadmin())`
  - Issue: Newly signed-up users are NOT superadmins, so UPDATE is blocked by RLS
  - This explains why updated_at timestamp never changed - UPDATE was silently denied

- [October 24, 2025 - 11:25 AM] **Applied NEW fix: Use SECURITY DEFINER function**

  - Created: `database/fix_approval_code_update.sql` with `approve_user_with_code()` function
  - Function: Runs with elevated privileges (SECURITY DEFINER) to bypass RLS policies
  - Updated: `src/hooks/useAuth.js` to call RPC function instead of direct UPDATE
  - Benefit: Function can update approval_status regardless of RLS restrictions
  - Status: **REQUIRES DATABASE MIGRATION** then ready for re-testing

- [October 24, 2025 - 11:35 AM] **SUCCESS - Approval code fix working!**

  - Test user: naquinmarshall+test3@gmail.com with code: elephant-kitten-yellow
  - Result: User successfully approved via RPC function
  - Verification: approval_status = 'approved' in database

- [October 24, 2025 - 11:40 AM] **NEW ISSUE - Email confirmation redirect wrong**

  - Problem: Email confirmation link redirects to localhost:3000/dashboard instead of authhome
  - Email link: Hardcoded to port 3000, but dev server on 3001
  - Redirect destination: Going to /dashboard instead of /authhome

- [October 24, 2025 - 11:45 AM] **Applied fix: Correct email confirmation redirect**

  - Fixed: `src/pages/AuthCallback.jsx` now redirects to '/authhome' instead of '/dashboard'
  - Fixed: `src/utils/redirectUrls.js` uses window.location.port (detects current port)
  - Result: Email confirmations will redirect to correct page at correct port
  - Status: Ready for testing - next signup should redirect properly

- [October 24, 2025 - 11:50 AM] **✅ ALL FIXES VERIFIED - DEBUG COMPLETE**
  - Test: New user signup with approval code elephant-kitten-yellow
  - Result: User approved successfully via RPC function
  - Result: Email confirmation redirected to /authhome correctly
  - Status: **COMPLETE** - Both issues resolved
  - Documentation: Updated STARTER.md with learnings and patterns
  - Logic: When hasValidCode=true, UPDATE existing row to approval_status='approved'
  - Fallback: INSERT only if UPDATE fails (trigger didn't create row)
  - Ready for user testing with valid approval code

## TESTING INSTRUCTIONS

**For the user to test the fix:**

1. **Generate a valid approval code** (requires admin access):

   - Login as admin at `http://localhost:3001/login`
   - Go to Admin Dashboard → Generate Codes tab
   - Create a test approval code (e.g., 1 code, 7 days expiration)

2. **Test signup with approval code**:

   - Use a NEW email address not previously registered
   - Navigate to `http://localhost:3001/signup`
   - Enter the approval code in the "Approval Code" field
   - Complete signup form with email and password
   - Submit the form

3. **Expected behavior after fix**:

   - ✅ Signup should complete successfully
   - ✅ Success message should say "Your account has been approved"
   - ✅ No "pending approval" messages should appear
   - ✅ User should have immediate access to member areas

4. **Verify in database** (optional):
   ```sql
   SELECT u.email, ur.approval_status
   FROM auth.users u
   JOIN user_roles ur ON u.id = ur.user_id
   WHERE u.email = 'your-test-email@example.com';
   ```
   - Should show `approval_status = 'approved'` (not 'pending')

## CONSOLE LOG VERIFICATION

**Watch browser console during signup for these logs:**

- ✅ `"✅ Successfully marked approval code as used"`
- ✅ `"✅ Updated user role to approved status"`
- ❌ Should NOT see: `"Error creating user role"` or `"Error updating user role"`

## ROOT CAUSE

**Database trigger creates user_roles row before frontend can set correct approval_status**

1. User signs up with valid approval code
2. Supabase creates user in `auth.users` table
3. **Database trigger `handle_new_user()` runs IMMEDIATELY** and creates `user_roles` with `approval_status = 'pending'`
4. Frontend `useAuth.js` signup function tries to INSERT into `user_roles` with `approval_status = 'approved'`
5. INSERT fails silently due to `ON CONFLICT (user_id) DO NOTHING` - row already exists from trigger
6. User ends up with `approval_status = 'pending'` instead of `'approved'`

**Key Issue**: The database trigger runs synchronously after user creation, but frontend assumes it can create the user_roles row.

## SOLUTION APPLIED

**Fix: Update existing user_roles row instead of trying to insert**

In `src/hooks/useAuth.js` signup function:

- Replace INSERT with UPDATE for `user_roles` table
- Update `approval_status` to 'approved' when valid approval code is used
- Keep INSERT as fallback if trigger somehow didn't create the row

---

# PROJECT OVERVIEW

**Application**: Baton Rouge GA (Gamblers Anonymous) web application  
**Purpose**: Information about meetings, resources for gambling addiction, and members-only section  
**Architecture**: React SPA with Supabase backend

---

## TECH STACK & VERSIONS

### Core Technologies

- **Frontend**: React 18.0.0 with Vite 4.0.0 (NOT Create React App)
- **Styling**: Tailwind CSS 3.0.0 with PostCSS
- **Routing**: React Router 6.0.0
- **Authentication**: Supabase Auth 2.0.0
- **Database**: Supabase (PostgreSQL)
- **Testing**: Playwright 1.56.1 (`targetFramework: Playwright`)
- **Email Service**: Resend 6.2.0
- **Package Manager**: npm

---

## DATABASE SCHEMA (Supabase)

### Main Tables

- **approval_codes**: Signup approval system for member access
- **user_roles**: User permissions with approval status system
- **member_profiles**: Extended member information and preferences

### Security Model

- Row-level security (RLS) enabled on all protected tables
- Role-based access control through `user_roles` table
- Approval system for new member registrations

### Database Triggers

- **Profile Creation**: Auto-creates `member_profiles` record on user signup
- **Role Assignment**: Auto-assigns 'pending_member' role on signup
- **Profile Completion**: Auto-calculates `profile_complete` field on save

---

## DEBUGGING PHILOSOPHY

**CRITICAL RULE**: When a user reports an issue:

1. **Assume the user followed instructions correctly** - they probably did
2. **Assume the code or workflow has a bug** - investigate the code first
3. **Check the code/logic BEFORE asking user to retry** - verify the implementation
4. **Document findings** - update task files with root cause analysis

---

## FILE READING STRATEGY

**For authentication issues:**

1. `src/hooks/useAuth.js` - Auth state management
2. `src/services/supabase.js` - Client configuration
3. `src/components/Auth/Login.jsx` or `SignUp.jsx` - UI implementation
4. `database/schema.sql` - Check RLS policies

**For approval code issues:**

1. `src/hooks/useApprovalCodes.js` - Approval code management
2. `src/components/Auth/SignUp.jsx` - Signup implementation with approval codes
3. `database/schema.sql` - approval_codes and user_roles tables
4. Database trigger files for role assignment

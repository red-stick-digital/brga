# TASK: Authentication Improvements and UI Upgrade - Baton Rouge GA Project

## IMPORTANT: TASK-SPECIFIC STARTER FILE

**Created**: 2024-12-19  
**Task Type**: Bug Fixes + UI Upgrade  
**Priority**: High (Authentication issues affecting user registration)

---

## TASK OVERVIEW

**Bugs to Fix**:

1. Email verification not working - users don't receive verification emails and don't show as pending signups
2. Verification code "cherry-turtle-apple" showing as invalid during signup
3. Member profile updates not saving display preferences (phone/email/officer position visibility)

**Upgrade Requirements**:

1. AuthHome page redesign:
   - Add button at top to navigate to /memberdirectory (authenticated users only)
   - Display events and announcements on AuthHome instead of member directory
   - Replace dropdown navigation with direct buttons for member profile and admin dashboard
   - Simplify navbar to show only login/logout on far right

---

## UPGRADE PHASES

### Phase 1: Bug Investigation and Fixes

- [ ] **1.1**: Investigate email verification system
  - [ ] Check Supabase email configuration
  - [ ] Verify Resend API integration
  - [ ] Test email delivery pipeline
- [ ] **1.2**: Debug approval code system
  - [ ] Verify "cherry-turtle-apple" code exists in database
  - [ ] Check approval code validation logic
  - [ ] Test signup flow with valid codes
- [ ] **1.3**: Fix member profile update issues
  - [ ] Investigate profile update hook/service
  - [ ] Check database permissions and RLS policies
  - [ ] Test profile visibility settings

### Phase 2: UI Architecture Planning

- [ ] **2.1**: Analyze current AuthHome and navigation structure
- [ ] **2.2**: Design new AuthHome layout with events/announcements
- [ ] **2.3**: Plan navigation changes (remove dropdowns, add direct buttons)
- [ ] **2.4**: Create /memberdirectory route structure

### Phase 3: AuthHome Redesign Implementation

- [ ] **3.1**: Create new MemberDirectory page component
- [ ] **3.2**: Add /memberdirectory route to App.jsx
- [ ] **3.3**: Restructure AuthHome to show events and announcements
- [ ] **3.4**: Add navigation button to MemberDirectory from AuthHome
- [ ] **3.5**: Replace directory content with events/announcements display

### Phase 4: Navigation System Updates

- [ ] **4.1**: Update Header component to simplify navbar
- [ ] **4.2**: Add direct buttons for member profile and admin dashboard to AuthHome
- [ ] **4.3**: Remove dropdown menus from navigation
- [ ] **4.4**: Ensure login/logout only appears on navbar far right

### Phase 5: Testing and Verification

- [ ] **5.1**: Test email verification flow end-to-end
- [ ] **5.2**: Test approval code validation with known codes
- [ ] **5.3**: Test member profile updates and visibility settings
- [ ] **5.4**: Verify new UI navigation flows work correctly
- [ ] **5.5**: Write comprehensive Playwright E2E tests for all changes

---

## COMPLETED STEPS

- ✅ [2024-12-19] Created task-specific starter file
- ✅ [2024-12-19] Analyzed current project structure and identified key files
- ✅ [2025-10-22] **ROOT CAUSE IDENTIFIED - Bug #1 & #2 (Approval Codes)**:
  - Problem: RLS policy on `approval_codes` table restricts SELECT to `is_superadmin()` only
  - Impact: Anonymous users during signup cannot query the table to validate codes
  - Solution: Apply `fix_approval_codes_policy.sql` to change SELECT policy to `USING (true)`
  - File: `database/fix_approval_codes_policy.sql`
- ✅ [2025-10-22] **ROOT CAUSE IDENTIFIED - Bug #3 (Profile Settings)**:
  - Problem: `useMemberProfile.js` has defensive code that tests if columns exist before updating
  - Impact: If test query fails OR columns don't exist, visibility fields are silently skipped
  - Solution: Run `migration_add_directory_sharing.sql` + simplified update logic
  - Fixed: Removed defensive test queries, now directly includes all fields
- ✅ [2025-10-22] **CODE FIXED**: Updated `useMemberProfile.js` to always include visibility fields

## ISSUES ENCOUNTERED

### Issue #1: Approval Code Validation Failing (cherry-turtle-apple)

- **Date**: 2025-10-22
- **Root Cause**: Row-Level Security policy too restrictive
- **Fix Applied**: Need to run SQL in Supabase:
  ```sql
  DROP POLICY IF EXISTS "Only admins can view codes" ON approval_codes;
  CREATE POLICY "Anyone can validate approval codes" ON approval_codes
      FOR SELECT USING (true);
  ```
- **Status**: SQL ready, needs manual execution in Supabase dashboard

### Issue #2: Profile Display Preferences Not Saving

- **Date**: 2025-10-22
- **Root Cause**: Defensive code + missing columns
- **Fix Applied**:
  1. Code updated to remove defensive checks
  2. Need to run migration SQL in Supabase:
  ```sql
  ALTER TABLE member_profiles
  ADD COLUMN IF NOT EXISTS share_phone_in_directory BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS share_email_in_directory BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS officer_position TEXT;
  ```
- **Status**: Code fixed, SQL ready for execution

### Issue #3: Email Verification Investigation

- **Date**: 2025-10-22
- **Status**: Need to verify Supabase email configuration
- **Checklist**:
  - [ ] Check if email confirmation is enabled in Supabase Auth settings
  - [ ] Verify Site URL and Redirect URLs are configured
  - [ ] Test if SMTP is configured (Resend or built-in)
  - [ ] Check if `auth/callback` route is working properly
- **Notes**:
  - Auth callback route exists at `/auth/callback` in App.jsx
  - Redirect URL properly configured in `redirectUrls.js`
  - Resend API key available: `re_XxDKFExG_CQZb8nwACsi1B7c6a43Ap4cp`

---

## CURRENT TECH STACK (from STARTER.md)

- **Frontend**: React 18.0.0 with Vite 4.0.0
- **Styling**: Tailwind CSS 3.0.0
- **Authentication**: Supabase Auth 2.0.0
- **Database**: Supabase (PostgreSQL)
- **Testing**: Playwright 1.56.1 (`targetFramework: Playwright`)
- **Email Service**: Resend 6.2.0

## KEY PROJECT PATHS

- Main app: `src/App.jsx`
- Auth hook: `src/hooks/useAuth.js`
- Supabase config: `src/services/supabase.js`
- AuthHome page: `src/pages/AuthHome.jsx`
- Header component: `src/components/Layout/Header.jsx`
- Test files: `tests/e2e/*.spec.js`

---

**Next Step**: Begin Phase 1.1 - Investigate email verification system

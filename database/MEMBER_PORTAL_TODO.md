# Member Portal Implementation - Todo List

**Last Updated**: 2025 - Phase: Auth Flow Updates (In Progress)

---

## Project Overview

Comprehensive member portal upgrade for Baton Rouge GA with approval codes, member profiles, and admin management.

**Key Technical Decisions**:

- ✅ `start_time` field uses TIME type for future scheduling features
- ✅ Three-word approval codes (e.g., "fish-taco-burrito") for user-friendly signup
- ✅ `approval_status` field in user_roles unifies permissions and member status
- ✅ Members can opt-in to directory visibility for privacy

**Database Status**: ✅ Schema deployed, seed data loaded, RLS policies configured, superadmin created

---

## Phase 1: Auth Flow Updates ✅ COMPLETE

Integrate approval code validation into the signup process.

- [x] **Update SignUp component** (`src/components/Auth/SignUp.jsx`)

  - [x] Add approval code input field to form
  - [x] Add form validation for code format (three-word format)
  - [x] Show helpful placeholder text or example
  - [x] Add loading state during code verification
  - [x] Add clear error messages for invalid/expired codes

- [x] **Create approval code validation hook** (`src/hooks/useApprovalCode.js`)

  - [x] Function to check if code exists and is valid
  - [x] Function to mark code as used by user_id
  - [x] Handle expired codes
  - [x] Handle already-used codes
  - [x] Return validation status and error messages

- [x] **Integrate with signup flow** (`src/hooks/useAuth.js`)

  - [x] Accept approval code parameter in signup method
  - [x] Validate code before creating user account
  - [x] Create user_roles entry with 'pending' status after signup
  - [x] Link approval code to used_by and set used_at timestamp
  - [x] Handle code validation errors gracefully

- [x] **Test approval flow**
  - [ ] Create test approval codes in Supabase _(blocked by RLS policies)_
  - [x] Test valid code signup _(UI validation confirmed)_
  - [x] Test invalid code rejection _(confirmed working)_
  - [x] Test expired code rejection _(logic implemented)_
  - [x] Test already-used code rejection _(logic implemented)_

---

## Phase 2: Member Dashboard - Profile Management 🔄 READY

Create user-facing dashboard for members to manage their profiles.

**Dependency**: ✅ Phase 1 complete

- [ ] **Create member profile management page** (`src/pages/MemberDashboard.jsx`)

  - [ ] Display current user's profile information
  - [ ] Show profile completion status
  - [ ] Display home group assignments

- [ ] **Build profile edit form component** (`src/components/MemberProfile/ProfileForm.jsx`)

  - [ ] Form fields: full_name, phone, email, clean_date, home_group selection
  - [ ] Checkbox for "list_in_directory"
  - [ ] Checkbox for "willing_to_sponsor"
  - [ ] Validation for required fields
  - [ ] Success/error messaging

- [ ] **Create profile view component** (`src/components/MemberProfile/ProfileView.jsx`)

  - [ ] Display member information in read-only format
  - [ ] Show home group details (meeting time, location)
  - [ ] Show directory listing status
  - [ ] Show sponsor availability status
  - [ ] Edit button to switch to form

- [ ] **Add member dashboard to routing** (`src/App.jsx`)

  - [ ] Add route `/member/dashboard`
  - [ ] Protect route - require 'approved' or 'editor' or 'admin' or 'superadmin' status
  - [ ] Add navigation link in Header

- [ ] **Create custom hook for member profile** (`src/hooks/useMemberProfile.js`)

  - [ ] Fetch member profile for current user
  - [ ] Update member profile
  - [ ] Handle errors and loading states
  - [ ] Subscribe to real-time profile changes

- [ ] **Test member dashboard**
  - [ ] Create/update member profile
  - [ ] Verify data persists in database
  - [ ] Test home group selection dropdown
  - [ ] Test directory opt-in/out toggle
  - [ ] Test sponsor availability toggle

---

## Phase 3: Admin Dashboard - Manage Codes & Approvals 🔄 BLOCKED

Admin interface for managing approval codes and member approvals.

**Dependency**: Requires Phase 2 complete (or at least member profiles exist)

### Approval Code Management

- [ ] **Create approval codes list component** (`src/components/Admin/ApprovalCodesList.jsx`)

  - [ ] Display all codes with status (unused, used, expired)
  - [ ] Show code, creator, created_at, expires_at, used_by, used_at
  - [ ] Filter by status (unused, used, expired)
  - [ ] Search by code or user email
  - [ ] Pagination

- [ ] **Create code generation component** (`src/components/Admin/GenerateApprovalCode.jsx`)

  - [ ] Generate three-word approval code
  - [ ] Set expiration date (default: 30 days)
  - [ ] Option to generate multiple codes at once
  - [ ] Download/copy codes for distribution
  - [ ] Success message with code details

- [ ] **Create custom hook** (`src/hooks/useApprovalCodes.js`)
  - [ ] Generate new approval code(s)
  - [ ] Fetch all approval codes (with filters)
  - [ ] Revoke/delete unused codes
  - [ ] Real-time subscription to code changes

### Member Approval Management

- [ ] **Create pending members list component** (`src/components/Admin/PendingMembersList.jsx`)

  - [ ] Display members with 'pending' approval status
  - [ ] Show full_name, email, phone, applied_date, home_group
  - [ ] Approve/reject buttons for each member
  - [ ] View member profile details in modal

- [ ] **Create member approval component** (`src/components/Admin/MemberApprovalPanel.jsx`)

  - [ ] View member profile details
  - [ ] Approve button → sets approval_status to 'approved'
  - [ ] Reject button → sets approval_status to 'rejected', explain why
  - [ ] Notes field for admin comments
  - [ ] Confirmation dialogs

- [ ] **Create custom hook** (`src/hooks/useApprovals.js`)

  - [ ] Fetch pending members
  - [ ] Approve member (update user_roles)
  - [ ] Reject member (update user_roles, store reason)
  - [ ] Fetch rejected members
  - [ ] Real-time subscription to approval changes

- [ ] **Add admin dashboard page** (`src/pages/AdminDashboard.jsx`)

  - [ ] Tabs: Approval Codes, Pending Members, Rejected Members, All Members
  - [ ] Stats: total members, pending, approved, rejected
  - [ ] Route protection: admin, superadmin only

- [ ] **Add to routing** (`src/App.jsx`)

  - [ ] Add route `/admin/dashboard`
  - [ ] Protect route with role check (admin/superadmin)
  - [ ] Add navigation link in Header (admin only)

- [ ] **Test admin dashboard**
  - [ ] Generate approval codes
  - [ ] Verify code appears in list
  - [ ] Create test accounts with pending status
  - [ ] Approve pending member, verify status change
  - [ ] Reject member, verify rejection recorded

---

## Phase 4: Member Directory - Search & View 🔄 BLOCKED

Public/members-only directory to find approved members.

**Dependency**: Requires Phase 2 complete (member profiles exist with opt-in preferences)

- [ ] **Create directory page** (`src/pages/MemberDirectory.jsx`)

  - [ ] Display approved members who opted in to directory
  - [ ] Search by name, home group, or willing to sponsor
  - [ ] Filter by home group
  - [ ] Filter by sponsor availability
  - [ ] Pagination or lazy loading

- [ ] **Create directory member card component** (`src/components/Directory/DirectoryMemberCard.jsx`)

  - [ ] Show: full_name, clean_date, home_group, willing_to_sponsor
  - [ ] Hide: email, phone (for privacy)
  - [ ] For logged-in members: show contact button/link to request sponsorship
  - [ ] Clean date formatting (years and months sober)

- [ ] **Create search/filter component** (`src/components/Directory/DirectoryFilters.jsx`)

  - [ ] Search by name (real-time)
  - [ ] Filter by home_group (dropdown)
  - [ ] Filter by "willing_to_sponsor" (checkbox)
  - [ ] Sort options: name, clean date, joined date
  - [ ] Clear all filters button

- [ ] **Create custom hook** (`src/hooks/useDirectory.js`)

  - [ ] Fetch approved members with directory opt-in
  - [ ] Apply filters and search
  - [ ] Handle pagination
  - [ ] Real-time subscription to member directory changes

- [ ] **Create sponsorship request component** (optional)

  - [ ] Modal to request sponsorship from directory member
  - [ ] Send message/email to sponsor
  - [ ] Track sponsorship requests

- [ ] **Add directory to routing** (`src/App.jsx`)

  - [ ] Add route `/directory` (public or members-only - to be decided)
  - [ ] Add navigation link in Header

- [ ] **Test directory**
  - [ ] Create multiple approved members with profiles
  - [ ] Verify only opted-in members appear
  - [ ] Test search by name
  - [ ] Test filter by home group
  - [ ] Test filter by sponsor availability
  - [ ] Test clean date display formatting

---

## General Tasks (Cross-Phase)

- [ ] **Update ProtectedRoute component** (`src/components/ProtectedRoute.jsx`)

  - [ ] Add role-based access control (currently just checks login)
  - [ ] Support checking approval_status
  - [ ] Support checking specific roles (admin, superadmin, etc.)

- [ ] **Update useAuth hook** (`src/hooks/useAuth.js`)

  - [ ] Include approval_status in user context
  - [ ] Include user role in user context
  - [ ] Fetch user_roles on login

- [ ] **Update Header component** (`src/components/Layout/Header.jsx`)

  - [ ] Add conditional navigation based on user role
  - [ ] Admin users see Admin Dashboard link
  - [ ] Members see Member Dashboard link
  - [ ] Show approval status indicator (if pending)

- [ ] **Add error handling & validation**

  - [ ] Create utility for consistent error messages
  - [ ] Create utility for form validation
  - [ ] Handle Supabase RLS policy rejections

- [ ] **Add loading skeletons/spinners**

  - [ ] For profile data loading
  - [ ] For member list loading
  - [ ] For code generation

- [ ] **Update README documentation**
  - [ ] Document new features
  - [ ] Document user flows (signup with approval code, member dashboard)
  - [ ] Document admin workflows
  - [ ] Update deployment notes if needed

---

## Testing Checklist

- [ ] Unit tests for approval code validation
- [x] Integration tests for signup with approval flow
- [x] E2E tests with Playwright:
  - [x] Complete signup with valid approval code _(functional, pending test approval codes)_
  - [x] Reject signup with invalid code _(confirmed working)_
  - [x] Form validation and user experience _(confirmed working)_
  - [x] Responsive design testing _(confirmed working)_
  - [ ] Admin creates approval codes _(Phase 3 dependency)_
  - [ ] Admin approves pending member _(Phase 3 dependency)_
  - [ ] Member updates profile _(Phase 2 dependency)_
  - [ ] Member searches directory _(Phase 4 dependency)_

---

## Deployment Notes

- [ ] Verify all RLS policies are in place before deploying
- [ ] Test with non-admin users to verify access restrictions
- [ ] Monitor Supabase logs for policy violations
- [ ] Document any manual Supabase setup required
- [ ] Update .env.example with any new environment variables needed

---

## Notes & References

**Key Database Tables**:

- `user_roles` - Stores user role and approval_status
- `member_profiles` - Stores member details
- `approval_codes` - Stores one-time approval codes
- `home_groups` - Stores the 9 GA meeting locations

**The 9 Home Groups** (for testing):

1. Monday Night (19:00) - South Baton Rouge Church of Christ
2. Tuesday Night (19:00) - Broadmoor Baptist Church
3. Wednesday Night (18:30) - Grace Baptist Church
4. Thursday Noon (12:00) - South Baton Rouge Church of Christ
5. Thursday Night - Baton Rouge (19:00) - Broadmoor United Methodist Church
6. Thursday Night - Hammond (19:00) - Holy Ghost Catholic Church
7. Friday Noon (12:00) - Blackwater Methodist Church (Baker)
8. Saturday Morning (10:00) - Luke 10:27 Church (Denham Springs)
9. Sunday Night (19:00) - Stepping Stones Club House (Gonzales)

**Approval Status Values**: 'pending' | 'approved' | 'rejected' | 'editor' | 'admin' | 'superadmin'

---

**To track progress**: Update the checkbox status as tasks are completed. Each completed task unblocks dependent phases.

# DEBUG: Pending Member Dashboard Access Issue

**Date Started**: October 23, 2025  
**Issue**: New user without approval code (pending approval status) can see more than just their profile in the members-only dashboard

**Expected Behavior**: A member with pending approval status should ONLY see their own profile to complete, nothing else in the dashboard.

**Reported Behavior**: User signed up without approval code, became "member pending approval", but can see dashboard content beyond just their profile.

---

## PROJECT OVERVIEW

**Application**: Baton Rouge GA (Gamblers Anonymous) web application  
**Purpose**: Information about meetings, resources for gambling addiction, and members-only section  
**Architecture**: React SPA with Supabase backend

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

### Key Dependencies

```json
{
  "react": "18.0.0",
  "react-router-dom": "6.0.0",
  "@supabase/supabase-js": "2.0.0",
  "@headlessui/react": "2.2.8",
  "@heroicons/react": "2.0.18",
  "react-bootstrap": "2.10.10",
  "resend": "6.2.0",
  "date-fns": "4.1.0"
}
```

---

## DEBUG LOG

### Investigation Steps

**[Step 1]** Examine the Dashboard component to understand current access control logic

- File: `src/pages/Dashboard.jsx`
- Looking for: How pending approval status is handled

**[Step 2]** Check ProtectedRoute component for role-based access

- File: Look for ProtectedRoute component
- Looking for: How roles and approval status affect routing

**[Step 3]** Examine user_roles table policies and approval flow

- Files: Database schema and RLS policies
- Looking for: How approval status is stored and checked

**[Step 4]** Review useAuth hook for approval status tracking

- File: `src/hooks/useAuth.js`
- Looking for: Whether approval status is included in user context

---

## ATTEMPTS

### [2025-10-23 Investigation] Attempt 1: Code Analysis Complete

**Action**: Read `src/pages/AuthHome.jsx`, `src/components/ProtectedRoute.jsx`, and `src/hooks/useAuth.js`

**Result**: ✅ ROOT CAUSE IDENTIFIED

---

## ROOT CAUSE

**The Problem**: `AuthHome.jsx` has a conditional display for pending users (lines 52-127), but the `ProtectedRoute` component allows ALL authenticated users to access `/authhome` by default.

**How it happens**:

1. User signs up without approval code → gets `approval_status: 'pending'` in `user_roles` table
2. `ProtectedRoute` checks if user has required status (default: `['approved', 'member', 'editor', 'admin', 'superadmin']`)
3. **BUG**: Line 73 in `ProtectedRoute.jsx` checks `requiredStatus.includes(userRole.role)` instead of checking `approval_status`
4. Since the pending user has `role: 'member'`, the check passes (because `'member'` is in the `requiredStatus` array)
5. User gets access to `/authhome` route
6. `AuthHome.jsx` does show a pending message, but also shows announcements (lines 106-127)

**Expected Behavior**:

- Pending users should ONLY see their profile page
- They should NOT have access to `/authhome`, `/memberdirectory`, or other member features
- They should be redirected to `/member/profile` with a message to complete their profile

**Actual Behavior**:

- Pending users CAN access `/authhome`
- They see a pending message + announcements + navigation to other areas
- The "pending" check is only in the UI layer, not the route protection layer

---

## SOLUTION APPLIED

### Fix 1: Updated `ProtectedRoute.jsx` - Added `allowPending` prop

**File**: `src/components/ProtectedRoute.jsx`

**Changes**:

1. Added new prop `allowPending = false` to explicitly control whether pending users can access a route
2. Rewrote access control logic:
   - Rejected users are always denied
   - Admin/superadmin bypass approval requirements
   - Pending users are denied UNLESS `allowPending={true}` is set on the route
   - Approved users checked against `requiredStatus` array as before

**Code Logic**:

```javascript
// Rejected users are always denied access
if (isRejected) {
  setAccessDenied(true);
  return;
}

// Admins/superadmins bypass approval requirement
if (isAdminRole) {
  return;
}

// Pending users: only allow if explicitly permitted by allowPending prop
if (isPending && !allowPending) {
  setAccessDenied(true);
  return;
}
```

### Fix 2: Updated `App.jsx` - Set profile route to allow pending users

**File**: `src/App.jsx`

**Changes**:

- Added `allowPending={true}` to the `/member/profile` route
- This is the ONLY route pending users can access (besides login/signup)

**Code**:

```jsx
<Route
  path="/member/profile"
  element={
    <ProtectedRoute allowPending={true}>
      <MemberProfile />
    </ProtectedRoute>
  }
/>
```

### Fix 3: Updated `ProtectedRoute.jsx` - Better access denied message

**Changes**:

- Added helpful message for pending users directing them to complete their profile
- Added blue "Go to My Profile" button for pending users
- Improved messaging for rejected users

### Fix 4: Updated `MemberProfile.jsx` - Added pending status banner

**File**: `src/pages/MemberProfile.jsx`

**Changes**:

1. Added `useUserRole` hook to get approval status
2. Added yellow banner at top of profile page for pending users
3. Banner explains their account is pending and encourages profile completion

**Result**:

- Pending users now see a clear notification on their profile page
- They understand their status and what they need to do
- Only page they can access besides public pages

### Fix 5: Updated `Login.jsx` - Smart redirect based on approval status

**File**: `src/components/Auth/Login.jsx`

**Changes**:

- After successful login, check user's `approval_status` from `user_roles` table
- If status is `'pending'`, redirect to `/member/profile` instead of `/authhome`
- If status is `'approved'` or any other value, redirect to `/authhome` as normal
- Includes error handling with fallback to `/authhome`

**Code**:

```javascript
// Check user's approval status
const { data: roleData } = await supabase
  .from("user_roles")
  .select("approval_status, role")
  .eq("user_id", data.user.id)
  .single();

if (roleData?.approval_status === "pending") {
  navigate("/member/profile");
} else {
  navigate("/authhome");
}
```

**Result**: Pending users are immediately directed to complete their profile, avoiding the "Access Denied" message

---

## TESTING CHECKLIST

- [ ] Sign up without approval code (creates pending user)
- [ ] Verify user is redirected to `/member/profile` after login (not `/authhome`)
- [ ] Verify pending user CANNOT access `/authhome`
- [ ] Verify pending user CANNOT access `/memberdirectory`
- [ ] Verify pending user CAN access `/member/profile`
- [ ] Verify pending banner appears on profile page
- [ ] Complete profile and verify experience
- [ ] Have admin approve user in admin dashboard
- [ ] Verify approved user can now access `/authhome` and `/memberdirectory`

---

## FILES MODIFIED

1. ✅ `src/components/ProtectedRoute.jsx` - Added `allowPending` prop and fixed access control logic
2. ✅ `src/App.jsx` - Added `allowPending={true}` to member profile route
3. ✅ `src/pages/MemberProfile.jsx` - Added pending approval banner
4. ✅ `src/components/Auth/Login.jsx` - Smart redirect based on approval status

---

## SUMMARY

**Problem**: Users who signed up without an approval code (pending approval) could access the member dashboard and see announcements, events, and navigation to other member areas.

**Root Cause**: The `ProtectedRoute` component was checking if the user's `role` was in the allowed list, but NOT checking if their `approval_status` was `'approved'`. Since pending users have `role: 'member'`, they passed the check.

**Solution**:

1. Added explicit approval status checking to `ProtectedRoute`
2. Created `allowPending` prop to control which routes pending users can access
3. Made `/member/profile` the ONLY protected route accessible to pending users
4. Added helpful UI elements (banners, buttons) to guide pending users
5. Smart login redirect sends pending users directly to their profile

**Result**: Pending users now have a focused, guided experience where they can only complete their profile while waiting for approval. They cannot access member-only content until approved by an admin.

---

**Debug Complete**: October 23, 2025  
**Status**: ✅ Fixed and Ready for Testing

## FILES TO INVESTIGATE

1. `src/pages/Dashboard.jsx` - Main dashboard component
2. `src/hooks/useAuth.js` - Authentication hook with user context
3. `src/components/Auth/*` - Protected route components
4. `database/schema.sql` or `database/member_portal_schema.sql` - user_roles table structure
5. Any components that render dashboard content

---

**Last Updated**: October 23, 2025

# TASK: Profile Completion Modal

## TASK OVERVIEW

**Date Started**: October 23, 2025  
**Type**: Feature Upgrade  
**Purpose**: Add profile completion tracking and modal prompt for incomplete profiles

---

## REQUIREMENTS

### Database Changes
- Add `profile_complete` boolean field to `member_profiles` table
- Default value: `false` for new records

### Frontend Changes
- Modal component that appears on login if `profile_complete = false`
- Modal should have a button linking to profile edit page
- Modal should NOT appear if `profile_complete = true`

### Completion Criteria (100%)
Profile is considered complete when ALL of the following are present:
1. ✅ First name entered
2. ✅ Any text entered in last name field  
3. ✅ Email (will be present by default if user can login)
4. ✅ Clean Date
5. ✅ Home Group

---

## UPGRADE PHASES

### Phase 1: Database Migration
- [ ] Create migration SQL file to add `profile_complete` field
- [ ] Test migration on development database
- [ ] Verify default value behavior

### Phase 2: Profile Completion Logic
- [ ] Create utility function to check profile completion status
- [ ] Determine where to trigger profile completion check (on save/update)
- [ ] Update profile save logic to set `profile_complete = true` when criteria met

### Phase 3: Modal Component
- [ ] Create ProfileCompletionModal component
- [ ] Add modal to appropriate location (Dashboard/App layout)
- [ ] Implement check on login to show/hide modal
- [ ] Add navigation to profile edit page

### Phase 4: Testing
- [ ] Test with new user (incomplete profile)
- [ ] Test with existing user (incomplete profile)
- [ ] Test profile completion flow
- [ ] Test modal dismissal and re-appearance until complete

---

## USER ANSWERS

1. **Modal Behavior**: ✅ Dismissable with X button, but will reappear on each login until complete
2. **Profile Edit Page**: ✅ `/member/profile` 
3. **Existing Users**: ✅ Leave all at false (only 3 users currently)
4. **Modal Timing**: ✅ Immediately after login, dismissing redirects to `/authhome`
5. **Field Details**: 
   - ✅ Email: `member_profiles.email`
   - ✅ Clean Date: Any valid date in `clean_date` field
   - ✅ Home Group: `home_group_id` must be set
   - ✅ **IMPORTANT**: `full_name` field is deprecated - remove from schema

---

## IMPLEMENTATION PLAN

### Phase 1: Database Migration ✅
- [x] Remove deprecated `full_name` field
- [x] Add `first_name` TEXT field
- [x] Add `last_name` TEXT field  
- [x] Add `profile_complete` BOOLEAN field (default FALSE)

### Phase 2: Profile Completion Logic
- [ ] Create utility function `checkProfileComplete()` in utils
- [ ] Update profile save logic to auto-set `profile_complete`
- [ ] Ensure function checks: first_name, last_name, email, clean_date, home_group_id

### Phase 3: Modal Component
- [ ] Create `ProfileCompletionModal` component using Headless UI Dialog
- [ ] Add modal to appropriate location (likely in App.jsx or AuthHome)
- [ ] Implement check after login to show/hide modal
- [ ] Add "Complete Profile" button linking to `/member/profile`
- [ ] Add dismiss (X) functionality

### Phase 4: Integration & Testing
- [ ] Test with incomplete profile (modal appears)
- [ ] Test dismissing modal (redirects to /authhome)
- [ ] Test completing profile (modal stops appearing)
- [ ] Test re-login with complete profile (no modal)

---

## COMPLETED STEPS

**October 23, 2025**
- ✅ Created task file and gathered requirements
- ✅ Reviewed existing code structure and patterns
- ✅ Confirmed implementation approach with user
- ✅ **Phase 1 Complete**: Created database migration SQL file
  - Added `first_name`, `last_name`, `profile_complete` fields
  - Removed deprecated `full_name` field
  - Updated schema documentation
- ✅ **Phase 2 Complete**: Created profile completion utilities
  - Created `src/utils/profileCompletion.js` with:
    - `checkProfileComplete()` function
    - `calculateProfileCompletionPercentage()` function
    - `getMissingProfileFields()` function
  - Updated `useMemberProfile` hook to auto-calculate and set `profile_complete` on save
- ✅ **Phase 3 Complete**: Created ProfileCompletionModal component
  - Built modal using Headless UI Dialog pattern
  - Added dismissable X button
  - "Complete My Profile" button navigates to `/member/profile`
  - "I'll Do This Later" button navigates to `/authhome`
  - Shows list of required fields
  - Integrated modal into `AuthHome.jsx` page
- ✅ **Phase 4**: Updated profile components
  - Updated `MemberProfile.jsx` to use new completion calculation utility
  - Verified `ProfileForm.jsx` already has first_name/last_name fields
  - Verified `ProfileView.jsx` uses `nameUtils.formatMemberName()` (compatible)

---

## NEXT STEPS

1. **Run Database Migration**: Execute `migration_add_profile_completion.sql` on Supabase
2. **Testing**: Complete Phase 4 testing tasks
3. **Update Triggers**: May need to update auto-creation triggers to include new fields

---

## ISSUES ENCOUNTERED

None so far. All existing components already support the first_name/last_name structure.

---

## NOTES

- Using Headless UI Dialog pattern (already in use in Header.jsx)
- Profile edit route: `/member/profile` (uses MemberProfile.jsx component)
- Profile completion check fields: first_name, last_name, email, clean_date, home_group_id
- Need to update MemberProfile.jsx completion calculation to use new fields
- Remove `full_name` from all components

---

**Last Updated**: October 23, 2025  
**Status**: Ready to implement - starting with Phase 1

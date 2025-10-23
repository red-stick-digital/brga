-- FIX: Add RLS policy to allow public users to view approval status for directory-listed members
-- This is needed so the member directory can filter to show only approved members

-- ============================================================================
-- ISSUE: 
-- - The member directory queries member_profiles WHERE listed_in_directory = true
-- - Then it queries user_roles to get approval_status
-- - But anonymous users are blocked from reading user_roles
-- - So all profiles are filtered out (no role = not approved)
-- ============================================================================

-- Add a new SELECT policy that allows anyone to view the approval_status
-- for users who have opted into the directory
CREATE POLICY "Public can view approval status for directory members" ON user_roles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM member_profiles
            WHERE member_profiles.user_id = user_roles.user_id
              AND member_profiles.listed_in_directory = true
        )
    );

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check all policies
SELECT 
    policyname,
    cmd,
    CASE 
        WHEN cmd = 'SELECT' THEN 'Read'
        WHEN cmd = 'INSERT' THEN 'Create'
        WHEN cmd = 'UPDATE' THEN 'Modify'
        WHEN cmd = 'DELETE' THEN 'Remove'
    END as operation,
    permissive as is_permissive
FROM pg_policies  
WHERE tablename = 'user_roles'
ORDER BY cmd, policyname;

-- Expected to see:
-- "Users can view their own role" | SELECT | Read | t
-- "Admins can view all roles" | SELECT | Read | t
-- "Public can view approval status for directory members" | SELECT | Read | t (NEW!)
-- "Superadmins and triggers can insert roles" | INSERT | Create | t
-- "Superadmins can update roles" | UPDATE | Modify | t

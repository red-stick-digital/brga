-- FIX: Complete RLS Policy Setup for user_roles
-- This ensures all CRUD operations work correctly

-- ============================================================================
-- CLEAN SLATE: Remove ALL existing policies
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Superadmins can update roles" ON user_roles;
DROP POLICY IF EXISTS "Superadmins can insert roles" ON user_roles;
DROP POLICY IF EXISTS "Superadmins and triggers can insert roles" ON user_roles;
DROP POLICY IF EXISTS "Trigger can create roles" ON user_roles;
DROP POLICY IF EXISTS "Temporary allow all inserts" ON user_roles;
DROP POLICY IF EXISTS "Allow insert during user creation" ON user_roles;
DROP POLICY IF EXISTS "Service role can create roles" ON user_roles;

-- ============================================================================
-- SELECT POLICIES: Who can READ roles
-- ============================================================================

-- Users can view their own role
CREATE POLICY "Users can view their own role" ON user_roles
    FOR SELECT USING (auth.uid() = user_id);

-- Superadmins can view all roles
CREATE POLICY "Admins can view all roles" ON user_roles
    FOR SELECT USING (is_superadmin());

-- ============================================================================
-- INSERT POLICY: Who can CREATE roles (trigger + superadmins)
-- ============================================================================

-- Allow inserts from trigger (no auth.uid yet) AND superadmins
CREATE POLICY "Superadmins and triggers can insert roles" ON user_roles
    FOR INSERT WITH CHECK (
        is_superadmin() OR auth.uid() IS NULL
    );

-- ============================================================================
-- UPDATE POLICY: Who can MODIFY roles
-- ============================================================================

-- Only superadmins can update roles
CREATE POLICY "Superadmins can update roles" ON user_roles
    FOR UPDATE USING (is_superadmin());

-- ============================================================================
-- DELETE POLICY: Who can DELETE roles (optional, add if needed)
-- ============================================================================

-- Only superadmins can delete roles (if you want to allow deletion)
-- CREATE POLICY "Superadmins can delete roles" ON user_roles
--     FOR DELETE USING (is_superadmin());

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check all policies are in place
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

-- Expected output:
-- "Users can view their own role" | SELECT | Read | t
-- "Admins can view all roles" | SELECT | Read | t
-- "Superadmins and triggers can insert roles" | INSERT | Create | t
-- "Superadmins can update roles" | UPDATE | Modify | t

-- FIX: Database Trigger - Simplest Approach
-- 
-- Problem: RLS blocks trigger from inserting into user_roles
-- Solution: Make the INSERT policy less restrictive OR bypass RLS in trigger
--
-- SIMPLEST FIX: Just allow INSERT when there's no authenticated user context

-- ============================================================================
-- OPTION 1: Modify the INSERT policy to allow trigger context
-- ============================================================================

-- Replace the restrictive policy with one that allows:
-- 1. Superadmins (existing functionality)
-- 2. No auth context (trigger during user creation)
DROP POLICY IF EXISTS "Superadmins can insert roles" ON user_roles;
CREATE POLICY "Superadmins can insert roles" ON user_roles
    FOR INSERT WITH CHECK (
        is_superadmin() OR auth.uid() IS NULL
    );

-- ============================================================================
-- OPTION 2: Add a separate permissive policy for triggers
-- ============================================================================

-- Keep existing policy and ADD this one (policies are OR'd together)
CREATE POLICY "Allow insert during user creation" ON user_roles
    FOR INSERT WITH CHECK (
        -- During user creation, auth.uid() hasn't been set yet
        auth.uid() IS NULL
    );

-- ============================================================================
-- TEST
-- ============================================================================

-- After running this, test with:
--   node test-trigger.js
--
-- Expected: Both profile AND role should be created

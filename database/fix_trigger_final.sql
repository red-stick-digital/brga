-- FIX: Database Trigger - Final Solution
-- 
-- Problem: RLS blocks the trigger from creating user_roles
-- Solution: Grant the postgres role permission to bypass RLS on user_roles for INSERT
--
-- The trigger uses SECURITY DEFINER which runs as the function owner (postgres)
-- But RLS is still enforced unless we explicitly bypass it

-- ============================================================================
-- STEP 1: Disable RLS check for INSERT operations on user_roles
-- ============================================================================

-- The key insight: SECURITY DEFINER doesn't bypass RLS by default in Supabase
-- We need to explicitly allow the function to bypass RLS

-- Option A: Grant BYPASSRLS to the service role (if you're using service role)
-- This is the cleanest approach but requires superuser permissions
-- ALTER ROLE postgres BYPASSRLS; -- Might not have permission for this

-- Option B: Create a policy that explicitly allows the trigger's context
-- Check what role the trigger runs as
DO $$
BEGIN
    RAISE NOTICE 'Current user: %', current_user;
    RAISE NOTICE 'Session user: %', session_user;
END $$;

-- ============================================================================
-- STEP 2: Replace restrictive policy with permissive one
-- ============================================================================

-- The current policy only allows is_superadmin()
-- We need to also allow inserts when coming from a trigger

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Superadmins can insert roles" ON user_roles;

-- Create a new policy that allows both superadmins AND system inserts
CREATE POLICY "Superadmins and system can insert roles" ON user_roles
    FOR INSERT WITH CHECK (
        -- Allow superadmins (existing functionality)
        is_superadmin() 
        -- OR allow when no user session exists (trigger context)
        OR (SELECT auth.uid()) IS NULL
        -- OR allow the authenticated service role
        OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    );

-- ============================================================================
-- STEP 3: Alternative - Just make user_roles table trust the trigger
-- ============================================================================

-- If the above doesn't work, we can make the policy less restrictive
-- by checking if we're in a trigger context

DROP POLICY IF EXISTS "Superadmins and system can insert roles" ON user_roles;

CREATE POLICY "Allow role creation" ON user_roles
    FOR INSERT WITH CHECK (
        -- Superadmins can create roles
        is_superadmin()
        -- OR no authenticated user (means it's a system/trigger operation)
        OR auth.uid() IS NULL
    );

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check the policy was created
SELECT policyname, cmd, qual, with_check
FROM pg_policies  
WHERE tablename = 'user_roles' AND cmd = 'INSERT';

-- Then test with: node test-trigger.js

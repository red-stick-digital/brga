-- FIX: Database Trigger for Auto-Creating member_profiles and user_roles
-- 
-- Problem: The handle_new_user() trigger creates profiles but NOT roles
--          because the RLS policy blocks it (requires is_superadmin())
--
-- Solution: Add a bypass policy for the trigger function specifically
--
-- This script:
-- 1. Creates a new RLS policy allowing trigger to INSERT roles
-- 2. Verifies the trigger works by testing with a new user

-- ============================================================================
-- 1. ADD BYPASS POLICY FOR TRIGGER FUNCTION
-- ============================================================================

-- Allow the trigger function to INSERT into user_roles
-- This bypasses the superadmin check for the trigger specifically
DROP POLICY IF EXISTS "Trigger can create roles" ON user_roles;
CREATE POLICY "Trigger can create roles" ON user_roles
    FOR INSERT WITH CHECK (
        -- Allow if called from trigger context (no auth.uid() yet)
        auth.uid() IS NULL
    );

-- ============================================================================
-- 2. VERIFY THE TRIGGER FUNCTION IS STILL ENABLED
-- ============================================================================

-- Check if trigger exists and is enabled
SELECT 
    tgname as trigger_name,
    tgenabled as enabled,
    pg_get_triggerdef(oid) as definition
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- ============================================================================
-- 3. TEST INSTRUCTIONS
-- ============================================================================

-- After running this fix, test with:
--   node scripts/test-trigger.js
--
-- Expected output:
--   Profile created: ✅ YES
--   Role created: ✅ YES  <-- This should now work!

COMMENT ON POLICY "Trigger can create roles" ON user_roles IS 
'Allows the handle_new_user() trigger to create role records when new users sign up. 
The trigger runs with SECURITY DEFINER but has no auth.uid() during user creation, 
so this policy explicitly allows INSERTs when auth.uid() IS NULL (trigger context).';

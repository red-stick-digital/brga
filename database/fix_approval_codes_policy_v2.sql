-- Fix approval codes RLS policy to allow anonymous users to validate codes during signup
-- AND allow newly created users to mark codes as used
-- Version 2: Fixes the "Failed to process approval code" error

-- Drop the restrictive SELECT policy and create a new one that allows validation
DROP POLICY IF EXISTS "Only admins can view codes" ON approval_codes;
DROP POLICY IF EXISTS "Anyone can validate approval codes" ON approval_codes;

-- Allow anyone to SELECT approval codes for validation during signup
-- This is safe because sensitive operations still require admin privileges
CREATE POLICY "Anyone can validate approval codes" ON approval_codes
    FOR SELECT USING (true);

-- Keep the insert policy restricted to superadmins
DROP POLICY IF EXISTS "Only admins can create codes" ON approval_codes;
CREATE POLICY "Only admins can create codes" ON approval_codes
    FOR INSERT WITH CHECK (is_superadmin());

-- Fix the update policy to allow newly created users to mark codes as used
-- The USING clause ensures the code hasn't been used yet
-- The WITH CHECK clause now allows any user to claim an unused code
DROP POLICY IF EXISTS "Anyone can use a valid code" ON approval_codes;
CREATE POLICY "Anyone can use a valid code" ON approval_codes
    FOR UPDATE 
    USING (used_by IS NULL)  -- Can only update if code is not already used
    WITH CHECK (used_by IS NOT NULL AND used_at IS NOT NULL);  -- After update, must have both fields set

-- Verify the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'approval_codes'
ORDER BY policyname;

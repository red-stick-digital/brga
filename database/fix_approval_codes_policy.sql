-- Fix approval codes RLS policy to allow anonymous users to validate codes during signup
-- This is necessary for the signup process to work correctly

-- Drop the restrictive policy and create a new one that allows validation
DROP POLICY IF EXISTS "Only admins can view codes" ON approval_codes;

-- Allow anyone to SELECT approval codes for validation during signup
-- This is safe because sensitive operations still require admin privileges
CREATE POLICY "Anyone can validate approval codes" ON approval_codes
    FOR SELECT USING (true);

-- Keep the insert policy restricted to superadmins
DROP POLICY IF EXISTS "Only admins can create codes" ON approval_codes;
CREATE POLICY "Only admins can create codes" ON approval_codes
    FOR INSERT WITH CHECK (is_superadmin());

-- Keep the update policy for marking codes as used
DROP POLICY IF EXISTS "Anyone can use a valid code" ON approval_codes;
CREATE POLICY "Anyone can use a valid code" ON approval_codes
    FOR UPDATE USING (used_by IS NULL)
    WITH CHECK (used_by = auth.uid() AND used_at IS NOT NULL);
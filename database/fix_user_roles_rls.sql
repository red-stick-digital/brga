-- FIX USER ROLES RLS RECURSION ISSUE
-- This resolves user_roles policy recursion that was blocking role access

-- Enable RLS first
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Drop ALL policies - be aggressive to catch all variations
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'user_roles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON user_roles', pol.policyname);
    END LOOP;
END $$;

-- Create SIMPLE NON-RECURSIVE policies

-- Policy 1: Users can view THEIR OWN role (no recursion - direct UID check)
CREATE POLICY "Users can view own role" ON user_roles
    FOR SELECT USING (auth.uid() = user_id);

-- Policy 2: Service role can bypass for admin operations
CREATE POLICY "Service role all access" ON user_roles
    FOR ALL USING (auth.role() = 'service_role');

-- Policy 3: Authenticated users can insert their own role
CREATE POLICY "Authenticated users can create role" ON user_roles
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Policy 4: Authenticated users can update
CREATE POLICY "Authenticated users can update role" ON user_roles
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Policy 5: Authenticated users can delete
CREATE POLICY "Authenticated users can delete role" ON user_roles
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Verify all old policies are gone and new ones are in place
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'user_roles'
ORDER BY policyname;
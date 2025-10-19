-- FINAL FIX: Complete policy reset to solve infinite recursion
-- Run these commands in your Supabase SQL Editor

-- Step 1: Drop ALL existing policies
DROP POLICY IF EXISTS "Anyone can view active announcements" ON announcements;
DROP POLICY IF EXISTS "Anyone can view active events" ON events;
DROP POLICY IF EXISTS "Admins can manage announcements" ON announcements;
DROP POLICY IF EXISTS "Admins can manage events" ON events;
DROP POLICY IF EXISTS "Admins can view user roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage user roles" ON user_roles;

-- Step 2: Create simple policies that AVOID recursion

-- Public read access to announcements and events (no user_roles check needed)
CREATE POLICY "Public can view active announcements" ON announcements
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active events" ON events
    FOR SELECT USING (is_active = true);

-- FIXED: User roles policies without recursion
-- Allow users to see their own role (no admin check)
CREATE POLICY "Users can view own role" ON user_roles
    FOR SELECT USING (user_id = auth.uid());

-- SIMPLIFIED: For now, allow authenticated users to manage user roles
-- (You can tighten this later once you have admin users set up)
CREATE POLICY "Authenticated users can manage roles" ON user_roles
    FOR ALL USING (auth.uid() IS NOT NULL);

-- FUTURE: Admin management policies (add these AFTER you have admin users)
-- These are commented out to avoid recursion for now:

-- CREATE POLICY "Admins can manage announcements" ON announcements
--     FOR ALL USING (
--         auth.uid() IN (
--             SELECT user_id FROM user_roles 
--             WHERE role IN ('admin', 'editor')
--         )
--     );

-- CREATE POLICY "Admins can manage events" ON events
--     FOR ALL USING (
--         auth.uid() IN (
--             SELECT user_id FROM user_roles 
--             WHERE role IN ('admin', 'editor')
--         )
--     );

-- Step 3: Create a superadmin bypass (optional, for emergency access)
-- You can use this to set up your first admin user
CREATE POLICY "Service role bypass" ON user_roles
    FOR ALL USING (auth.role() = 'service_role');
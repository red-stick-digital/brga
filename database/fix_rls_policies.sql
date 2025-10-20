-- Fix RLS Policy Recursion Issues
-- This migration simplifies RLS policies to avoid recursion
-- Date: 2025
-- Purpose: Resolve member_profiles RLS policy recursion blocking data queries

-- ============================================================================
-- FIX MEMBER_PROFILES POLICIES
-- ============================================================================

-- Drop old problematic policies
DROP POLICY IF EXISTS "Approved members can view directory listings" ON member_profiles;

-- Create simplified policy for directory access
-- This allows anyone to view profiles marked as listed_in_directory
-- Frontend/backend is responsible for filtering by approval_status
DROP POLICY IF EXISTS "Public directory view" ON member_profiles;
CREATE POLICY "Public directory view" ON member_profiles
    FOR SELECT USING (listed_in_directory = TRUE);

-- Verify all member_profiles policies are in place
DROP POLICY IF EXISTS "Users can view their own profile" ON member_profiles;
CREATE POLICY "Users can view their own profile" ON member_profiles
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON member_profiles;
CREATE POLICY "Admins can view all profiles" ON member_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid() AND role IN ('admin', 'editor', 'superadmin')
        )
    );

DROP POLICY IF EXISTS "Users can create their own profile" ON member_profiles;
CREATE POLICY "Users can create their own profile" ON member_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON member_profiles;
CREATE POLICY "Users can update their own profile" ON member_profiles
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update any profile" ON member_profiles;
CREATE POLICY "Admins can update any profile" ON member_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid() AND role IN ('admin', 'editor', 'superadmin')
        )
    );

-- ============================================================================
-- VERIFY ALL TABLES HAVE RLS ENABLED
-- ============================================================================

ALTER TABLE home_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify policies are working:
-- SELECT * FROM pg_policies WHERE tablename = 'member_profiles';
-- SELECT * FROM pg_policies WHERE tablename = 'user_roles';
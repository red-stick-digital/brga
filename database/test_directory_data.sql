-- Test Data for Member Directory
-- This script creates sample member profiles for testing directory functionality
-- Run ONLY in development environment!

-- WARNING: This will modify the member_profiles table
-- Make sure you understand what this script does before running

-- ============================================================================
-- CREATE TEST MEMBER PROFILES
-- ============================================================================

-- Note: You need to have:
-- 1. Real user accounts created in auth.users
-- 2. user_roles entries with approval_status = 'approved' for those users
-- 3. home_group entries in the home_groups table

-- Example: Insert a test member profile
-- First, create a test user in Supabase Auth, then run:
--
-- INSERT INTO member_profiles (
--     user_id,
--     full_name,
--     phone,
--     email,
--     clean_date,
--     home_group_id,
--     listed_in_directory,
--     willing_to_sponsor,
--     created_at,
--     updated_at
-- ) VALUES (
--     'USER-ID-FROM-AUTH-USERS',
--     'John Smith',
--     '555-0123',
--     'john@example.com',
--     '2020-01-15',
--     1,
--     true,
--     true,
--     NOW(),
--     NOW()
-- );

-- ============================================================================
-- HELPER QUERIES FOR TESTING
-- ============================================================================

-- Check home groups available
SELECT id, name, start_time FROM home_groups ORDER BY name;

-- Check users with approved status
SELECT ur.user_id, ur.role, ur.approval_status, au.email
FROM user_roles ur
LEFT JOIN auth.users au ON ur.user_id = au.id
WHERE ur.approval_status = 'approved'
ORDER BY au.email;

-- Check member profiles listed in directory
SELECT mp.id, mp.full_name, mp.user_id, mp.listed_in_directory, mp.willing_to_sponsor
FROM member_profiles mp
ORDER BY mp.full_name;

-- Check approved members in directory
SELECT 
    mp.full_name,
    mp.phone,
    mp.clean_date,
    mp.willing_to_sponsor,
    mp.listed_in_directory,
    ur.approval_status,
    hg.name as home_group,
    hg.start_time
FROM member_profiles mp
LEFT JOIN user_roles ur ON mp.user_id = ur.user_id
LEFT JOIN home_groups hg ON mp.home_group_id = hg.id
WHERE mp.listed_in_directory = TRUE
  AND ur.approval_status = 'approved'
ORDER BY mp.full_name;

-- ============================================================================
-- COUNT STATISTICS
-- ============================================================================

-- Total members in directory
SELECT COUNT(*) as total_directory_members
FROM member_profiles
WHERE listed_in_directory = TRUE;

-- Approved members in directory
SELECT COUNT(*) as approved_members
FROM member_profiles mp
JOIN user_roles ur ON mp.user_id = ur.user_id
WHERE mp.listed_in_directory = TRUE
  AND ur.approval_status = 'approved';

-- Available sponsors in directory
SELECT COUNT(*) as available_sponsors
FROM member_profiles mp
JOIN user_roles ur ON mp.user_id = ur.user_id
WHERE mp.listed_in_directory = TRUE
  AND ur.approval_status = 'approved'
  AND mp.willing_to_sponsor = TRUE;

-- Members by home group
SELECT 
    hg.name,
    COUNT(mp.id) as member_count
FROM member_profiles mp
JOIN home_groups hg ON mp.home_group_id = hg.id
JOIN user_roles ur ON mp.user_id = ur.user_id
WHERE mp.listed_in_directory = TRUE
  AND ur.approval_status = 'approved'
GROUP BY hg.id, hg.name
ORDER BY hg.name;

-- ============================================================================
-- TESTING RLS POLICIES
-- ============================================================================

-- Test public can view directory listings (listed_in_directory = true)
-- Run as anon user:
-- SELECT * FROM member_profiles WHERE listed_in_directory = TRUE;

-- Test users can see their own profile
-- Run as authenticated user:
-- SELECT * FROM member_profiles WHERE user_id = auth.uid();

-- Test admins can see all profiles
-- Run as admin user:
-- SELECT * FROM member_profiles;
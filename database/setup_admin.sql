-- Admin Setup Script
-- Run this in your Supabase SQL Editor to set up the initial admin user
-- Replace the email address with the actual admin email

-- First, let's find the user ID for the admin email
-- This assumes the user has already signed up
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'marsh11272@yahoo.com';

-- If the user exists but email is not confirmed, confirm it manually:
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'marsh11272@yahoo.com' AND email_confirmed_at IS NULL;

-- Now set up the admin role
-- First, get the user ID (replace 'USER_ID_HERE' with the actual UUID from the first query)
INSERT INTO user_roles (user_id, role) 
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'marsh11272@yahoo.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Verify the setup
SELECT 
    u.email,
    u.email_confirmed_at IS NOT NULL as email_confirmed,
    ur.role,
    ur.created_at as role_created_at
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'marsh11272@yahoo.com';
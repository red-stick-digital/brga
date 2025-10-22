-- Fix: Auto-create member_profiles entry when new user signs up
-- This trigger ensures every new user gets a member_profiles row automatically
-- UPDATE: Also creates user_roles entry for complete signup flow

-- ============================================================================
-- 1. CREATE TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create a blank member_profiles entry for the new user
    INSERT INTO public.member_profiles (user_id, email)
    VALUES (NEW.id, NEW.email)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Create a user_roles entry for the new user (default: pending member)
    INSERT INTO public.user_roles (user_id, role, approval_status)
    VALUES (NEW.id, 'member', 'pending')
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 2. CREATE TRIGGER ON auth.users
-- ============================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- 3. BACKFILL EXISTING USERS WITHOUT PROFILES OR ROLES
-- ============================================================================
-- Create member_profiles for any users who don't have one yet
INSERT INTO public.member_profiles (user_id, email)
SELECT 
    au.id as user_id,
    au.email
FROM auth.users au
LEFT JOIN public.member_profiles mp ON au.id = mp.user_id
WHERE mp.id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- Create user_roles for any users who don't have one yet
INSERT INTO public.user_roles (user_id, role, approval_status)
SELECT 
    au.id as user_id,
    'member' as role,
    'pending' as approval_status
FROM auth.users au
LEFT JOIN public.user_roles ur ON au.id = ur.user_id
WHERE ur.id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- Verify the fix
SELECT 
    COUNT(*) as users_in_auth,
    (SELECT COUNT(*) FROM public.member_profiles) as profiles_created,
    (SELECT COUNT(*) FROM public.user_roles) as roles_created
FROM auth.users;

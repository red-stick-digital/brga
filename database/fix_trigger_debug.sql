-- FIX: Database Trigger - Debug Version
-- 
-- This version will help us see what's actually failing

-- ============================================================================
-- 1. CREATE TRIGGER FUNCTION WITH LOGGING
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    profile_inserted BOOLEAN := FALSE;
    role_inserted BOOLEAN := FALSE;
BEGIN
    -- Create a blank member_profiles entry for the new user
    BEGIN
        INSERT INTO public.member_profiles (user_id, email)
        VALUES (NEW.id, NEW.email)
        ON CONFLICT (user_id) DO NOTHING;
        
        profile_inserted := TRUE;
        RAISE NOTICE 'Profile created for user %', NEW.id;
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    END;
    
    -- Create a user_roles entry for the new user (default: pending member)
    BEGIN
        INSERT INTO public.user_roles (user_id, role, approval_status)
        VALUES (NEW.id, 'member', 'pending')
        ON CONFLICT (user_id) DO NOTHING;
        
        role_inserted := TRUE;
        RAISE NOTICE 'Role created for user %', NEW.id;
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Failed to create role for user %: %', NEW.id, SQLERRM;
    END;
    
    IF NOT role_inserted THEN
        RAISE WARNING 'User % created but role creation failed - RLS policy may be blocking', NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 2. ALSO TRY: Completely disable RLS for the trigger function
-- ============================================================================

-- This is the nuclear option - completely bypass RLS within this function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Temporarily disable RLS for this function's operations
    PERFORM set_config('row_security', 'off', true);
    
    -- Create a blank member_profiles entry for the new user
    INSERT INTO public.member_profiles (user_id, email)
    VALUES (NEW.id, NEW.email)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Create a user_roles entry for the new user (default: pending member)
    INSERT INTO public.user_roles (user_id, role, approval_status)
    VALUES (NEW.id, 'member', 'pending')
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Re-enable RLS
    PERFORM set_config('row_security', 'on', true);
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Make sure to re-enable RLS even if there's an error
    PERFORM set_config('row_security', 'on', true);
    RAISE WARNING 'handle_new_user failed for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 3. Check Supabase logs after running test-trigger.js
-- ============================================================================
-- After running the test, check your Supabase Dashboard → Logs
-- Look for NOTICE or WARNING messages that show which part failed

-- DIAGNOSTIC VERSION: Trigger with explicit error messages
-- This will catch and log ANY error that happens

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    profile_error TEXT;
    role_error TEXT;
BEGIN
    -- Try to create profile
    BEGIN
        INSERT INTO public.member_profiles (user_id, email)
        VALUES (NEW.id, NEW.email);
        
        RAISE NOTICE 'SUCCESS: Profile created for user %', NEW.id;
    EXCEPTION 
        WHEN unique_violation THEN
            RAISE NOTICE 'Profile already exists for user % (ignored)', NEW.id;
        WHEN OTHERS THEN
            profile_error := SQLERRM;
            RAISE WARNING 'FAILED to create profile for user %: % (SQLSTATE: %)', 
                NEW.id, SQLERRM, SQLSTATE;
    END;
    
    -- Try to create role
    BEGIN
        INSERT INTO public.user_roles (user_id, role, approval_status)
        VALUES (NEW.id, 'member', 'pending');
        
        RAISE NOTICE 'SUCCESS: Role created for user %', NEW.id;
    EXCEPTION 
        WHEN unique_violation THEN
            RAISE NOTICE 'Role already exists for user % (ignored)', NEW.id;
        WHEN insufficient_privilege THEN
            RAISE WARNING 'PERMISSION DENIED: Cannot insert into user_roles for user %', NEW.id;
        WHEN OTHERS THEN
            role_error := SQLERRM;
            RAISE WARNING 'FAILED to create role for user %: % (SQLSTATE: %)', 
                NEW.id, SQLERRM, SQLSTATE;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- After running this and test-trigger.js, check Supabase logs:
-- Dashboard -> Logs -> Look for NOTICE or WARNING messages
-- They will tell us exactly what's failing

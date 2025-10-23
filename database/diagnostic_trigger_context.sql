-- DIAGNOSTIC: Check what context the trigger runs in
-- This will help us understand why auth.uid() IS NULL doesn't work

-- Create a logging table to capture trigger context
CREATE TABLE IF NOT EXISTS public.trigger_debug_log (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID,
    auth_uid UUID,
    current_user_val TEXT,
    session_user_val TEXT,
    current_role_val TEXT,
    is_auth_uid_null BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update the trigger to log its context
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    auth_uid_val UUID;
    is_null_check BOOLEAN;
BEGIN
    -- Capture the context
    auth_uid_val := auth.uid();
    is_null_check := (auth.uid() IS NULL);
    
    -- Log what we see
    INSERT INTO public.trigger_debug_log (
        user_id,
        auth_uid,
        current_user_val,
        session_user_val,
        current_role_val,
        is_auth_uid_null
    ) VALUES (
        NEW.id,
        auth_uid_val,
        current_user,
        session_user,
        current_setting('role', true),
        is_null_check
    );
    
    -- Create a blank member_profiles entry for the new user
    INSERT INTO public.member_profiles (user_id, email)
    VALUES (NEW.id, NEW.email)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Try to create user_roles entry
    BEGIN
        INSERT INTO public.user_roles (user_id, role, approval_status)
        VALUES (NEW.id, 'member', 'pending')
        ON CONFLICT (user_id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        -- Log the error in the debug table
        UPDATE public.trigger_debug_log
        SET current_role_val = SQLERRM
        WHERE user_id = NEW.id;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- After running this and testing with test-trigger.js, check the log:
-- SELECT * FROM public.trigger_debug_log ORDER BY created_at DESC LIMIT 5;

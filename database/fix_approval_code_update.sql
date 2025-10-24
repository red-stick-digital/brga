-- Fix: Allow approval status update when user signs up with valid approval code
-- Problem: RLS policies prevent users from updating their own approval_status
-- Solution: Create a SECURITY DEFINER function that can update approval_status

-- ============================================================================
-- 1. CREATE FUNCTION TO APPROVE USER WITH CODE
-- ============================================================================
CREATE OR REPLACE FUNCTION approve_user_with_code(user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Update the user's approval_status to 'approved'
    UPDATE public.user_roles
    SET 
        approval_status = 'approved',
        updated_at = NOW()
    WHERE user_id = user_id_param;
    
    -- Return true if update was successful
    RETURN FOUND;
END;
$$;

-- ============================================================================
-- 2. GRANT EXECUTE PERMISSION TO AUTHENTICATED USERS
-- ============================================================================
GRANT EXECUTE ON FUNCTION approve_user_with_code(UUID) TO authenticated;

-- ============================================================================
-- 3. ADD COMMENT FOR DOCUMENTATION
-- ============================================================================
COMMENT ON FUNCTION approve_user_with_code IS 
'Approves a user by updating their approval_status to approved. 
This function runs with elevated privileges to bypass RLS policies.
Should only be called during signup after validating an approval code.';

-- ============================================================================
-- 4. TEST THE FUNCTION (Optional - comment out for production)
-- ============================================================================
-- Test with a dummy UUID (replace with actual user_id for testing)
-- SELECT approve_user_with_code('00000000-0000-0000-0000-000000000000');

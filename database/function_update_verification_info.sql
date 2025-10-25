-- Function to update member profile with verification info during signup
-- This function has SECURITY DEFINER privileges to bypass RLS

CREATE OR REPLACE FUNCTION update_profile_verification_info(
    user_id_param UUID,
    verification_info_param TEXT
)
RETURNS JSON AS $$
BEGIN
    -- Update the member profile with verification info
    UPDATE member_profiles 
    SET verification_info = verification_info_param
    WHERE user_id = user_id_param;
    
    -- Return success status
    RETURN json_build_object(
        'success', true,
        'message', 'Verification info updated successfully'
    );
    
EXCEPTION WHEN OTHERS THEN
    -- Return error status
    RETURN json_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_profile_verification_info(UUID, TEXT) TO authenticated;
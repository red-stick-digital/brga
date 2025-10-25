-- Migration: Add verification_info column to member_profiles table
-- Date: October 24, 2025
-- Purpose: Add verification field for signup bot protection

-- Add verification_info column to member_profiles table
ALTER TABLE member_profiles 
ADD COLUMN IF NOT EXISTS verification_info TEXT;

-- Add comment for documentation
COMMENT ON COLUMN member_profiles.verification_info IS 'User-provided verification information for signup bot protection. Contains meetings attended, sponsor info, etc. Admin-visible only.';

-- No RLS policy changes needed - verification_info will be accessible via existing admin policies
-- The "Admins can view all profiles" policy already covers this column for admin access
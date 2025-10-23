-- Migration: Add Profile Completion Fields
-- Date: October 23, 2025
-- Purpose: Add first_name, last_name, profile_complete fields and remove deprecated full_name

-- Step 1: Add new fields to member_profiles table
ALTER TABLE member_profiles
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN DEFAULT FALSE;

-- Step 2: Remove deprecated full_name field (if it exists)
ALTER TABLE member_profiles
DROP COLUMN IF EXISTS full_name;

-- Step 3: Add comment for documentation
COMMENT ON COLUMN member_profiles.first_name IS 'Member first name';
COMMENT ON COLUMN member_profiles.last_name IS 'Member last name';
COMMENT ON COLUMN member_profiles.profile_complete IS 'Flag indicating if profile has all required fields completed (first_name, last_name, email, clean_date, home_group_id)';

-- Step 4: Update the schema to reflect changes (verification query)
-- Run this to verify the changes:
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'member_profiles' 
-- ORDER BY ordinal_position;

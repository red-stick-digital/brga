-- Migration: Remove full_name field and related triggers
-- Execute this after applying the separate name fields migration

-- Remove the trigger that auto-computes full_name
DROP TRIGGER IF EXISTS trigger_update_full_name ON member_profiles;

-- Remove the trigger function
DROP FUNCTION IF EXISTS update_full_name_from_parts();
DROP FUNCTION IF EXISTS compute_full_name(TEXT, TEXT, TEXT);

-- Remove the full_name column
ALTER TABLE member_profiles DROP COLUMN IF EXISTS full_name;

-- Drop the view that included full_name
DROP VIEW IF EXISTS member_profiles_with_computed_names;

-- Add comments to document the change
COMMENT ON TABLE member_profiles IS 'Member profiles using separate name fields (first_name, middle_initial, last_name)';
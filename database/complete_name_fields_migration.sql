-- Complete migration: Add separate name fields and remove full_name
-- This handles the full migration from full_name to separate fields

-- Step 1: Add the new name fields
ALTER TABLE member_profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS middle_initial TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Step 2: Migrate existing full_name data to separate fields
-- This attempts to parse existing full_name data
UPDATE member_profiles 
SET 
  first_name = CASE 
    WHEN full_name IS NOT NULL AND trim(full_name) != '' THEN
      split_part(trim(full_name), ' ', 1)
    ELSE NULL
  END,
  last_name = CASE 
    WHEN full_name IS NOT NULL AND trim(full_name) != '' THEN
      CASE 
        WHEN array_length(string_to_array(trim(full_name), ' '), 1) >= 2 THEN
          split_part(trim(full_name), ' ', array_length(string_to_array(trim(full_name), ' '), 1))
        ELSE NULL
      END
    ELSE NULL
  END,
  middle_initial = CASE 
    WHEN full_name IS NOT NULL AND trim(full_name) != '' THEN
      CASE 
        WHEN array_length(string_to_array(trim(full_name), ' '), 1) = 3 THEN
          left(split_part(trim(full_name), ' ', 2), 1)
        ELSE NULL
      END
    ELSE NULL
  END
WHERE full_name IS NOT NULL;

-- Step 3: Remove the trigger that auto-computes full_name (if it exists)
DROP TRIGGER IF EXISTS trigger_update_full_name ON member_profiles;

-- Step 4: Remove the trigger function (if it exists)
DROP FUNCTION IF EXISTS update_full_name_from_parts();
DROP FUNCTION IF EXISTS compute_full_name(TEXT, TEXT, TEXT);

-- Step 5: Remove the full_name column
ALTER TABLE member_profiles DROP COLUMN IF EXISTS full_name;

-- Step 6: Drop the view that included full_name (if it exists)
DROP VIEW IF EXISTS member_profiles_with_computed_names;

-- Step 7: Add missing columns that should exist based on the schema
ALTER TABLE member_profiles 
ADD COLUMN IF NOT EXISTS share_phone_in_directory BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS share_email_in_directory BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS officer_position TEXT;

-- Step 8: Add comments to document the change
COMMENT ON TABLE member_profiles IS 'Member profiles using separate name fields (first_name, middle_initial, last_name)';
COMMENT ON COLUMN member_profiles.first_name IS 'Member first name';
COMMENT ON COLUMN member_profiles.middle_initial IS 'Member middle initial (single character)';
COMMENT ON COLUMN member_profiles.last_name IS 'Member last name';
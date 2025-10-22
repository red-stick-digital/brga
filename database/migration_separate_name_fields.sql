-- Migration: Add separate name fields to member_profiles
-- This migration adds first_name, middle_initial, and last_name fields
-- while keeping full_name for backward compatibility and computed values

-- ============================================================================
-- 1. ADD NEW NAME FIELDS TO MEMBER_PROFILES
-- ============================================================================

ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS middle_initial TEXT; -- Optional middle initial
ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS last_name TEXT;

-- ============================================================================
-- 2. CREATE A FUNCTION TO COMPUTE FULL NAME FROM PARTS
-- ============================================================================

CREATE OR REPLACE FUNCTION compute_full_name(first_name TEXT, middle_initial TEXT, last_name TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Build full name from parts
    RETURN TRIM(
        CONCAT(
            COALESCE(first_name, ''),
            CASE 
                WHEN middle_initial IS NOT NULL AND middle_initial != '' 
                THEN ' ' || middle_initial || '.' 
                ELSE '' 
            END,
            CASE 
                WHEN last_name IS NOT NULL AND last_name != '' 
                THEN ' ' || last_name 
                ELSE '' 
            END
        )
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- 3. CREATE TRIGGER TO AUTO-UPDATE FULL_NAME WHEN NAME PARTS CHANGE
-- ============================================================================

CREATE OR REPLACE FUNCTION update_full_name_from_parts()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-compute full_name when name parts are updated
    NEW.full_name = compute_full_name(NEW.first_name, NEW.middle_initial, NEW.last_name);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists and recreate
DROP TRIGGER IF EXISTS trigger_update_full_name ON member_profiles;
CREATE TRIGGER trigger_update_full_name 
    BEFORE INSERT OR UPDATE OF first_name, middle_initial, last_name ON member_profiles
    FOR EACH ROW EXECUTE FUNCTION update_full_name_from_parts();

-- ============================================================================
-- 4. POPULATE EXISTING DATA (if any exists)
-- ============================================================================
-- This will attempt to split existing full_name values into parts
-- Note: This is a best-effort approach and may need manual cleanup

UPDATE member_profiles 
SET 
    first_name = CASE 
        WHEN full_name IS NOT NULL AND full_name != '' THEN
            SPLIT_PART(TRIM(full_name), ' ', 1)
        ELSE NULL
    END,
    last_name = CASE 
        WHEN full_name IS NOT NULL AND full_name != '' AND array_length(string_to_array(TRIM(full_name), ' '), 1) > 1 THEN
            SPLIT_PART(TRIM(full_name), ' ', array_length(string_to_array(TRIM(full_name), ' '), 1))
        ELSE NULL
    END
WHERE full_name IS NOT NULL AND full_name != ''
AND (first_name IS NULL OR last_name IS NULL);

-- ============================================================================
-- 5. ADD HELPFUL INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_member_profiles_first_name ON member_profiles(first_name);
CREATE INDEX IF NOT EXISTS idx_member_profiles_last_name ON member_profiles(last_name);

-- ============================================================================
-- 6. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON COLUMN member_profiles.first_name IS 'Member first name';
COMMENT ON COLUMN member_profiles.middle_initial IS 'Optional middle initial (stored without period)';
COMMENT ON COLUMN member_profiles.last_name IS 'Member last name or last initial';
COMMENT ON COLUMN member_profiles.full_name IS 'Auto-computed from name parts via trigger, can also be manually set';

-- ============================================================================
-- 7. CREATE A VIEW FOR EASY NAME HANDLING
-- ============================================================================

CREATE OR REPLACE VIEW member_profiles_with_computed_names AS
SELECT 
    *,
    compute_full_name(first_name, middle_initial, last_name) as computed_full_name,
    CASE 
        WHEN first_name IS NOT NULL THEN first_name
        ELSE SPLIT_PART(full_name, ' ', 1)
    END as display_first_name,
    CASE 
        WHEN last_name IS NOT NULL THEN last_name
        WHEN full_name IS NOT NULL AND array_length(string_to_array(TRIM(full_name), ' '), 1) > 1 THEN
            SPLIT_PART(TRIM(full_name), ' ', array_length(string_to_array(TRIM(full_name), ' '), 1))
        ELSE null
    END as display_last_name
FROM member_profiles;

COMMENT ON VIEW member_profiles_with_computed_names IS 'View that provides both stored and computed name fields for flexibility';
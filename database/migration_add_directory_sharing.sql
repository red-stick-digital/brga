-- Migration: Add Directory Sharing and Officer Position Fields
-- This migration adds columns for member directory sharing preferences and officer positions
-- Date: 2024

-- Add new columns to member_profiles table
ALTER TABLE member_profiles
ADD COLUMN IF NOT EXISTS share_phone_in_directory BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS share_email_in_directory BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS officer_position TEXT CHECK (officer_position IN ('Chairman', 'Vice Chairman', 'Secretary', 'Treasurer', 'Librarian', 'Public Relations', 'Telephone Chair', 'Intergroup Representative'));

-- Verify the columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'member_profiles' 
AND column_name IN ('share_phone_in_directory', 'share_email_in_directory', 'officer_position');
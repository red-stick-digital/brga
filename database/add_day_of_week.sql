-- Add day_of_week column to home_groups table
-- This allows proper sorting by meeting day (Monday, Tuesday, etc.)

-- Add the column if it doesn't exist
ALTER TABLE home_groups
ADD COLUMN IF NOT EXISTS day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6) DEFAULT 0;

-- Add comment explaining the values
COMMENT ON COLUMN home_groups.day_of_week IS 'Day of week for the meeting: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday';

-- Create index for faster sorting
CREATE INDEX IF NOT EXISTS idx_home_groups_day_of_week ON home_groups(day_of_week);
-- Migration: Add user_type field to waitlist table for persona-based email routing
-- Created: 2025-01-28
-- Purpose: Enable targeted email content based on user persona (professional vs student)

-- Add user_type column with constraint
ALTER TABLE waitlist 
ADD COLUMN user_type TEXT 
CHECK (user_type IN ('professional', 'student', 'other'));

-- Backfill existing records based on role field
UPDATE waitlist 
SET user_type = CASE 
  WHEN role IN ('Producer', '1st AD', 'Line Manager') THEN 'professional'
  WHEN role = 'Student' THEN 'student'
  ELSE 'other'
END
WHERE user_type IS NULL;

-- Add index for query performance
CREATE INDEX idx_waitlist_user_type ON waitlist(user_type);

-- Add column comment for documentation
COMMENT ON COLUMN waitlist.user_type IS 'User persona type for email routing: professional (producers, ADs, line managers), student (film students), or other';

-- Create helper function to compute user_type from role
CREATE OR REPLACE FUNCTION compute_user_type(role_input TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN CASE 
    WHEN role_input IN ('Producer', '1st AD', 'Line Manager') THEN 'professional'
    WHEN role_input = 'Student' THEN 'student'
    ELSE 'other'
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add trigger to auto-populate user_type on insert/update
CREATE OR REPLACE FUNCTION set_user_type_from_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS NOT NULL THEN
    NEW.user_type := compute_user_type(NEW.role);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_user_type
  BEFORE INSERT OR UPDATE OF role ON waitlist
  FOR EACH ROW
  EXECUTE FUNCTION set_user_type_from_role();

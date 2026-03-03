-- Migration: Extend payment_leads to support subscription tier leads
-- Adds new tier values and optional company field for production company tracking

-- Drop and recreate the payment_tier CHECK constraint to include new tiers
ALTER TABLE payment_leads DROP CONSTRAINT IF EXISTS payment_leads_payment_tier_check;

ALTER TABLE payment_leads 
ADD CONSTRAINT payment_leads_payment_tier_check 
CHECK (payment_tier IN ('R49', 'R249', 'R499', 'R1999', 'R3499'));

-- Add company field for production company tracking
ALTER TABLE payment_leads 
ADD COLUMN IF NOT EXISTS company TEXT;

-- Add tier_price field to store the actual price for the subscription tiers
ALTER TABLE payment_leads 
ADD COLUMN IF NOT EXISTS tier_price INTEGER;

-- Make name optional (was NOT NULL) since some older flows may not have it
-- Actually, we'll keep name NOT NULL but allow the modal to enforce it

-- Make yoco_url nullable since Studio OS tier uses mailto instead of Yoco
ALTER TABLE payment_leads ALTER COLUMN yoco_url DROP NOT NULL;

-- Add index on payment_tier for analytics queries
CREATE INDEX IF NOT EXISTS idx_payment_leads_payment_tier ON payment_leads(payment_tier);

-- Add comments
COMMENT ON COLUMN payment_leads.company IS 'Production company name (optional, captured during tier selection)';
COMMENT ON COLUMN payment_leads.tier_price IS 'Monthly price in ZAR for the selected tier (e.g., 499, 1999, 4999)';

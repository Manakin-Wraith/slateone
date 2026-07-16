-- Migration: 2026-07 pricing tier change
-- Replaces the single $49/mo subscription model with a two-tier ZAR model:
--   tier_1 = Pay-Per-Breakdown (R450 per breakdown)
--   tier_2 = Annual Team License (R1,850/yr + R150 per seat)
--
-- Landing-page leads are captured in payment_leads with the tier id in
-- payment_tier and the ZAR amount in tier_price. The CTA then redirects to
-- app.slateone.studio signup with a plan query param; the app backend maps
-- tier_1 -> tier_1_pay_per_breakdown and tier_2 -> tier_2_annual_team.
--
-- We ADD the new tier ids to the CHECK constraint and preserve every legacy
-- value (including 'monthly', which the previous live flow inserted even
-- though it was never in any prior CHECK — those inserts were silently
-- failing on the non-blocking createSubscriptionLead path).

ALTER TABLE payment_leads DROP CONSTRAINT IF EXISTS payment_leads_payment_tier_check;

ALTER TABLE payment_leads
ADD CONSTRAINT payment_leads_payment_tier_check
CHECK (payment_tier IN (
  -- New 2026-07 tiers
  'tier_1', 'tier_2',
  -- Legacy single-subscription flow
  'monthly',
  -- Legacy Yoco packs
  'R49', 'R249',
  -- Legacy subscription / pack experiments (retained so historical rows stay valid)
  'R499', 'R1999', 'R4999',
  'feature_film', 'tv_series', 'short_film', 'indie_studio',
  'production_company', 'studio',
  'single_script', 'pack_5', 'pack_10', 'pack_25'
));

-- yoco_url is already nullable (see extend_payment_leads_subscription_tiers.sql).
-- For the new flow it stores the app-signup redirect URL we send the lead to.
COMMENT ON COLUMN payment_leads.yoco_url IS 'Redirect URL the lead was sent to (Yoco checkout for legacy tiers, app.slateone.studio signup for tier_1/tier_2).';

-- tier_price already exists (INTEGER); for the new tiers it stores the headline
-- ZAR amount: 450 for tier_1 (per breakdown), 1850 for tier_2 (annual base).
COMMENT ON COLUMN payment_leads.tier_price IS 'Headline price in ZAR for the selected tier (tier_1=450 per breakdown, tier_2=1850 annual base; legacy tiers store their monthly ZAR price).';

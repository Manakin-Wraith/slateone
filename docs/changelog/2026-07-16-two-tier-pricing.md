# Two-Tier ZAR Pricing Model

**Date:** 2026-07-16
**Type:** Feature / Refactor

## Summary

Replaced the single flat-rate `$49/month` subscription with a two-tier, ZAR-priced
model on the landing page. Uploading and editing scripts is free; users pay only
when they run a breakdown. The landing page captures the email as a lead and then
redirects to the product app signup — no static checkout link on the landing page.

Source of truth for the business model: `ScripDown_AI/docs/SPEC_Tiered_Business_Model.md`
(product/app repo), adapted for the landing page. Per product-owner directive, **no
"AI" wording appears on the landing page** — the billable concept is called
"breakdown" / "script analysis".

## New Pricing

| Tier (lead id) | Display Name | Price | Billing | Team features |
|----------------|--------------|-------|---------|---------------|
| `tier_1` | Pay-Per-Breakdown | R450 / breakdown | Pay as you go | ✕ |
| `tier_2` | Annual Team License | R1,850 / yr + R150 / seat | Annual, upfront | ✓ |

- **Currency:** ZAR only
- **Free/trial:** None
- **Payment flow:** Email capture → `payment_leads` (status `intent` → `redirected`)
  → redirect to `https://app.slateone.studio/login?mode=signup&plan=<tier>&source=<src>&ref=<tracking_id>`
- **Highlighted tier:** Annual Team License (Tier 2)

## Previous Pricing (Removed)

- **$49/month** flat subscription via Wise (`createSubscriptionLead`, single card).

## Files Changed

### `supabase/migrations/update_pricing_tiers_2026_07.sql` (new)
- Widens `payment_leads.payment_tier` CHECK to add `tier_1`, `tier_2`.
- Preserves all legacy values (`monthly`, `R49`, `R249`, packs) — no backfill/deletion.
- Note: `monthly` was never in any prior CHECK, so old `$49` lead inserts had been
  silently failing on the non-blocking save path; it is now included.
- Repurposes existing `yoco_url` (nullable) to store the app-signup redirect URL and
  `tier_price` to store the headline ZAR amount (450 / 1850). Column names kept to
  avoid breaking any app-side/webhook dependencies.

### `lib/supabase.ts`
- Removed legacy `createSubscriptionLead` + `SubscriptionTier`, and `createPaymentLead`
  + `PaymentLeadData` (Yoco).
- Added `PricingTier = 'tier_1' | 'tier_2'`, `PricingLeadData`, and `createPricingLead()`
  which saves the lead (best-effort) and returns the app-signup `signupUrl`.
- `updatePaymentLeadStatus()` retained (used by the modal for the `redirected` status).

### `components/Pricing.tsx`
- Single `$49` card → two-card ZAR grid driven by a `TIERS` config array.
- Tier 2 highlighted as "Recommended".
- Feature lists sourced from the business-model spec, relabeled with no "AI" wording.

### `components/TierSelectionModal.tsx`
- Accepts either tier; shows tier-specific name, tagline and price.
- Email capture → `createPricingLead` → redirect to app signup.

### Deleted
- `components/PaymentModal.tsx` and `components/HowItWorks.tsx` — confirmed dead
  (only referenced each other; never rendered by `App.tsx`).

### Docs
- `docs/pricing-model-change-spec.md` §3 filled in with the confirmed model.
- `docs/marketing-reference.md` §8 (Pricing) + §9 CTA row updated; AI wording removed.

## Follow-up (separate `ScripDown_AI` app repo — not in this repo)

- Widen `profiles.subscription_plan` CHECK (currently `('trial','monthly')` in
  `032_pricing_simplification.sql`) to allow `tier_1_pay_per_breakdown` and
  `tier_2_annual_team`.
- `/api/auth/set-plan` already writes the `plan` query param to `signup_plan`; confirm
  it maps `tier_1`/`tier_2` → the full signup_plan ids once the constraint is updated.
- Wire the actual ZAR payment provider (Yoco/Stripe/Paystack) for per-breakdown charges
  and annual + per-seat billing; enforce Tier 1 team-feature exclusions server-side.

# Studio Commitment-Ladder Pricing — Design Spec

**Date:** 2026-08-19
**Status:** Approved, ready for implementation plan

## Problem

The current pricing section sells two tiers: **Pay-Per-Breakdown** (Solo,
R2,250/breakdown) and **Team License** (a single card with an internal
cadence-selector table — monthly/3-month/6-month/annual, 0/1/2/3 included
seats). The monthly cadence has no commitment and no included seats, which
gives price-sensitive visitors a low-commitment escape hatch that competes
with the tiers we'd rather sell.

The new model reframes Team License as a **commitment ladder**: drop the
no-commitment monthly cadence, and present the remaining three cadences as
named, standalone products — Studio 3 / Studio 6 / Studio 12 — each its own
card, alongside Project (the renamed Pay-Per-Breakdown). The psychological
goal: a visitor sees R2,250 for one screenplay, then R5,500 for 3 months +
a seat, then R9,500 for 6 months + 2 seats, then R18,500 for 12 months + 3
seats, and self-selects into a subscription because the per-project math
stops making sense past the first breakdown.

## Non-goals

- No price changes. R5,500 / R9,500 / R18,500 and R250/seat/month-equivalent
  stay exactly as they are today — this is a restructuring and renaming
  exercise, not a repricing.
- No new backend/PayFast work. The `tier_2` internal id, `billing_period`
  query param values (`3month`/`6month`/`annual`), and lump-sum billing
  mechanics are unchanged — only the `monthly` cadence value is removed.
- Not fixing pre-existing stale docs (`docs/app-repo-handoff-pricing.md`,
  `docs/pitch-deck.md`, `public/TERMS OF SERVICE FOR SLATEONE STUDIO.md`)
  beyond adding one `BACKLOG.md` line noting they now also need the Studio
  3/6/12 naming on top of their existing R450-vs-R2,250 drift.
- No new brand colors. The site's Tailwind theme (`charcoal`, `neon`
  #E3FF00, `cyan`, `paper`, `slate-black`, `soft-grey`) is configured
  inline in `index.html` and stays as-is; tier differentiation uses
  existing tokens, not new green/blue/purple hues.

## Data model changes

### `lib/supabase.ts`

- `BillingPeriod` narrows from `'monthly' | '3month' | '6month' | 'annual'`
  to `'3month' | '6month' | 'annual'`. Drop the `monthly` key everywhere it
  appears: `TIER_PRICE.tier_2`, and the default in `createPricingLead`
  (`leadData.billingPeriod || 'monthly'` → default becomes `'annual'`, since
  there's no more no-commitment fallback — every `tier_2` lead must carry an
  explicit cadence).
- `TIER_PRICE.tier_1` keeps its `monthly` key as an internal implementation
  detail (Project has no cadence concept; the field name is just how the
  lookup table is shaped) — rename that inner key is optional polish, not
  required. Leave it unless it reads confusingly once `tier_2` no longer has
  a `monthly` key; if so, rename `TIER_PRICE.tier_1`'s key to reflect "no
  cadence" more literally (e.g. drop the nested record for tier_1 and store
  a flat number) as a small cleanup in the same pass.
- Update the header comment block (lines 94-105) to describe 3 cadences,
  not 4, and drop the "monthly / 0 included seats" line.

### `components/Pricing.tsx`

- `CADENCES` drops `'monthly'`.
- `CADENCE_LABELS` becomes the card names: `3month: 'Studio 3'`, `6month:
  'Studio 6'`, `annual: 'Studio 12'`.
- `CADENCE_HEADLINES` (currently one big string picked by `billingPeriod`
  toggle state) goes away — each cadence gets its own always-visible card
  instead of a shared headline driven by a selector.
- `TierConfig.billing: Record<BillingPeriod, BillingVariant>` structure
  changes shape: instead of one `tier_2` entry containing all cadences
  behind a picker, `TIERS` becomes a flat list of 4 card configs (Project,
  Studio 3, Studio 6, Studio 12), each with its own `id: PricingTier`
  (`tier_1` for Project, `tier_2` for all three Studio cards) and — for the
  three Studio cards — a fixed `billingPeriod: BillingPeriod` value baked
  into the card instead of driven by a `useState` toggle.
- Remove the `billingPeriod` `useState` from the `Pricing` component; it's
  no longer a selector the user interacts with — each card's cadence is
  fixed. `TierSelectionModal` receives the card's own `billingPeriod`
  directly (`tier_1` cards pass a placeholder value the modal ignores, same
  as today).

### `components/TierSelectionModal.tsx`

- Its separate `TIER_DETAILS` config (currently duplicating `Pricing.tsx`'s
  shape) gets the same treatment: drop the `monthly` cadence entry from the
  `tier_2` detail map. No structural change needed here beyond that removal
  — the modal already keys off whatever `billingPeriod` prop it's passed.

## Visual design — `components/Pricing.tsx` SECTION 2

Replace the current `grid md:grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]`
two-slot layout (Solo card + one wide Team card containing the cadence
table) with a 4-up grid: `grid md:grid-cols-2 lg:grid-cols-4 gap-6`. Each
card is now structurally identical (badge, name, price, effective-monthly
subline, included seats, extra-seat rate, feature list, CTA) — no more
special-cased `tier.billing` table-rendering branch; delete that branch
(lines ~207-270) entirely along with `BillingVariant`'s `savingsBadge`-in-a-
table rendering, replaced by a simpler per-card savings badge.

Card-by-card:

- **Project** (was Solo/Pay-Per-Breakdown): unchanged pricing/features,
  renamed badge/name. Same slate/neutral card styling as today.
- **Studio 3**: **R5,500** total, "R1,833/mo effective" subline
  (computed as `price / 3`, not hardcoded — see below), 1 seat included,
  R250/mo extra seat. Neutral/slate card styling, same tier as today's base
  Team License entry point.
- **Studio 6**: R9,500 total, "R1,583/mo effective," 2 seats included.
  Slightly elevated styling (subtle cyan-tinted border) to signal it's a
  step up, not yet the top pick.
- **Studio 12**: R18,500 total, "R1,542/mo effective," 3 seats included.
  Gets the "Best Value" badge treatment — reuses today's `highlighted`
  amber styling (border-amber-500/30, bg-amber-500/[0.03], amber "Best
  Value" corner ribbon replacing today's "Recommended" ribbon text) since
  it's now the top rung, not the whole Team tier.

Effective-monthly sublines are **computed in code** from the existing
price/cadence-length, not hand-typed strings — this avoids the exact
inconsistency the pre-brainstorm draft numbers had (R5,550 vs. R5,500) ever
recurring. `BillingVariant` gains nothing new; the per-card component just
divides `price` by the cadence's month-count (3/6/12) and formats it.

**Shared collaboration panel:** the current `teamsBand` block (invites,
department workspaces, cross-department threads, item tracking, access
control — currently attached to the single Team card) moves out of the
per-card loop into one shared section rendered once below the 4-card grid,
visible whenever any Studio card is shown (i.e., always, since Studio cards
are always rendered now). Keep its existing copy and icon treatment; just
relocate it structurally so it isn't repeated 3×.

**Extra-seat footnote:** today's shared line ("Need more? Extra seats are a
flat R250/month...") moves below the shared collaboration panel, applying
to all three Studio cards at once.

## Copy changes

- **Section header** (`Pricing.tsx` lines ~150-160): tagline changes from
  "Pay per breakdown when you need it, or license your whole team on a term
  that fits... Prices in ZAR. No lock-in." — drop "No lock-in" (now
  inaccurate for 3 of 4 cards) in favor of something like: "Pay per project
  when you need it, or lock in a term and bring your crew along." Keep
  "Prices in ZAR."
- **`components/TermsOfService.tsx`** §on plans (current lines ~19-21):
  update "Team License, where each additional team member requires a paid
  seat" and the "billed monthly or annually in advance (with a two-month
  discount for annual billing)" line — that line already describes the
  *old* 2-cadence model inaccurately (doesn't mention 3-month/6-month even
  today) and needs to name the Studio 3/6/12 structure: three fixed-term
  commitments (3/6/12 months), each with included seats and a flat
  per-seat add-on, no month-to-month option.
- **`docs/marketing-reference.md`** (lines ~131, 137-138, 147-148, 156-159):
  update cadence list ("monthly, 3-month, 6-month, or annual" → "3-month,
  6-month, or 12-month Studio commitment"), rename "Team License" mentions
  to "Studio," drop the monthly R1,850/mo bullet.
- **`docs/landing-faq.md`** / **`components/FAQ.tsx`** (mirrored content):
  update cadence/plan-name mentions to match — "billed monthly/3-month/
  6-month/annual as prepaid terms" → "3, 6, or 12-month Studio commitment,
  prepaid."
- **`BACKLOG.md`**: add one line under Marketing/content noting
  `docs/app-repo-handoff-pricing.md` and `docs/pitch-deck.md` now also need
  the Studio 3/6/12 naming applied, on top of their pre-existing R450-vs-
  R2,250 numeric drift (already tracked there).

## Testing / verification

No test suite exists in this repo (per `CLAUDE.md`). Verification is
manual: run `npm run dev`, load the pricing section, confirm all 4 cards
render with correct prices/seats/effective-monthly math, click each card's
CTA and confirm `TierSelectionModal` opens with the right tier/cadence and
the signup redirect URL's `billing_period` param matches the card clicked
(no `monthly` value ever appears for `tier_2`). Confirm `npm run build`
still succeeds and the bundle-size warning doesn't newly regress.

## Open items deferred to implementation

- Exact Tailwind classes for the Studio 6 "step up" treatment (subtle cyan
  border) — implementer's call within the existing palette, no new tokens.
- Whether `TIER_PRICE.tier_1`'s nested-record shape gets simplified to a
  flat number (optional cleanup, not required for correctness).

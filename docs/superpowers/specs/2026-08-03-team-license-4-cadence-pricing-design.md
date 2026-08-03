# Team License 4-Cadence Pricing — Landing Page Design

**Date:** 2026-08-03
**Scope:** Landing-page UI/copy only — `components/Pricing.tsx`, `components/TierSelectionModal.tsx`, and the shared `BillingPeriod` type in `lib/supabase.ts`.
**Out of scope:** `payment_leads` schema/migration, app-side (`app.slateone.studio`) signup and billing logic, TOS copy. These are flagged as follow-ups below, not implemented here.

Source brief: `/Users/thecasterymedia/Desktop/PORTFOLIO/SaaS/ScripDown_AI/docs/PRICING_CHANGE_BRIEF_FOR_DESIGN.md`. The numbers in that brief (R1,850 / R18,500 license, R250 / R2,500 seats, R2,250 Solo) are identical to what's already live in `components/Pricing.tsx`, confirming this landing page and the ScripDown_AI product are the same business — the brief's new 4-cadence model applies directly here.

---

## 1. What's changing

The current Team License card sells on 2 cadences (Monthly / Annual) with 0 included seats — every seat is a paid add-on at a flat R250/mo or R2,500/yr. It moves to 4 cadences, each bundling free seats, with a flat (non-discounting) extra-seat rate:

| Cadence | License price | Included seats | Extra seat price |
|---|---|---|---|
| Monthly | R1,850 | 0 | R250/mo |
| 3-Month | R5,500 | 1 | R750 flat |
| 6-Month | R9,500 | 2 | R1,500 flat |
| Annual | R18,500 | 3 | R3,000 flat |

Solo (`tier_1`, Pay-Per-Breakdown, R2,250/breakdown) is unchanged.

**Rule:** the license price gets cheaper per month the longer the term; extra seats never discount — always exactly R250/seat/month regardless of cadence. This flat, easy-mental-math seat rate is a selling point, not fine print.

---

## 2. `components/Pricing.tsx` changes

### 2.1 Tier config

`TeamsBand`'s billing map (currently `Record<'monthly'|'annual', BillingVariant>`) widens to cover all 4 `BillingPeriod` values. Each variant carries:

- `price`, `priceUnit` (license price/cadence)
- `includedSeats: number` (0/1/2/3)
- `seatPrice` (flat amount, e.g. `R750`) and `seatPriceUnit` (`/ 3mo`, `/ 6mo`, `/ yr`, `/ mo`)
- `savingsBadge?: string` — set for **all four** cadences (see §2.3 deviation note), e.g. `'Small savings'` / `'~14% savings'` / `'~17% savings'`

### 2.2 Card layout — mini comparison table replaces the toggle

The current 2-button pill toggle (`Monthly` / `Annual`) is replaced by a 4-row table inside the Team License card header:

```
Cadence     Price      Included        Extra seat
Monthly     R1,850     —               R250/mo
3-Month     R5,500     1 seat    🏷     R750 flat
6-Month     R9,500     2 seats   🏷14%  R1,500 flat
Annual      R18,500    3 seats   🏷17%  R3,000 flat
```

Each row is clickable and sets `billingPeriod` state (same mechanism the toggle buttons used) — the selected row gets the amber highlight treatment currently used for the active toggle button. No separate toggle control remains; the table doubles as the selector.

### 2.3 Savings badges — all 4 cadences (deviation from source brief)

The source brief explicitly says **not** to badge 3-Month, since ~R1,833/mo vs the R1,850/mo baseline is not a meaningful discount and risks reading as false advertising. **Per explicit user instruction, this design badges all four cadences anyway**, including 3-Month. To avoid the false-advertising risk the brief warned about, the 3-Month badge should use different copy than a percentage claim — e.g. a plain seat-inclusion badge (`"1 seat included"`) rather than a `"~1% savings"` badge, since the latter would be misleading at that magnitude. 6-Month and Annual keep percentage-savings badges (`~14%`, `~17%`) as originally specified.

### 2.4 Dynamic headline

Above the table, a one-line headline reflects the selected cadence, adopting the brief's "first N teammates free" framing:

- Monthly: *"R1,850/month — extra seats R250/mo each"* (no "free teammates" claim at 0 included)
- 3-Month: *"R5,500 for 3 months — you + 1 teammate included"*
- 6-Month: *"R9,500 for 6 months — your 3-person crew included"* (owner + 2 seats)
- Annual: *"R18,500/year — your whole 4-person team included"* (owner + 3 seats)

This replaces the current static "License / + Seats" two-row price block.

### 2.5 Footnote (persistent, all cadences)

Below the table: *"Need more? Extra seats are a flat R250/month, no matter which plan — simple math, no surprises."*

### 2.6 Layout width

The table needs more horizontal room than the old price block. The Team License card should take visual priority over the strict `md:grid-cols-2` split with Solo — e.g. Team License full-width (or wider column) with Solo stacked above/beside at reduced width. Exact grid mechanics are an implementation-time call; the constraint is the table must not feel cramped at the current card width (~`max-w-5xl` / 2-col grid item).

---

## 3. `components/TierSelectionModal.tsx` changes

`TIER_DETAILS.tier_2` expands from 2 `BillingPeriod` keys (`monthly`, `annual`) to all 4. Each variant gets a 3-row price block instead of the current 2-row one:

```
License (cadence)      R1,850 / R5,500 / R9,500 / R18,500
Includes N seats        0 / 1 / 2 / 3
+ Extra seat            R250/mo / R750 flat / R1,500 flat / R3,000 flat
```

Header tagline (`'Unlimited breakdowns · Full team collaboration'`) is unchanged. `tier_1` (Solo) entries are untouched — still identical across all `BillingPeriod` keys since Solo has no cadence concept; note the `TIER_DETAILS` type requires all 4 keys per tier once `BillingPeriod` widens, so `tier_1`'s 4 keys will be duplicates of the same values (as its 2 keys already are today).

---

## 4. Shared type change

`lib/supabase.ts`: `BillingPeriod` widens from `'monthly' | 'annual'` to `'monthly' | '3month' | '6month' | 'annual'`.

This is a type-only change for this scope. It does **not** include:
- Widening the `payment_leads.billing_period` column/CHECK constraint in Supabase
- Any migration
- App-side (`app.slateone.studio`) signup/billing logic to handle `3month`/`6month` leads

**Follow-up required before ship:** leads captured under `billingPeriod: '3month'` or `'6month'` will fail or be miscategorized downstream until the backend follow-up (schema + app signup mapping) lands. This design should not go live until that companion work is scoped and done — flagging here so it isn't lost.

---

## 5. Copy tweaks

- Pricing section intro (`Pricing.tsx` §1 header): *"license your whole team for the year"* → *"license your whole team on a term that fits"* (accurate now that annual isn't the only team option).
- TOS (`components/TermsOfService.tsx`, `public/TERMS OF SERVICE FOR SLATEONE STUDIO.md`): still reference `[Monthly/Annually]` and "Team Plan" — flagged for a follow-up pass, not scoped into this design.

---

## 6. Non-negotiables (from source brief, still binding)

- Prices, cadence IDs (`monthly`/`3month`/`6month`/`annual`), and included-seat counts must match §1's table exactly.
- Extra seats never discount — flat R250/seat/month equivalent at every cadence.
- No "pick your own seat cadence" — seats always share the license's term.
- Owner's own membership doesn't count against the included-seat bundle server-side; if design wants to message included seats as "N teammates" vs. "N seats total including you," that's the framing this doc uses (**"N teammates" = seats beyond the owner**, i.e. 6-Month's "your 3-person crew" = owner + 2 included seats). Confirm this framing choice survives contact with product/eng before ship, per the brief's note that this needs a product conversation.

---

## 7. Explicit deviations from the source brief

1. **3-Month savings badge added** despite the brief's explicit recommendation against it (§2.3). Mitigated by using non-percentage badge copy for that cadence specifically, to avoid the false-advertising risk the brief flagged.

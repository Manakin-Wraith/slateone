# Team License 4-Cadence Pricing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the Team License pricing card and lead-capture modal from a 2-cadence toggle (Monthly/Annual, 0 included seats) to a 4-cadence comparison table (Monthly/3-Month/6-Month/Annual, each bundling free seats), per `docs/superpowers/specs/2026-08-03-team-license-4-cadence-pricing-design.md`.

**Architecture:** No new components or dependencies. Widen the shared `BillingPeriod` type in `lib/supabase.ts` from 2 to 4 values, then update the two consumers (`Pricing.tsx`'s tier config + table UI, `TierSelectionModal.tsx`'s tier detail lookup) to match. Pure data + JSX changes in three existing files.

**Tech Stack:** React 19, TypeScript 5.8, Tailwind (CDN, no build step), Vite.

## Global Constraints

- Prices, cadence IDs (`monthly`/`3month`/`6month`/`annual`), and included-seat counts must match exactly: Monthly R1,850/0 seats/R250 extra-seat-per-mo; 3-Month R5,500/1 seat/R750 flat; 6-Month R9,500/2 seats/R1,500 flat; Annual R18,500/3 seats/R3,000 flat.
- Extra seats never discount — always the flat R250/seat/month equivalent regardless of cadence.
- Solo (`tier_1`, R2,250/breakdown) is unchanged — its `TIER_DETAILS`/`TIER_PRICE` entries stay the same value across all 4 `BillingPeriod` keys (duplicated, not cadence-dependent).
- Savings badges appear on **all four** cadences (explicit user override of the source brief, which recommended against badging 3-Month). The 3-Month badge must use non-percentage copy (`"Seat included"`) — not a `~1%` claim — to avoid the false-advertising risk the brief flagged. 6-Month and Annual use `~14% savings` / `~17% savings`.
- This plan does **not** touch the `payment_leads` DB schema, any Supabase migration, or app-side (`app.slateone.studio`) signup/billing logic. Leads captured with `billing_period=3month` or `billing_period=6month` will need backend support before this ships to production — out of scope here, tracked as a follow-up.
- No test runner or linter is configured in this repo (confirmed via `package.json` — only `dev`/`build`/`preview` scripts). Verification steps use `npx tsc --noEmit` for type safety and manual dev-server checks for visual/behavioral correctness in place of automated tests.

---

### Task 1: Widen `BillingPeriod` and fix `TIER_PRICE` in `lib/supabase.ts`

**Files:**
- Modify: `lib/supabase.ts:94-110`

**Interfaces:**
- Produces: `export type BillingPeriod = 'monthly' | '3month' | '6month' | 'annual';` — consumed by Task 2 (`Pricing.tsx`) and Task 3 (`TierSelectionModal.tsx`).
- Produces: `TIER_PRICE` now has real values for `3month`/`6month` on `tier_2` (previously missing, which silently fell back to the monthly rate for analytics).

- [ ] **Step 1: Update the type and comment block**

Replace `lib/supabase.ts:94-103`:

```ts
// ── Pricing tiers (2026-07) ──────────────────────────────────────────────
// tier_1 = Pay-Per-Breakdown (R2,250 per breakdown)
// tier_2 = Team License (R1,850/mo + R250/seat/mo, or R18,500/yr +
//          R2,500/seat/yr billed annually — 2 months free vs. monthly)
// The landing page captures the email as a lead, then redirects to the app
// signup page. The app backend maps the `plan` query param to the full
// signup_plan id (tier_1_pay_per_breakdown / tier_2_team), and the
// `billing_period` param (monthly/annual) selects the rate.
export type PricingTier = 'tier_1' | 'tier_2';
export type BillingPeriod = 'monthly' | 'annual';
```

with:

```ts
// ── Pricing tiers (2026-08) ──────────────────────────────────────────────
// tier_1 = Pay-Per-Breakdown (R2,250 per breakdown)
// tier_2 = Team License, 4 cadences, each bundling included seats:
//   monthly  R1,850  / 0 included seats / extra seat R250/mo
//   3month   R5,500  / 1 included seat  / extra seat R750 flat
//   6month   R9,500  / 2 included seats / extra seat R1,500 flat
//   annual   R18,500 / 3 included seats / extra seat R3,000 flat
// Extra seats never discount — always the R250/seat/month equivalent.
// The landing page captures the email as a lead, then redirects to the app
// signup page. The app backend maps the `plan` query param to the full
// signup_plan id (tier_1_pay_per_breakdown / tier_2_team), and the
// `billing_period` param (monthly/3month/6month/annual) selects the rate.
export type PricingTier = 'tier_1' | 'tier_2';
export type BillingPeriod = 'monthly' | '3month' | '6month' | 'annual';
```

- [ ] **Step 2: Update `TIER_PRICE` to cover all 4 cadences**

Replace `lib/supabase.ts:105-110`:

```ts
// Headline ZAR amount stored on the lead for analytics (not a charge here).
// tier_1 has no billing period; tier_2 varies by monthly vs. annual billing.
const TIER_PRICE: Record<PricingTier, Partial<Record<BillingPeriod, number>>> = {
  tier_1: { monthly: 2250 },
  tier_2: { monthly: 1850, annual: 18500 },
};
```

with:

```ts
// Headline ZAR amount stored on the lead for analytics (not a charge here).
// tier_1 has no billing period; tier_2 varies by cadence.
const TIER_PRICE: Record<PricingTier, Partial<Record<BillingPeriod, number>>> = {
  tier_1: { monthly: 2250 },
  tier_2: { monthly: 1850, '3month': 5500, '6month': 9500, annual: 18500 },
};
```

- [ ] **Step 3: Verify types compile**

Run: `cd /Users/thecasterymedia/slateone && npx tsc --noEmit`
Expected: FAILS at this point — `components/Pricing.tsx` and `components/TierSelectionModal.tsx` still reference the old 2-key `Record<BillingPeriod, ...>` shape and will now be missing `'3month'`/`'6month'` keys. This confirms the type change took effect; Tasks 2 and 3 fix the resulting errors.

- [ ] **Step 4: Commit**

```bash
git add lib/supabase.ts
git commit -m "feat: widen BillingPeriod to 4 cadences and fix TIER_PRICE fallback

Adds 3month/6month to the type and TIER_PRICE map ahead of the Pricing.tsx
and TierSelectionModal.tsx updates that consume them."
```

---

### Task 2: Update `Pricing.tsx` tier config and card UI

**Files:**
- Modify: `components/Pricing.tsx` (full file — config block `1-95`, header intro `112-124`, tier card render `136-230`)

**Interfaces:**
- Consumes: `BillingPeriod` from `lib/supabase.ts` (Task 1) — now `'monthly' | '3month' | '6month' | 'annual'`.
- Produces: no exports change; `TierSelectionModal` (Task 3) still receives `billingPeriod` as a `BillingPeriod` prop from this component's existing `useState<BillingPeriod>('annual')` — unchanged wiring.

- [ ] **Step 1: Replace the `BillingVariant` interface and add cadence constants**

Replace `components/Pricing.tsx:13-18`:

```ts
interface BillingVariant {
  price: string;
  priceUnit: string;
  priceNote: string;
  savingsBadge?: string;
}
```

with:

```ts
interface BillingVariant {
  price: string;
  priceUnit: string;
  includedSeats: number;
  seatPrice: string;
  seatPriceUnit: string;
  savingsBadge?: string;
}

const CADENCES: BillingPeriod[] = ['monthly', '3month', '6month', 'annual'];

const CADENCE_LABELS: Record<BillingPeriod, string> = {
  monthly: 'Monthly',
  '3month': '3-Month',
  '6month': '6-Month',
  annual: 'Annual',
};

const CADENCE_HEADLINES: Record<BillingPeriod, string> = {
  monthly: 'R1,850/month — extra seats R250/mo each',
  '3month': 'R5,500 for 3 months — you + 1 teammate included',
  '6month': 'R9,500 for 6 months — your 3-person crew included',
  annual: 'R18,500/year — your whole 4-person team included',
};
```

- [ ] **Step 2: Update `TierConfig` and the `TIERS` array's `tier_2` billing block**

Replace `components/Pricing.tsx:20-34` (the `TierConfig` interface):

```ts
interface TierConfig {
  id: PricingTier;
  badge: string;
  name: string;
  price: string;
  priceUnit: string;
  priceNote?: string;
  billing?: Record<BillingPeriod, BillingVariant>;
  tagline: string;
  features: string[];
  footnote?: string;
  teamsBand?: TeamsBand;
  cta: string;
  highlighted?: boolean;
}
```

Keep this as-is (the shape is unchanged — `billing?: Record<BillingPeriod, BillingVariant>` already picks up the wider `BillingPeriod` automatically). No edit needed here; move to Step 3.

- [ ] **Step 3: Replace the `tier_2` entry's `billing` block**

Replace `components/Pricing.tsx:56-94` (the full `tier_2` object in `TIERS`):

```ts
  {
    id: 'tier_2',
    badge: 'Crew',
    name: 'Team License',
    price: 'R1,850',
    priceUnit: '/ month',
    priceNote: '+ R250 per seat / mo',
    billing: {
      monthly: {
        price: 'R1,850',
        priceUnit: '/ month',
        priceNote: '+ R250 per seat / mo',
      },
      annual: {
        price: 'R18,500',
        priceUnit: '/ year',
        priceNote: '+ R2,500 per seat / yr',
        savingsBadge: '2 months free',
      },
    },
    tagline: 'Unlimited breakdowns for your whole crew.',
    features: [
      'Everything in Solo, plus unlimited breakdowns included',
    ],
    teamsBand: {
      eyebrow: 'One Source of Truth',
      headline: 'Your whole crew, one breakdown.',
      line: 'No more emailing spreadsheets — everyone works off the same live breakdown.',
      features: [
        'Invite crew members',
        'Department workspaces',
        'Cross-department threads',
        'Item tracking & notes',
        'Team access control',
      ],
    },
    cta: 'Get Started',
    highlighted: true,
  },
```

with:

```ts
  {
    id: 'tier_2',
    badge: 'Crew',
    name: 'Team License',
    price: 'R1,850',
    priceUnit: '/ month',
    billing: {
      monthly: {
        price: 'R1,850',
        priceUnit: '/ month',
        includedSeats: 0,
        seatPrice: 'R250',
        seatPriceUnit: '/ mo',
      },
      '3month': {
        price: 'R5,500',
        priceUnit: '/ 3 months',
        includedSeats: 1,
        seatPrice: 'R750',
        seatPriceUnit: 'flat',
        savingsBadge: 'Seat included',
      },
      '6month': {
        price: 'R9,500',
        priceUnit: '/ 6 months',
        includedSeats: 2,
        seatPrice: 'R1,500',
        seatPriceUnit: 'flat',
        savingsBadge: '~14% savings',
      },
      annual: {
        price: 'R18,500',
        priceUnit: '/ year',
        includedSeats: 3,
        seatPrice: 'R3,000',
        seatPriceUnit: 'flat',
        savingsBadge: '~17% savings',
      },
    },
    tagline: 'Unlimited breakdowns for your whole crew.',
    features: [
      'Everything in Solo, plus unlimited breakdowns included',
    ],
    teamsBand: {
      eyebrow: 'One Source of Truth',
      headline: 'Your whole crew, one breakdown.',
      line: 'No more emailing spreadsheets — everyone works off the same live breakdown.',
      features: [
        'Invite crew members',
        'Department workspaces',
        'Cross-department threads',
        'Item tracking & notes',
        'Team access control',
      ],
    },
    cta: 'Get Started',
    highlighted: true,
  },
```

Note: `priceNote` is dropped from the top-level `tier_2` object (it's no longer used — the per-cadence table replaces the old always-visible "+ R250 per seat / mo" line). `tier_1` (Solo) keeps its existing top-level `price`/`priceUnit` fields untouched since it has no `billing` block.

- [ ] **Step 4: Update the page-intro paragraph**

Replace `components/Pricing.tsx:116-120`:

```tsx
            <p className="text-lg text-slate-400 leading-relaxed mb-6">
              Pay per breakdown when you need it, or license your whole
              team for the year. Uploading and editing scripts is always
              free &mdash; you only pay when you run a breakdown.
            </p>
```

with:

```tsx
            <p className="text-lg text-slate-400 leading-relaxed mb-6">
              Pay per breakdown when you need it, or license your whole
              team on a term that fits. Uploading and editing scripts is
              always free &mdash; you only pay when you run a breakdown.
            </p>
```

- [ ] **Step 5: Replace the billing toggle + price display block with the comparison table**

Replace `components/Pricing.tsx:171-228` (the full block from the `{tier.billing && (...)}` toggle through the closing of the price-display ternary, i.e. everything between the badge `<span>` closing and `<p className="text-slate-400 text-sm mt-3">{tier.tagline}</p>`) — this spans from just after the `badge` span to just before the tagline paragraph:

```tsx
                    {tier.billing && (
                      <div className="inline-flex items-center bg-slate-900 border border-slate-700 rounded-full p-0.5 text-[11px] font-mono">
                        <button
                          type="button"
                          onClick={() => setBillingPeriod('monthly')}
                          className={`px-3 py-1 rounded-full transition-colors ${
                            billingPeriod === 'monthly'
                              ? 'bg-amber-500 text-slate-900 font-bold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Monthly
                        </button>
                        <button
                          type="button"
                          onClick={() => setBillingPeriod('annual')}
                          className={`px-3 py-1 rounded-full transition-colors ${
                            billingPeriod === 'annual'
                              ? 'bg-amber-500 text-slate-900 font-bold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Annual
                        </button>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-50 mb-4">{tier.name}</h3>

                  {tier.billing?.annual?.savingsBadge && billingPeriod === 'annual' && (
                    <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded mb-3">
                      {tier.billing.annual.savingsBadge}
                    </span>
                  )}

                  {displayNote ? (
                    <div className="space-y-2 mb-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">License</span>
                        <span className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-slate-50">{displayPrice}</span>
                          <span className="text-sm text-slate-500 font-mono">{displayUnit}</span>
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between gap-2 pt-2 border-t border-dashed border-slate-700">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">+ Seats</span>
                        <span className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-amber-500">{displayNote.replace('+ ', '')}</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-5xl font-bold text-slate-50">{displayPrice}</span>
                      <span className="text-base text-slate-500 font-mono">{displayUnit}</span>
                    </div>
                  )}
                  <p className="text-slate-400 text-sm mt-3">{tier.tagline}</p>
```

with:

```tsx
                  </div>

                  <h3 className="text-xl font-bold text-slate-50 mb-4">{tier.name}</h3>

                  {tier.billing ? (
                    <div className="mb-1">
                      <p className="text-lg font-bold text-slate-50 mb-4">
                        {CADENCE_HEADLINES[billingPeriod]}
                      </p>
                      <div className="overflow-hidden rounded-lg border border-slate-700">
                        <table className="w-full text-left text-[13px] font-mono">
                          <thead>
                            <tr className="bg-slate-900 text-slate-500 uppercase tracking-wider text-[10px]">
                              <th className="px-3 py-2 font-bold">Cadence</th>
                              <th className="px-3 py-2 font-bold">Price</th>
                              <th className="px-3 py-2 font-bold">Included</th>
                              <th className="px-3 py-2 font-bold">Extra seat</th>
                            </tr>
                          </thead>
                          <tbody>
                            {CADENCES.map((cadence) => {
                              const variant = tier.billing![cadence];
                              const isActive = billingPeriod === cadence;
                              return (
                                <tr
                                  key={cadence}
                                  onClick={() => setBillingPeriod(cadence)}
                                  className={`cursor-pointer border-t border-slate-700 transition-colors ${
                                    isActive ? 'bg-amber-500/10' : 'hover:bg-slate-700/40'
                                  }`}
                                >
                                  <td className={`px-3 py-2.5 font-bold ${isActive ? 'text-amber-500' : 'text-slate-300'}`}>
                                    {CADENCE_LABELS[cadence]}
                                  </td>
                                  <td className="px-3 py-2.5 text-slate-50">{variant.price}</td>
                                  <td className="px-3 py-2.5 text-slate-400">
                                    {variant.includedSeats > 0
                                      ? `${variant.includedSeats} seat${variant.includedSeats > 1 ? 's' : ''}`
                                      : '—'}
                                    {variant.savingsBadge && (
                                      <span className="ml-2 inline-block text-[9px] font-bold uppercase tracking-wide text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded align-middle">
                                        {variant.savingsBadge}
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-3 py-2.5 text-slate-400">
                                    {variant.seatPrice} {variant.seatPriceUnit}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <p className="text-[12px] text-slate-500 mt-3">
                        Need more? Extra seats are a flat R250/month, no matter which
                        plan — simple math, no surprises.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-5xl font-bold text-slate-50">{tier.price}</span>
                      <span className="text-base text-slate-500 font-mono">{tier.priceUnit}</span>
                    </div>
                  )}
                  <p className="text-slate-400 text-sm mt-3">{tier.tagline}</p>
```

- [ ] **Step 6: Remove the now-unused `variant`/`displayPrice`/`displayUnit`/`displayNote` derivation**

Replace `components/Pricing.tsx:136-142`:

```tsx
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch">
            {TIERS.map((tier) => {
              const variant = tier.billing?.[billingPeriod];
              const displayPrice = variant?.price ?? tier.price;
              const displayUnit = variant?.priceUnit ?? tier.priceUnit;
              const displayNote = variant?.priceNote ?? tier.priceNote;

              return (
```

with:

```tsx
          <div className="grid md:grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-6 max-w-6xl mx-auto items-stretch">
            {TIERS.map((tier) => {
              return (
```

This widens the grid so the Team License card (now carrying a 4-row table) gets more horizontal room than Solo, per the design doc's §2.6 layout note — Solo takes the narrower column, Team License the wider one. Since `TIERS[0]` is Solo and `TIERS[1]` is Team License, the grid-template-columns order matches automatically.

- [ ] **Step 7: Verify types compile**

Run: `cd /Users/thecasterymedia/slateone && npx tsc --noEmit`
Expected: Errors remaining should now only reference `components/TierSelectionModal.tsx` (Task 3 not yet done). No errors should reference `components/Pricing.tsx`.

- [ ] **Step 8: Manual visual check**

Run: `cd /Users/thecasterymedia/slateone && npm run dev`

Open the printed local URL, scroll to the Pricing section, and verify:
- The Team License card shows a 4-row table (Monthly/3-Month/6-Month/Annual) instead of a 2-button toggle.
- Clicking each row updates the highlighted row (amber background) and the headline above the table.
- Annual is selected by default on page load (matches the existing `useState<BillingPeriod>('annual')`).
- All four rows show a savings-related badge (3-Month shows "Seat included", not a percentage).
- The footnote about flat R250/mo extra seats appears below the table.
- The Solo card is unaffected (still shows R2,250/breakdown, no table).

Stop the dev server (Ctrl+C) once confirmed.

- [ ] **Step 9: Commit**

```bash
git add components/Pricing.tsx
git commit -m "feat: replace Team License 2-cadence toggle with 4-cadence table

Monthly/3-Month/6-Month/Annual rows each show included seats and flat
extra-seat pricing, with a dynamic headline and footnote per the
2026-08-03 pricing design spec."
```

---

### Task 3: Update `TierSelectionModal.tsx` for 4 cadences

**Files:**
- Modify: `components/TierSelectionModal.tsx:12-54` (interface + `TIER_DETAILS`), `components/TierSelectionModal.tsx:120-132` (price block render)

**Interfaces:**
- Consumes: `BillingPeriod` from `lib/supabase.ts` (Task 1); `billingPeriod` prop passed from `Pricing.tsx` (Task 2), already wired via `<TierSelectionModal billingPeriod={billingPeriod} />` at `components/Pricing.tsx:324` — unchanged.
- Produces: no exports change.

- [ ] **Step 1: Add `includedSeats` to `TierDetail`**

Replace `components/TierSelectionModal.tsx:12-19`:

```ts
interface TierDetail {
  name: string;
  tagline: string;
  priceLabel: string;
  price: string;
  seatLabel?: string;
  seatPrice?: string;
}
```

with:

```ts
interface TierDetail {
  name: string;
  tagline: string;
  priceLabel: string;
  price: string;
  includedSeats?: number;
  seatLabel?: string;
  seatPrice?: string;
}
```

- [ ] **Step 2: Replace `TIER_DETAILS` with the 4-cadence version**

Replace `components/TierSelectionModal.tsx:21-54`:

```ts
const TIER_DETAILS: Record<PricingTier, Record<BillingPeriod, TierDetail>> = {
  tier_1: {
    monthly: {
      name: 'Pay-Per-Breakdown',
      tagline: 'Unlimited uploads · Pay only when you run a breakdown',
      priceLabel: 'Per breakdown',
      price: 'R2,250',
    },
    annual: {
      name: 'Pay-Per-Breakdown',
      tagline: 'Unlimited uploads · Pay only when you run a breakdown',
      priceLabel: 'Per breakdown',
      price: 'R2,250',
    },
  },
  tier_2: {
    monthly: {
      name: 'Team License',
      tagline: 'Unlimited breakdowns · Full team collaboration',
      priceLabel: 'Monthly license',
      price: 'R1,850/mo',
      seatLabel: '+ Per seat',
      seatPrice: 'R250/mo',
    },
    annual: {
      name: 'Team License',
      tagline: 'Unlimited breakdowns · Full team collaboration',
      priceLabel: 'Annual license (2 months free)',
      price: 'R18,500/yr',
      seatLabel: '+ Per seat',
      seatPrice: 'R2,500/yr',
    },
  },
};
```

with:

```ts
const SOLO_DETAIL: TierDetail = {
  name: 'Pay-Per-Breakdown',
  tagline: 'Unlimited uploads · Pay only when you run a breakdown',
  priceLabel: 'Per breakdown',
  price: 'R2,250',
};

const TIER_DETAILS: Record<PricingTier, Record<BillingPeriod, TierDetail>> = {
  tier_1: {
    monthly: SOLO_DETAIL,
    '3month': SOLO_DETAIL,
    '6month': SOLO_DETAIL,
    annual: SOLO_DETAIL,
  },
  tier_2: {
    monthly: {
      name: 'Team License',
      tagline: 'Unlimited breakdowns · Full team collaboration',
      priceLabel: 'Monthly license',
      price: 'R1,850/mo',
      includedSeats: 0,
      seatLabel: '+ Extra seat',
      seatPrice: 'R250/mo',
    },
    '3month': {
      name: 'Team License',
      tagline: 'Unlimited breakdowns · Full team collaboration',
      priceLabel: '3-month license',
      price: 'R5,500 / 3mo',
      includedSeats: 1,
      seatLabel: '+ Extra seat',
      seatPrice: 'R750 flat',
    },
    '6month': {
      name: 'Team License',
      tagline: 'Unlimited breakdowns · Full team collaboration',
      priceLabel: '6-month license',
      price: 'R9,500 / 6mo',
      includedSeats: 2,
      seatLabel: '+ Extra seat',
      seatPrice: 'R1,500 flat',
    },
    annual: {
      name: 'Team License',
      tagline: 'Unlimited breakdowns · Full team collaboration',
      priceLabel: 'Annual license (2 months free)',
      price: 'R18,500/yr',
      includedSeats: 3,
      seatLabel: '+ Extra seat',
      seatPrice: 'R3,000 flat',
    },
  },
};
```

(`SOLO_DETAIL` is a single shared object reused across all 4 keys — Solo has no cadence-dependent pricing, matching the design doc's note in §3 that its 4 keys are intentional duplicates.)

- [ ] **Step 3: Add the "Includes N seats" row to the price block**

Replace `components/TierSelectionModal.tsx:120-132`:

```tsx
        {/* Price */}
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-4 mb-6 divide-y divide-slate-600/70">
          <div className="flex items-center justify-between pb-3">
            <span className="text-sm text-slate-300">{details.priceLabel}</span>
            <span className="text-lg font-bold text-slate-50">{details.price}</span>
          </div>
          {details.seatLabel && details.seatPrice && (
            <div className="flex items-center justify-between pt-3">
              <span className="text-sm text-slate-300">{details.seatLabel}</span>
              <span className="text-lg font-bold text-amber-500">{details.seatPrice}</span>
            </div>
          )}
        </div>
```

with:

```tsx
        {/* Price */}
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-4 mb-6 divide-y divide-slate-600/70">
          <div className="flex items-center justify-between pb-3">
            <span className="text-sm text-slate-300">{details.priceLabel}</span>
            <span className="text-lg font-bold text-slate-50">{details.price}</span>
          </div>
          {typeof details.includedSeats === 'number' && (
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-slate-300">Includes</span>
              <span className="text-sm font-bold text-slate-200">
                {details.includedSeats > 0
                  ? `${details.includedSeats} seat${details.includedSeats > 1 ? 's' : ''}`
                  : 'No seats'}
              </span>
            </div>
          )}
          {details.seatLabel && details.seatPrice && (
            <div className="flex items-center justify-between pt-3">
              <span className="text-sm text-slate-300">{details.seatLabel}</span>
              <span className="text-lg font-bold text-amber-500">{details.seatPrice}</span>
            </div>
          )}
        </div>
```

- [ ] **Step 4: Verify types compile**

Run: `cd /Users/thecasterymedia/slateone && npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 5: Manual visual check**

Run: `cd /Users/thecasterymedia/slateone && npm run dev`

On the Pricing section, click each of the 4 rows in the Team License table, then click "Get Started" on the Team License card for each. Verify the modal shows:
- Correct `priceLabel`/`price` for the selected cadence.
- An "Includes" row showing the right seat count (0/1/2/3), reading "No seats" for Monthly.
- The correct flat extra-seat price (`R250/mo`, `R750 flat`, `R1,500 flat`, `R3,000 flat`).

Also click "Get Started" on the Solo card and verify it still shows `R2,250` per breakdown with no "Includes" row.

Stop the dev server (Ctrl+C) once confirmed.

- [ ] **Step 6: Commit**

```bash
git add components/TierSelectionModal.tsx
git commit -m "feat: show 4-cadence pricing detail in the signup modal

TIER_DETAILS.tier_2 now covers monthly/3month/6month/annual with
included-seat counts; the modal price block gained an Includes row."
```

---

### Task 4: Full production build check

**Files:** none (verification-only task)

- [ ] **Step 1: Run a full production build**

Run: `cd /Users/thecasterymedia/slateone && npm run build`
Expected: Build succeeds with no errors (Vite build does not type-check by default, so this is a smoke test that nothing throws at bundle time — Tasks 1–3's `tsc --noEmit` steps are the actual type-safety gate).

- [ ] **Step 2: Preview the production build**

Run: `cd /Users/thecasterymedia/slateone && npm run preview`

Open the printed local URL and repeat the Pricing-section checks from Task 2 Step 8 and Task 3 Step 5 against the production build (table renders, row clicks update headline/highlight, modal shows correct per-cadence detail). Stop the preview server (Ctrl+C) once confirmed.

- [ ] **Step 3: Note the outstanding backend follow-up**

No code change in this step — a reminder for whoever picks this up next: per the Global Constraints section, `payment_leads.billing_period` and the app-side (`app.slateone.studio`) signup mapping do not yet understand `3month`/`6month`. Leads captured under those cadences will need that follow-up work before this pricing page should be treated as fully production-ready end-to-end, even though the landing-page UI itself is complete and correct after this plan.

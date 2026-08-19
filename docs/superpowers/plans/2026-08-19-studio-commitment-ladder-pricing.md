# Studio Commitment-Ladder Pricing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the landing page's Team License pricing (one card with a
4-cadence selector table) into a 4-card "commitment ladder" — Project, Studio 3,
Studio 6, Studio 12 — with no price changes, and propagate the new names/cadence
structure through the modal, TOS, and marketing/FAQ docs.

**Architecture:** `lib/supabase.ts` narrows `BillingPeriod` from 4 values to 3
(drops the no-commitment `monthly` cadence). `components/Pricing.tsx` and
`components/TierSelectionModal.tsx` both currently keep their own separate
tier-config data (this duplication already exists today and this plan does not
remove it) — each gets restructured from "one Team License entry with a nested
per-cadence table" into a flat list of 4 standalone card/detail configs. Copy in
`TermsOfService.tsx`, `docs/marketing-reference.md`, `components/FAQ.tsx`, and
`docs/landing-faq.md` is updated to match the new names and drop `monthly`
cadence mentions.

**Tech Stack:** Vite + React 19 + TypeScript, Tailwind via CDN (no
`tailwind.config.js` — theme lives in `index.html`), no test suite, no linter
(per `CLAUDE.md`).

**Spec:** `docs/superpowers/specs/2026-08-19-studio-commitment-ladder-pricing-design.md`

## Global Constraints

- No price changes: Project stays R2,250/breakdown; Studio 3/6/12 stay
  R5,500/R9,500/R18,500 totals with 1/2/3 included seats and R250/mo-equivalent
  extra seats.
- No new backend/PayFast work. `tier_2` internal id and `billing_period` values
  `3month`/`6month`/`annual` are unchanged — only `monthly` is removed.
- No new Tailwind theme colors. Use only existing tokens (`charcoal`, `neon`,
  `cyan`, `paper`, `slate-black`, `soft-grey` plus the `slate-*`/`amber-*`
  utility classes already used throughout `Pricing.tsx`).
- Effective-monthly figures are computed from `priceZAR / months` in code, never
  hand-typed, so they can't drift out of sync with the totals.
- Out of scope: `docs/app-repo-handoff-pricing.md`, `docs/pitch-deck.md`,
  `public/TERMS OF SERVICE FOR SLATEONE STUDIO.md` — already stale with older
  R450/R150 numbers (pre-existing, tracked in `BACKLOG.md`); this plan only adds
  one more line there, it does not fix those files.

---

## Task 1: Narrow `BillingPeriod` and drop the `monthly` cadence in `lib/supabase.ts`

**Files:**
- Modify: `lib/supabase.ts:94-114`

**Interfaces:**
- Consumes: nothing new.
- Produces: `BillingPeriod = '3month' | '6month' | 'annual'` (was 4 values,
  now 3) — every later task that imports `BillingPeriod` from this file relies
  on the narrowed type to catch any remaining `'monthly'` reference at compile
  time. `TIER_PRICE.tier_2` no longer has a `monthly` key. `createPricingLead`'s
  default cadence becomes `'annual'` instead of `'monthly'`.

- [ ] **Step 1: Update the header comment block**

Replace lines 94-105:

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
```

with:

```ts
// ── Pricing tiers (2026-08) ──────────────────────────────────────────────
// tier_1 = Project (R2,250 per breakdown, one-off)
// tier_2 = Studio commitment ladder, 3 fixed-term cadences, each bundling
// included seats (no month-to-month option):
//   3month   R5,500  / 1 included seat  / extra seat R750 flat
//   6month   R9,500  / 2 included seats / extra seat R1,500 flat
//   annual   R18,500 / 3 included seats / extra seat R3,000 flat
// Extra seats never discount — always the R250/seat/month equivalent.
// The landing page captures the email as a lead, then redirects to the app
// signup page. The app backend maps the `plan` query param to the full
// signup_plan id (tier_1_pay_per_breakdown / tier_2_team), and the
// `billing_period` param (3month/6month/annual) selects the rate.
```

- [ ] **Step 2: Narrow the `BillingPeriod` type**

Replace line 107:

```ts
export type BillingPeriod = 'monthly' | '3month' | '6month' | 'annual';
```

with:

```ts
export type BillingPeriod = '3month' | '6month' | 'annual';
```

- [ ] **Step 3: Drop `monthly` from `TIER_PRICE` and update the default cadence**

Replace lines 111-114:

```ts
const TIER_PRICE: Record<PricingTier, Partial<Record<BillingPeriod, number>>> = {
  tier_1: { monthly: 2250 },
  tier_2: { monthly: 1850, '3month': 5500, '6month': 9500, annual: 18500 },
};
```

with:

```ts
const TIER_PRICE: Record<PricingTier, Partial<Record<BillingPeriod, number>>> = {
  tier_1: { annual: 2250 },
  tier_2: { '3month': 5500, '6month': 9500, annual: 18500 },
};
```

`tier_1` keeps a single flat price regardless of cadence; storing it under the
`annual` key (rather than a since-removed `monthly` key) is arbitrary — it's
never read by cadence for `tier_1`, only as the fallback in Step 4 below. Any
`BillingPeriod` key would work; `annual` is chosen for consistency with the
modal's default.

- [ ] **Step 4: Update `createPricingLead`'s default cadence and fallback**

In `createPricingLead` (around line 129):

```ts
const billingPeriod = leadData.billingPeriod || 'monthly';
```

becomes:

```ts
const billingPeriod = leadData.billingPeriod || 'annual';
```

And the fallback lookup at line 143:

```ts
tier_price: TIER_PRICE[leadData.tier][billingPeriod] ?? TIER_PRICE[leadData.tier].monthly,
```

becomes:

```ts
tier_price: TIER_PRICE[leadData.tier][billingPeriod] ?? TIER_PRICE[leadData.tier].annual,
```

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: Errors in `components/Pricing.tsx` and `components/TierSelectionModal.tsx`
referencing the now-removed `'monthly'` `BillingPeriod` value — this confirms
the type narrowing is doing its job and correctly flags every place Task 2 and
Task 3 need to fix. If `tsc` reports zero errors, stop and check whether the
type change actually applied (dependent tasks would then be uncaught bugs, not
missing work).

- [ ] **Step 6: Commit**

```bash
git add lib/supabase.ts
git commit -m "feat: drop no-commitment monthly cadence from BillingPeriod"
```

---

## Task 2: Rebuild `components/Pricing.tsx` as a 4-card ladder

**Files:**
- Modify: `components/Pricing.tsx` (full rewrite of the tier data and Section 2
  layout; Section 1 header copy and Section 3 "Who This Is For" are lightly
  edited, not rewritten)

**Interfaces:**
- Consumes: `BillingPeriod`, `PricingTier` from `lib/supabase.ts` (Task 1).
- Produces: no new exports — `Pricing` remains the default section component
  mounted in `App.tsx`, unchanged import surface. `TierSelectionModal` is
  invoked the same way (`tier` + `billingPeriod` props), just fed from the new
  card data shape instead of the old `TIERS`/`billingPeriod`-toggle state.

- [ ] **Step 1: Replace the full file content**

Write `components/Pricing.tsx`:

```tsx
import React, { useState } from 'react';
import { Check, Users } from 'lucide-react';
import { TierSelectionModal } from './TierSelectionModal';
import { BillingPeriod, PricingTier } from '../lib/supabase';

const CADENCE_MONTHS: Record<BillingPeriod, number> = {
  '3month': 3,
  '6month': 6,
  annual: 12,
};

function formatZAR(amount: number): string {
  return `R${amount.toLocaleString('en-ZA')}`;
}

function effectiveMonthlyLabel(totalZAR: number, cadence: BillingPeriod): string {
  const months = CADENCE_MONTHS[cadence];
  return `${formatZAR(Math.round(totalZAR / months))}/mo effective`;
}

interface CollaborationBand {
  eyebrow: string;
  headline: string;
  line: string;
  features: string[];
}

interface LadderCard {
  key: string;
  tier: PricingTier;
  billingPeriod: BillingPeriod;
  badge: string;
  name: string;
  priceZAR: number;
  priceUnit: string;
  effectiveMonthly?: string;
  includedSeats?: number;
  seatPriceLabel?: string;
  tagline: string;
  features: string[];
  footnote?: string;
  cta: string;
  accent: 'neutral' | 'cyan' | 'amber';
  badgeRibbon?: string;
}

const CARDS: LadderCard[] = [
  {
    key: 'project',
    tier: 'tier_1',
    billingPeriod: 'annual',
    badge: 'Project',
    name: 'Project',
    priceZAR: 2250,
    priceUnit: '/ breakdown',
    tagline: 'For individual filmmakers. Pay only when you run a breakdown.',
    features: [
      'Unlimited script uploads',
      'Scene detection & parsing — free',
      'Full breakdown extraction (cast, props, wardrobe, vehicles, SFX & more)',
      'Scene & story-day management',
      'Narrative & scene intelligence',
      'Zoomable stripboard scheduling',
      'All production reports & exports',
    ],
    footnote: 'Just you — no crew collaboration.',
    cta: 'Get Started',
    accent: 'neutral',
  },
  {
    key: 'studio_3',
    tier: 'tier_2',
    billingPeriod: '3month',
    badge: 'Studio 3',
    name: 'Studio 3',
    priceZAR: 5500,
    priceUnit: '/ 3 months',
    effectiveMonthly: effectiveMonthlyLabel(5500, '3month'),
    includedSeats: 1,
    seatPriceLabel: 'R250 / mo',
    tagline: '3-month commitment. You + 1 teammate included.',
    features: ['Everything in Project, plus unlimited breakdowns included'],
    cta: 'Get Started',
    accent: 'neutral',
  },
  {
    key: 'studio_6',
    tier: 'tier_2',
    billingPeriod: '6month',
    badge: 'Studio 6',
    name: 'Studio 6',
    priceZAR: 9500,
    priceUnit: '/ 6 months',
    effectiveMonthly: effectiveMonthlyLabel(9500, '6month'),
    includedSeats: 2,
    seatPriceLabel: 'R250 / mo',
    tagline: '6-month commitment. Your 3-person crew included.',
    features: ['Everything in Project, plus unlimited breakdowns included'],
    cta: 'Get Started',
    accent: 'cyan',
  },
  {
    key: 'studio_12',
    tier: 'tier_2',
    billingPeriod: 'annual',
    badge: 'Studio 12',
    name: 'Studio 12',
    priceZAR: 18500,
    priceUnit: '/ year',
    effectiveMonthly: effectiveMonthlyLabel(18500, 'annual'),
    includedSeats: 3,
    seatPriceLabel: 'R250 / mo',
    tagline: '12-month commitment. Your whole 4-person team included.',
    features: ['Everything in Project, plus unlimited breakdowns included'],
    cta: 'Get Started',
    accent: 'amber',
    badgeRibbon: 'Best Value',
  },
];

const COLLABORATION_BAND: CollaborationBand = {
  eyebrow: 'One Source of Truth',
  headline: 'Your whole crew, one breakdown.',
  line: 'No more emailing spreadsheets — everyone works off the same live breakdown, on any Studio plan.',
  features: [
    'Invite crew members',
    'Department workspaces',
    'Cross-department threads',
    'Item tracking & notes',
    'Team access control',
  ],
};

const ACCENT_CARD_CLASSES: Record<LadderCard['accent'], string> = {
  neutral: 'border-slate-700 bg-slate-800',
  cyan: 'border-cyan-500/30 bg-cyan-500/[0.03]',
  amber: 'border-amber-500/30 bg-amber-500/[0.03] shadow-lg',
};

const ACCENT_BADGE_CLASSES: Record<LadderCard['accent'], string> = {
  neutral: 'text-slate-400 bg-slate-700 border border-slate-600',
  cyan: 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20',
  amber: 'text-amber-500 bg-amber-500/10 border border-amber-500/20',
};

const ACCENT_CTA_CLASSES: Record<LadderCard['accent'], string> = {
  neutral: 'bg-slate-700 text-slate-50 border border-slate-600 hover:bg-slate-600',
  cyan: 'bg-slate-700 text-slate-50 border border-cyan-500/30 hover:bg-slate-600',
  amber: 'bg-amber-500 text-slate-900 hover:bg-amber-400',
};

export const Pricing: React.FC = () => {
  const [selectedCardKey, setSelectedCardKey] = useState<string | null>(null);
  const selectedCard = CARDS.find((card) => card.key === selectedCardKey) ?? null;

  return (
    <section id="pricing" className="bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ═══════════════════════════════════════════════ */}
        {/* SECTION 1: Pricing Header */}
        {/* ═══════════════════════════════════════════════ */}
        <div className="py-32 border-b border-slate-800">

          <div className="max-w-3xl mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-50 mb-6 leading-[1.1]">
              Simple Pricing.<br/>Built For How You Work.
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed mb-6">
              Pay per project when you need it, or lock in a term and bring
              your crew along. Uploading and editing scripts is always free
              &mdash; you only pay when you run a breakdown.
            </p>
            <p className="text-sm text-slate-500 font-mono">
              Prices in ZAR.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════ */}
        {/* SECTION 2: Card Ladder */}
        {/* ═══════════════════════════════════════════════ */}
        <div className="py-32 border-b border-slate-800">

          <p className="text-center text-2xl md:text-3xl font-bold text-slate-200 mb-12">
            Work solo. Or bring the whole crew.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
            {CARDS.map((card) => (
              <div
                key={card.key}
                className={`relative border rounded-2xl overflow-hidden flex flex-col ${ACCENT_CARD_CLASSES[card.accent]}`}
              >
                {card.badgeRibbon && (
                  <div className="absolute top-0 right-0 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-900 bg-amber-500 px-3 py-1 rounded-bl-lg">
                    {card.badgeRibbon}
                  </div>
                )}

                {/* Card Header */}
                <div className="p-8 border-b border-slate-700">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em] px-3 py-1 rounded inline-block mb-6 ${ACCENT_BADGE_CLASSES[card.accent]}`}
                  >
                    {card.badge}
                  </span>

                  <h3 className="text-xl font-bold text-slate-50 mb-4">{card.name}</h3>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-bold text-slate-50">{formatZAR(card.priceZAR)}</span>
                    <span className="text-base text-slate-500 font-mono">{card.priceUnit}</span>
                  </div>

                  {card.effectiveMonthly && (
                    <p className="text-[13px] text-slate-500 font-mono mt-1">{card.effectiveMonthly}</p>
                  )}

                  {typeof card.includedSeats === 'number' && (
                    <p className="text-[13px] text-slate-400 mt-3">
                      {card.includedSeats} seat{card.includedSeats > 1 ? 's' : ''} included
                      {card.seatPriceLabel && (
                        <span className="text-slate-500"> · extra seat {card.seatPriceLabel}</span>
                      )}
                    </p>
                  )}

                  <p className="text-slate-400 text-sm mt-4">{card.tagline}</p>
                </div>

                {/* Features */}
                <div className="p-8 space-y-3 flex-1">
                  {card.features.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-[14px] text-slate-400">
                      <Check className="w-4 h-4 text-amber-500/50 flex-shrink-0 mt-1" />
                      {item}
                    </div>
                  ))}

                  {card.footnote && (
                    <p className="text-[13px] text-slate-500 italic pt-2">{card.footnote}</p>
                  )}
                </div>

                {/* CTA */}
                <div className="px-8 pb-8">
                  <button
                    onClick={() => setSelectedCardKey(card.key)}
                    className={`w-full font-bold py-4 px-6 rounded-lg transition-all duration-300 text-sm cursor-pointer ${ACCENT_CTA_CLASSES[card.accent]}`}
                  >
                    {card.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Shared collaboration panel — applies to all Studio cards */}
          <div className="mt-10 max-w-4xl mx-auto rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-8">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-amber-500">
                {COLLABORATION_BAND.eyebrow}
              </span>
            </div>
            <h4 className="text-lg font-bold text-slate-50 mb-2 leading-tight">
              {COLLABORATION_BAND.headline}
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              {COLLABORATION_BAND.line}
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {COLLABORATION_BAND.features.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-[15px] text-slate-200">
                  <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-[12px] text-slate-500 mt-6">
            Need more? Extra seats are a flat R250/month on any Studio plan
            — simple math, no surprises.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════ */}
        {/* SECTION 3: Who This Is For */}
        {/* ═══════════════════════════════════════════════ */}
        <div className="py-32">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-6">Built For</p>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-50 mb-8 leading-[1.1]">
              Who This Is For
            </h3>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {['Indie filmmakers', 'Production companies', 'Studios', 'Producers', 'Line producers', 'UPMs'].map((role) => (
                <span key={role} className="text-sm text-slate-400 bg-slate-800 border border-slate-700 px-5 py-2.5 rounded-lg font-mono">
                  {role}
                </span>
              ))}
            </div>

            <p className="text-lg text-slate-400 leading-relaxed mb-2">
              If your production runs on spreadsheets and fragmented tools,
            </p>
            <p className="text-lg text-slate-200 font-medium">
              SlateOne replaces that system.
            </p>
          </div>
        </div>

      </div>

      {/* Tier Selection Modal */}
      <TierSelectionModal
        isOpen={selectedCard !== null}
        onClose={() => setSelectedCardKey(null)}
        tier={selectedCard?.tier ?? 'tier_1'}
        billingPeriod={selectedCard?.billingPeriod ?? 'annual'}
      />
    </section>
  );
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: No errors referencing `Pricing.tsx`. (Errors in `TierSelectionModal.tsx`
from Task 1's Step 5 may still be present until Task 3 lands — that's expected
at this point.)

- [ ] **Step 3: Commit**

```bash
git add components/Pricing.tsx
git commit -m "feat: rebuild pricing section as 4-card Studio commitment ladder"
```

---

## Task 3: Update `components/TierSelectionModal.tsx` for the 3-cadence ladder

**Files:**
- Modify: `components/TierSelectionModal.tsx:22-74`

**Interfaces:**
- Consumes: `BillingPeriod` (now 3 values, Task 1), `PricingTier` from
  `lib/supabase.ts`; `tier`/`billingPeriod` props as sent by
  `components/Pricing.tsx` (Task 2) — `tier_1` cards always pass
  `billingPeriod: 'annual'`, `tier_2` cards pass their real cadence.
- Produces: no change to the component's external props or exported name —
  only the internal `TIER_DETAILS` lookup table's keys/content change.

- [ ] **Step 1: Rename and trim `SOLO_DETAIL` and `TIER_DETAILS`**

Replace lines 22-74:

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

with:

```ts
const PROJECT_DETAIL: TierDetail = {
  name: 'Project',
  tagline: 'Unlimited uploads · Pay only when you run a breakdown',
  priceLabel: 'Per breakdown',
  price: 'R2,250',
};

const TIER_DETAILS: Record<PricingTier, Record<BillingPeriod, TierDetail>> = {
  tier_1: {
    '3month': PROJECT_DETAIL,
    '6month': PROJECT_DETAIL,
    annual: PROJECT_DETAIL,
  },
  tier_2: {
    '3month': {
      name: 'Studio 3',
      tagline: 'Unlimited breakdowns · Full team collaboration',
      priceLabel: '3-month commitment',
      price: 'R5,500 / 3mo',
      includedSeats: 1,
      seatLabel: '+ Extra seat',
      seatPrice: 'R750 flat',
    },
    '6month': {
      name: 'Studio 6',
      tagline: 'Unlimited breakdowns · Full team collaboration',
      priceLabel: '6-month commitment',
      price: 'R9,500 / 6mo',
      includedSeats: 2,
      seatLabel: '+ Extra seat',
      seatPrice: 'R1,500 flat',
    },
    annual: {
      name: 'Studio 12',
      tagline: 'Unlimited breakdowns · Full team collaboration',
      priceLabel: '12-month commitment',
      price: 'R18,500/yr',
      includedSeats: 3,
      seatLabel: '+ Extra seat',
      seatPrice: 'R3,000 flat',
    },
  },
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: No errors anywhere in the project — this is the last file with a
`monthly`-keyed lookup, so a clean typecheck here confirms Task 1's type
narrowing surfaced every affected site and all of them are now fixed.

- [ ] **Step 3: Commit**

```bash
git add components/TierSelectionModal.tsx
git commit -m "feat: rename modal tier details to Project/Studio 3/6/12"
```

---

## Task 4: Update pricing copy in `components/TermsOfService.tsx`

**Files:**
- Modify: `components/TermsOfService.tsx:19,21`

**Interfaces:**
- Consumes: nothing (plain template-literal copy, no props/types involved).
- Produces: nothing consumed elsewhere.

- [ ] **Step 1: Update clause 5.1(c)**

In the template literal, replace:

```
c) Share your account credentials with multiple users (unless on the Team License, where each additional team member requires a paid seat);
```

with:

```
c) Share your account credentials with multiple users (unless on a Studio plan, where each additional team member requires a paid seat);
```

- [ ] **Step 2: Update clause 6.1 and 6.2**

Replace:

```
6. PAYMENT AND CANCELLATION 6.1. The Service is offered on two plans, priced in South African Rand (ZAR): a) Pay-Per-Breakdown, charged on a pay-as-you-go basis for each breakdown you run; and b) the Team License, billed monthly or annually in advance (with a two-month discount for annual billing) plus a per-seat fee for each team member you add. 6.2. The Team License renews automatically each billing period; you may cancel at any time and access will continue until the end of the current billing period. Pay-Per-Breakdown charges are once-off and non-recurring. 6.3. Payments are processed securely by our third-party payment provider. 6.4. Refunds are handled in accordance with the Consumer Protection Act (CPA) and our Refund Policy.
```

with:

```
6. PAYMENT AND CANCELLATION 6.1. The Service is offered on two plans, priced in South African Rand (ZAR): a) Project, charged on a pay-as-you-go basis for each breakdown you run; and b) Studio, a fixed-term commitment (3, 6, or 12 months, prepaid in advance) with included seats plus a per-seat fee for each additional team member you add. 6.2. A Studio plan renews automatically at the end of its committed term; you may cancel at any time to stop the next renewal, but the current term itself is prepaid and non-refundable. Project charges are once-off and non-recurring. 6.3. Payments are processed securely by our third-party payment provider. 6.4. Refunds are handled in accordance with the Consumer Protection Act (CPA) and our Refund Policy.
```

- [ ] **Step 3: Verify no stale references remain**

Run: `grep -n "Team License\|Pay-Per-Breakdown" components/TermsOfService.tsx`
Expected: no output (both terms fully replaced in this file).

- [ ] **Step 4: Commit**

```bash
git add components/TermsOfService.tsx
git commit -m "docs: update TOS payment clause for Studio commitment ladder"
```

---

## Task 5: Update `docs/marketing-reference.md`

**Files:**
- Modify: `docs/marketing-reference.md:131,137-138,147-148,156,159`

**Interfaces:**
- Consumes: nothing (reference doc, no code).
- Produces: nothing consumed elsewhere.

- [ ] **Step 1: Update the Model paragraph (line 131)**

Replace:

```
Two tiers, priced in ZAR. Uploading and editing scripts is always free — you only pay when you run a breakdown. Individuals pay per breakdown; teams license the whole crew on a cadence that fits (monthly, 3-month, 6-month, or annual), with more seats bundled in on longer terms.
```

with:

```
Two products, priced in ZAR. Uploading and editing scripts is always free — you only pay when you run a breakdown. Individuals pay per breakdown (Project); teams commit to a fixed term (Studio 3, Studio 6, or Studio 12 months), with more seats bundled in on longer commitments.
```

- [ ] **Step 2: Update the Tiers table (lines 135-138)**

Replace:

```
| Tier | Price | Billing | Best for |
|------|-------|---------|----------|
| **Pay-Per-Breakdown** | **R2,250** / breakdown | Pay as you go | Freelancers, individual writers, small producers |
| **Team License** ⭐ | **R1,850** / month (extra seats R250/mo each) · **R5,500** / 3 months (1 seat included) · **R9,500** / 6 months (2 seats included) · **R18,500** / year (3 seats included) — extra seats always R250/mo equivalent, whichever cadence you're on | Monthly, 3-month, 6-month, or annual | Production companies, ADs, producers, department heads |
```

with:

```
| Tier | Price | Billing | Best for |
|------|-------|---------|----------|
| **Project** | **R2,250** / breakdown | Pay as you go | Freelancers, individual writers, small producers |
| **Studio 3** | **R5,500** / 3 months (1 seat included, extra seat R250/mo equivalent) | 3-month commitment | Small teams testing SlateOne |
| **Studio 6** | **R9,500** / 6 months (2 seats included, extra seat R250/mo equivalent) | 6-month commitment | Teams working across multiple projects |
| **Studio 12** ⭐ | **R18,500** / year (3 seats included, extra seat R250/mo equivalent) | 12-month commitment | Production companies using SlateOne year-round |
```

- [ ] **Step 3: Update the "Team License Adds" section heading and bullet (lines 147-148)**

Replace:

```
### Team License Adds
- Invite crew members (extra seats are a flat R250/month equivalent on every cadence — 3-month R750 flat, 6-month R1,500 flat, annual R3,000 flat — paid by the account owner)
```

with:

```
### Studio Adds
- Invite crew members (extra seats are a flat R250/month equivalent on every commitment — 3-month R750 flat, 6-month R1,500 flat, 12-month R3,000 flat — paid by the account owner)
```

- [ ] **Step 4: Update the Pricing Copy and Anti-Objection Copy blurbs (lines 155-159)**

Replace:

```
### Pricing Copy
> Upload as many scripts as you like — free. Run a breakdown when you're ready: R2,250 each, or go unlimited for your whole team on the R1,850/month Team License.

### Anti-Objection Copy
> No lock-in. Uploads and manual scene work are always free. On the Team License, one owner covers every seat, so inviting your crew is one click — no per-member checkout.
```

with:

```
### Pricing Copy
> Upload as many scripts as you like — free. Run a breakdown when you're ready: R2,250 each, or go unlimited for your whole team on a Studio commitment starting at R5,500 for 3 months.

### Anti-Objection Copy
> Uploads and manual scene work are always free, no matter which plan. On a Studio plan, one owner covers every included seat, so inviting your crew is one click — no per-member checkout.
```

- [ ] **Step 5: Verify no stale references remain**

Run: `grep -n "Team License\|Pay-Per-Breakdown\|No lock-in" docs/marketing-reference.md`
Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add docs/marketing-reference.md
git commit -m "docs: update marketing reference for Studio commitment ladder"
```

---

## Task 6: Update `components/FAQ.tsx` and `docs/landing-faq.md`

**Files:**
- Modify: `components/FAQ.tsx:198-297`
- Modify: `docs/landing-faq.md:97-125`

**Interfaces:**
- Consumes: nothing (both are static content, no shared types).
- Produces: nothing consumed elsewhere. These two files intentionally mirror
  each other's content (per `CLAUDE.md`, `landing-faq.md` was the draft;
  `FAQ.tsx` is the shipped version) — keep them in sync in this task.

- [ ] **Step 1: Update `components/FAQ.tsx` "How much does SlateOne cost?" answer**

Replace the JSX block from `<p className="mb-4">` (line 201) through the
closing `</>` (line 253) — i.e. everything between the opening
`answer: (` and the next `),` — with:

```tsx
          <>
            <p className="mb-4">
              Uploading and editing scripts is always free — you only pay when you run a
              breakdown. Two ways to pay for that, priced in ZAR:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Project — R2,250 per breakdown. For individual filmmakers working solo; no crew collaboration.</li>
              <li>Studio — unlimited breakdowns for your whole crew, on a fixed-term commitment:</li>
            </ul>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="py-2 pr-4 text-slate-50 font-semibold">Plan</th>
                    <th className="py-2 pr-4 text-slate-50 font-semibold">Price</th>
                    <th className="py-2 pr-4 text-slate-50 font-semibold">Seats included</th>
                    <th className="py-2 text-slate-50 font-semibold">Extra seat</th>
                  </tr>
                </thead>
                <tbody className="text-slate-200">
                  <tr className="border-b border-slate-800">
                    <td className="py-2 pr-4">Studio 3</td>
                    <td className="py-2 pr-4">R5,500 / 3 months</td>
                    <td className="py-2 pr-4">1</td>
                    <td className="py-2">R750 flat</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-2 pr-4">Studio 6</td>
                    <td className="py-2 pr-4">R9,500 / 6 months</td>
                    <td className="py-2 pr-4">2</td>
                    <td className="py-2">R1,500 flat</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Studio 12</td>
                    <td className="py-2 pr-4">R18,500 / year</td>
                    <td className="py-2 pr-4">3</td>
                    <td className="py-2">R3,000 flat</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Studio includes crew invites, department workspaces, cross-department
              threads, item tracking, and team access control on top of everything in
              Project.
            </p>
          </>
```

- [ ] **Step 2: Update the "How do I pay?" answer (around line 261)**

Replace:

```
The landing page doesn't take payment directly. You enter your email, choose a plan
and (for Team License) a billing cadence, and we redirect you to
```

with:

```
The landing page doesn't take payment directly. You enter your email, choose a plan
and (for Studio) a commitment length, and we redirect you to
```

- [ ] **Step 3: Update the "Is there a free trial?" answer (around line 277)**

Replace:

```
limits; you only pay when you actually run a breakdown (Pay-Per-Breakdown) or take out
a Team License.
```

with:

```
limits; you only pay when you actually run a breakdown (Project) or take out
a Studio plan.
```

- [ ] **Step 4: Update the "Can I cancel anytime?" answer (lines 286-296)**

Replace:

```tsx
            <p className="mb-4">
              Pay-Per-Breakdown has nothing to cancel — it's a one-off charge per breakdown, not a
              subscription.
            </p>
            <p>
              For the Team License, each cadence (monthly, 3-month, 6-month, annual) is a prepaid
              term: you pay upfront and have full access for that whole period. You can cancel at
              any time to stop the next renewal, but — standard practice for prepaid terms — the
              current term itself is non-refundable and runs to its end date; there's no partial
              refund for unused time.
            </p>
```

with:

```tsx
            <p className="mb-4">
              Project has nothing to cancel — it's a one-off charge per breakdown, not a
              subscription.
            </p>
            <p>
              Every Studio plan (3, 6, or 12 months) is a prepaid term: you pay upfront and
              have full access for that whole period. You can cancel at any time to stop the
              next renewal, but — standard practice for prepaid terms — the current term
              itself is non-refundable and runs to its end date; there's no partial refund
              for unused time.
            </p>
```

- [ ] **Step 5: Apply the mirrored changes to `docs/landing-faq.md`**

Replace lines 97-107:

```
- **Pay-Per-Breakdown** — **R2,250 per breakdown**. For individual filmmakers working solo; no crew collaboration.
- **Team License** — unlimited breakdowns for your whole crew, billed on whichever term fits:

  | Cadence | Price | Seats included | Extra seat |
  |---|---|---|---|
  | Monthly | R1,850 / month | None | R250 / mo |
  | 3-Month | R5,500 / 3 months | 1 | R750 flat |
  | 6-Month | R9,500 / 6 months | 2 | R1,500 flat |
  | Annual | R18,500 / year | 3 | R3,000 flat |

The Team License includes crew invites, department workspaces, cross-department threads, item tracking, and team access control on top of everything in Pay-Per-Breakdown.
```

with:

```
- **Project** — **R2,250 per breakdown**. For individual filmmakers working solo; no crew collaboration.
- **Studio** — unlimited breakdowns for your whole crew, on a fixed-term commitment:

  | Plan | Price | Seats included | Extra seat |
  |---|---|---|---|
  | Studio 3 | R5,500 / 3 months | 1 | R750 flat |
  | Studio 6 | R9,500 / 6 months | 2 | R1,500 flat |
  | Studio 12 | R18,500 / year | 3 | R3,000 flat |

Studio includes crew invites, department workspaces, cross-department threads, item tracking, and team access control on top of everything in Project.
```

Then update the two remaining mentions further down:

Replace (line 113):

```
The landing page doesn't take payment directly. You enter your email, choose a plan and (for Team License) a billing cadence, and we redirect you to `app.slateone.studio` to create your account and complete signup.
```

with:

```
The landing page doesn't take payment directly. You enter your email, choose a plan and (for Studio) a commitment length, and we redirect you to `app.slateone.studio` to create your account and complete signup.
```

Replace (line 119):

```
No — SlateOne is paid-only. Uploading and editing scripts is free with no account limits; you only pay when you actually run a breakdown (Pay-Per-Breakdown) or take out a Team License.
```

with:

```
No — SlateOne is paid-only. Uploading and editing scripts is free with no account limits; you only pay when you actually run a breakdown (Project) or take out a Studio plan.
```

Replace (lines 123-125):

```
Pay-Per-Breakdown has nothing to cancel — it's a one-off charge per breakdown, not a subscription.

For the Team License, each cadence (monthly, 3-month, 6-month, annual) is a **prepaid term**: you pay upfront and have full access for that whole period. You can cancel at any time to stop the *next* renewal, but — standard practice for prepaid terms — the current term itself is non-refundable and runs to its end date; there's no partial refund for unused time.
```

with:

```
Project has nothing to cancel — it's a one-off charge per breakdown, not a subscription.

Every Studio plan (3, 6, or 12 months) is a **prepaid term**: you pay upfront and have full access for that whole period. You can cancel at any time to stop the *next* renewal, but — standard practice for prepaid terms — the current term itself is non-refundable and runs to its end date; there's no partial refund for unused time.
```

- [ ] **Step 6: Verify no stale references remain in either file**

Run: `grep -n "Team License\|Pay-Per-Breakdown" components/FAQ.tsx docs/landing-faq.md`
Expected: no output.

- [ ] **Step 7: Typecheck**

Run: `npx tsc --noEmit`
Expected: No errors (this task is JSX/markdown copy only, but `FAQ.tsx` is a
`.tsx` file — confirm the JSX edit didn't break syntax).

- [ ] **Step 8: Commit**

```bash
git add components/FAQ.tsx docs/landing-faq.md
git commit -m "docs: update FAQ copy for Studio commitment ladder"
```

---

## Task 7: Note the remaining stale docs in `BACKLOG.md`

**Files:**
- Modify: `BACKLOG.md` (Marketing / content section)

**Interfaces:**
- Consumes: nothing.
- Produces: nothing consumed elsewhere.

- [ ] **Step 1: Add a line to the Marketing / content section**

In the `## Marketing / content` section (after the existing Meta Pixel bullet
added 2026-08-18), add:

```markdown
- [ ] `docs/app-repo-handoff-pricing.md` and `docs/pitch-deck.md` still use the
  Pay-Per-Breakdown/Team License names and older R450/R150 numbers (pre-existing
  drift from before the 2026-08-19 Studio commitment-ladder rename) — need both
  the naming update (Project/Studio 3/6/12) and a numbers reconciliation pass.
  `public/TERMS OF SERVICE FOR SLATEONE STUDIO.md` (the standalone legal doc,
  separate from `components/TermsOfService.tsx`) is similarly stale.
```

- [ ] **Step 2: Commit**

```bash
git add BACKLOG.md
git commit -m "docs: note remaining stale pricing docs after Studio ladder rename"
```

---

## Task 8: Manual verification

**Files:** none modified — verification only.

**Interfaces:** none.

- [ ] **Step 1: Build check**

Run: `npm run build`
Expected: Build succeeds with no new errors. The existing >500kB main-chunk
warning (tracked in `BACKLOG.md`) is expected and not a regression to fix here.

- [ ] **Step 2: Start the dev server**

Run: `npm run dev`
Expected: Server starts on port 3000.

- [ ] **Step 3: Visually verify the pricing section**

Load the landing page, scroll to `#pricing`. Confirm:
- 4 cards render: Project, Studio 3, Studio 6, Studio 12.
- Studio 12 has the "Best Value" ribbon and amber accent; Studio 6 has a subtle
  cyan accent; Project and Studio 3 are neutral slate.
- Each Studio card shows its effective-monthly figure under the headline price
  (Studio 3 ≈ R1,833/mo, Studio 6 ≈ R1,583/mo, Studio 12 ≈ R1,542/mo).
- The shared "One Source of Truth" collaboration panel appears once, below all
  4 cards, not repeated per-card.
- The "Prices in ZAR." line no longer says "No lock-in."

- [ ] **Step 4: Verify the signup modal for each card**

Click each card's "Get Started" button in turn. Confirm the modal shows the
right name (Project / Studio 3 / Studio 6 / Studio 12) and price, then check
browser dev tools' Network/Console (or add a temporary `console.log` if
needed, then remove it) to confirm the constructed `signupUrl` carries the
correct `billing_period` (`3month`/`6month`/`annual`, never `monthly`) for
each Studio card, and any value (unused by the app) for the Project card.

- [ ] **Step 5: Report results**

If all checks pass, the feature is complete — no further commit needed for
this task (verification-only). If anything fails, return to the relevant
earlier task and fix before proceeding.

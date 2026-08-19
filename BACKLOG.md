# Backlog

Working list of features, iterations, and cleanup still to do on the landing site
(and the handoff items the app repo owes us). Not prioritized — add/reorder as needed.

## Pricing & billing

- [ ] **App-repo: wire up monthly + annual PayFast billing for Team License.**
  `docs/pricing-model-change-spec.md` §6 only has a PayFast form for the old
  annual-only plan (`frequency=6`, `amount=1850`, `item_name=Tier_2_Annual`). Since
  the 2026-07-30 change (see `components/Pricing.tsx`), the Team License is monthly
  by default (R1,850/mo + R150/seat/mo) with an annual option (R18,500/yr +
  R1,500/seat/yr, 2 months free). Need a monthly subscription form
  (`frequency=3`, `amount=1850`) alongside the existing annual one, and the seat
  charge needs a matching monthly/annual split.
- [ ] **App-repo: handle the new `billing_period` query param.** The signup redirect
  now sends `...&plan=tier_2&billing_period=monthly|annual...` (see
  `lib/supabase.ts::createPricingLead`). Confirm `/api/auth/set-plan` (or whatever
  reads the query string) persists this against `signup_plan` / `profiles`, and that
  the annual discount is actually applied at checkout, not just displayed on the
  landing page.
- [ ] **App-repo: widen `profiles.subscription_plan` CHECK constraint.** Still open
  from the 2026-07-16 tier change — needs `tier_1_pay_per_breakdown` /
  `tier_2_annual_team` (or renamed `tier_2_team`) allowed values.
- [ ] **Decide on a persistent "team" naming update.** Card copy, modal copy, and TOS
  now say "Team License" instead of "Annual Team License" — but `signup_plan` id in
  the app repo is still documented as `tier_2_annual_team`. Either rename it or
  confirm it's just an internal id that doesn't need to match the public label.
- [ ] Enforce Tier 1 (Pay-Per-Breakdown) team-feature exclusions server-side (invites,
  department workspaces, cross-department threads, item tracking, access control) —
  flagged in the 2026-07-16 changelog as still outstanding on the app side.

## Legal / compliance copy

- [ ] `TermsOfService.tsx` §6 mentions a "third-party payment provider" generically —
  confirm PayFast is named (or intentionally left generic) once the app-side
  integration is live.
- [ ] Refund/cancellation policy referenced in TOS §6.4 ("Refund Policy") — confirm
  this policy exists somewhere linkable, or write it.

## FAQ page (`docs/landing-faq.md`)

Draft is written but has 12 unresolved `⚠️ Confirm` items before it can ship as a
real page. Needs a product-owner pass on:
- [ ] Supported script formats (PDF-only vs. also `.fdx`/Fountain)
- [ ] Realistic breakdown turnaround time to quote
- [ ] Team seat roles/permissions (what a teammate can/can't do)
- [ ] Accepted payment methods, regions, billing cadence (now needs monthly/annual
  language added once decided)
- [ ] Whether a free trial exists (currently: no — confirm this stays final)
- [ ] Cancellation/refund policy specifics
- [ ] Security/compliance claims (encryption, retention, model-training use of
  scripts) — flagged as highest-risk item to get wrong, needs legal/infra sign-off
- [ ] Support contact channel (email / chat / help center link)
- [ ] Once resolved, build the actual FAQ page/section and add it to `App.tsx` (no
  `AppState` entry or route exists for it yet)

## Legacy code cleanup

- [ ] Six components are built but not mounted anywhere in `App.tsx`: `Agitation`,
  `Features`, `Founder`, `SeeItInAction`, `StrategicClose`, `Survey`. Decide per
  component: re-integrate into the landing page, or delete.
- [ ] `vite.config.ts` / README still reference a vestigial `GEMINI_API_KEY` from the
  AI Studio origin — confirm nothing depends on it and remove the references.
- [ ] Update `CLAUDE.md`'s architecture note — it still describes the old
  `createPaymentLead`/legacy-Yoco flow as "legacy but still in the code"; that code
  was actually deleted in the 2026-07-16 pricing change. Doc is out of date.

## Marketing / content

- [ ] `docs/pitch-deck.md` / `SlateOne_Pitch_Deck_v1.html` / `.pdf` — confirm these
  reflect current pricing (Project / Studio 3, 6, 12) before sharing externally; they
  likely still show the old annual-only number.
- [ ] **Install the Meta Pixel on slateone.studio.** Blocked on the Pixel ID from
  Events Manager (Business Manager → Events Manager → Data Sources) — the Ad
  Account ID (`206300442416906`) is a different object and won't work. User is
  currently sorting out the Meta ad accounts; once the Pixel ID is in hand, drop
  the base pixel snippet into `index.html` (no other integration work needed).
- [ ] `docs/app-repo-handoff-pricing.md` and `docs/pitch-deck.md` still use the
  Pay-Per-Breakdown/Team License names and older R450/R150 numbers (pre-existing
  drift from before the 2026-08-19 Studio commitment-ladder rename) — need both
  the naming update (Project/Studio 3/6/12) and a numbers reconciliation pass.
  `public/TERMS OF SERVICE FOR SLATEONE STUDIO.md` (the standalone legal doc,
  separate from `components/TermsOfService.tsx`) is similarly stale.

## Engineering / infra

- [ ] No test suite and no linter configured (per `CLAUDE.md`) — consider adding at
  least a lint pass before this grows further; pricing logic (billing period math,
  tier gating) is exactly the kind of thing worth a regression test.
- [ ] `npm run build` warns the main JS chunk is >500 kB — consider code-splitting
  (e.g. dynamic import for legal document pages, which aren't needed on first paint).

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing/landing site for **SlateOne** (slateone.studio) — production infrastructure SaaS for film & TV. Vite + React 19 + TypeScript single-page app, deployed on Vercel. The actual product lives elsewhere (app.slateone.studio); this repo is the landing page plus its lead-capture backend (Supabase).

## Commands

```bash
npm run dev      # dev server on port 3000 (host 0.0.0.0)
npm run build    # vite build → dist/
npm run preview  # preview the production build
```

There are no tests and no linter configured.

Requires `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. (The `GEMINI_API_KEY` references in `vite.config.ts` and the README are vestigial from the app's AI Studio origin — unused.)

## Architecture

**No router.** `App.tsx` switches between views via the `AppState` enum in `types.ts` (LANDING / PRIVACY_POLICY / TERMS_OF_SERVICE). The landing page is a vertical stack of section components rendered in order: `Hero → IndustryReality → OperatingLayer → SystemArchitecture → BuiltFor → Pricing → Footer`. Several components in `components/` (Agitation, Features, HowItWorks, SeeItInAction, StrategicClose, Founder, Survey) are from earlier page iterations and are not currently mounted — check `App.tsx` before assuming a component is live.

**Tailwind is loaded via CDN, not a build step.** The theme (custom colors `charcoal`, `neon` #E3FF00, `cyan`, `paper`, `slate-black`, `soft-grey`; fonts `display`=Space Grotesk, `mono`=Courier Prime, `sans`=Inter) is configured in an inline `<script>` in `index.html`. There is no `tailwind.config.js` — theme changes go in `index.html`.

**All data access is in `lib/supabase.ts`.** Two Supabase tables:
- `waitlist` — email signup + post-signup survey fields; duplicate emails surface as error code `23505` → `already_registered`.
- `payment_leads` — conversion funnel tracking with status flow `intent → redirected → completed | abandoned` and a generated `tracking_id` (`sl_<timestamp>_<rand>`). Current live flow is a single $49/month plan paid via a Wise payment link (`createSubscriptionLead`); the older Yoco R49/R249 flow (`createPaymentLead`, `PaymentModal`, `TierSelectionModal`) is legacy but still in the code.

**Supabase backend** (`supabase/`):
- `functions/send-waitlist-confirmation/` — Deno edge function that sends persona-based confirmation emails via Resend (professional/student/other, chosen from the survey `role`). Invoked from `lib/supabase.ts` after survey completion; email failure is intentionally non-blocking.
- `migrations/` — plain SQL files, applied manually (no CLI migration state in repo).
- The two `send-waitlist-confirmation-email-template*.ts` files at the repo root are working copies of the edge function for editing/staging — the deployed source of truth is `supabase/functions/send-waitlist-confirmation/index.ts`.

## Docs

`docs/` contains implementation plans and the canonical marketing copy reference (`marketing-reference.md` — brand voice, positioning, messaging). Consult it before changing landing-page copy. `docs/changelog/` records significant product decisions (e.g. the 2026-04 pricing simplification).

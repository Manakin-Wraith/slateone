# App-Repo Handoff — Two-Tier Pricing + PayFast

> **Purpose:** Context for implementing the pricing change in the product app repo
> (`ScripDown_AI` → `app.slateone.studio` frontend + `api.slateone.studio` Flask backend).
> The landing-page side (this repo) is **done**; this document is the spec for the app side.
>
> **Legend:** ✅ = verified contract from the landing side / your provided details.
> 🔎 = assumption about the app repo that must be verified in that codebase before coding.

---

## 1. What the landing side now sends you (the contract) ✅

The marketing site no longer takes payment. It captures an email lead, then redirects the
browser to your app signup with a `plan` query param:

```
https://app.slateone.studio/login?mode=signup&plan=<tier>&source=<src>&ref=<tracking_id>
```

- `plan` is **`tier_1`** or **`tier_2`** (exactly these strings).
- `ref` is the landing lead's `tracking_id` (`sl_<ts>_<rand>`) in Supabase `payment_leads` — useful for attribution/analytics if you want it, not required.
- No payment has happened at this point. The user arrives unauthenticated, intending to sign up.

## 2. Confirmed pricing model ✅

| Tier param | signup_plan id | Name | Price (ZAR) | Billing | Team features |
|------------|----------------|------|-------------|---------|---------------|
| `tier_1` | `tier_1_pay_per_breakdown` | Pay-Per-Breakdown | R450 / breakdown | One-off, pay-as-you-go | ✕ |
| `tier_2` | `tier_2_annual_team` | Annual Team License | R1,850 / yr + R150 / seat | Annual subscription + per-seat | ✓ |

- **Currency:** ZAR only. **No free tier / no trial.** **No "AI" wording in user-facing copy** (product-owner directive — use "breakdown" / "script analysis").
- **Uploads & manual scene work are always free.** Only running a *breakdown* is billable.
- **Tier 1** cannot use team features (invites, department workspaces, cross-department threads, item tracking, access control). **Tier 2** owner gets unlimited breakdowns for themselves + all paid seats; the **account owner pays for every seat** (Option A in the business spec).

## 3. App-side work

### 3.1 Database — `profiles` 🔎
- **Verify:** `032_pricing_simplification.sql` constrains `subscription_plan` to `('trial','monthly')`.
- **Change:** widen the CHECK to allow `tier_1_pay_per_breakdown` and `tier_2_annual_team` (decide whether to keep or drop `trial`/`monthly` for legacy rows — recommend keep, like we did on the landing `payment_leads` side).
- **Verify:** how `signup_plan`, `subscription_status`, `script_upload_limit`, `scripts_uploaded` are used by `can_upload_script()` (per `docs/free-trial-implementation.md`). Uploads are now unlimited on both tiers, so upload-limit gating should be removed/relaxed; the billable gate moves to the **breakdown** action, not upload.
- **Likely new state needed:** per-account seat count for Tier 2, and a breakdown-entitlement/credit concept for Tier 1 (see §3.4).

### 3.2 Signup → plan mapping 🔎
- **Verify:** `/api/auth/set-plan` already reads the `plan` query param and writes it to `signup_plan`.
- **Change:** map the incoming `tier_1` / `tier_2` → the full `signup_plan` ids above. Confirm the `LoginPage` `mode=signup` flow carries `plan` through account creation and the Supabase email-confirmation callback (`/auth/callback?type=signup` → `/login?mode=signup&verified=true`) does not drop it.

### 3.3 In-app checkout (PayFast) 🔎/✅
After signup, the app must present checkout for the chosen tier. **Amounts/params are confirmed** (§6 of `pricing-model-change-spec.md`, merchant `33568687`):
- **Tier 1:** one-off R450 (`_paynow`, `amount=450`). Shareable link `payf.st/mjg3x`.
- **Tier 2 annual:** subscription R1,850, `subscription_type=1`, `recurring_amount=1850`, `cycles=0`, `frequency=6` (annual). Shareable link `payf.st/8crta`.
- **Tier 2 seats:** R150 × quantity (`type=seats`, client multiplies `amount` by `custom_quantity`). Shareable link `payf.st/2egtc`.
- **Change:** build the checkout screen(s); render the appropriate PayFast form/redirect per tier. Pass an identifier tying the payment to the account (recommend PayFast `custom_str1 = user_id` / `m_payment_id`) so the ITN can attribute payment.

### 3.4 PayFast ITN webhook — `POST /api/payfast/notify` 🔎 (does not exist yet)
This is the source of truth for "did they pay". **Must be built.**
- Receive PayFast's POST (ITN). **Validate before trusting:** (a) signature/MD5 against your passphrase, (b) source IP is a PayFast server, (c) `amount_gross` matches the expected tier amount, (d) confirm via PayFast's validate endpoint.
- Discriminate the charge: `plan=tier_1` (grant a breakdown credit / entitlement), `plan=tier_2` (activate/renew the annual subscription), `type=seats` (add `custom_quantity` seats to the account). If the merchant is limited to one Notify URL, pass the discriminator in `custom_str1` instead of the query string.
- Idempotency: dedupe on PayFast `pf_payment_id` so retries don't double-grant.
- Update `profiles.subscription_status` / seat count / breakdown entitlement accordingly.

### 3.5 Payment result routes — `App.jsx` 🔎
- **Verify:** the old `PaymentSuccessPage` route is commented out and used a different path.
- **Change:** wire `/payment/success` and `/payment/cancel`. They receive `?plan=tier_1|tier_2` or `?type=seats`. Show the right confirmation and refresh entitlement state (don't grant access from the return URL — access comes from the ITN in §3.4; the return page is UX only).

### 3.6 Feature gating (server-side) 🔎
- **Breakdown action (Tier 1):** require a paid breakdown entitlement/credit before running; block + prompt to purchase if none.
- **Team endpoints (Tier 2 only):** enforce tier + seat checks server-side on `/members`, `/invites`, `/threads`, `/departments`, `/workspace`. Tier 1 users get 403 + an upsell in the UI.
- **Seat limits:** an owner can invite up to the number of paid seats.

## 4. Security must-dos ✅

- ITN validation (signature + IP + amount + PayFast validate call) is **non-negotiable** — never grant entitlement from the browser return URL.
- Idempotent ITN handling keyed on `pf_payment_id`.
- All entitlement checks server-side; the frontend gate is UX only.

## 5. Recommended build sequence

1. DB: widen `profiles.subscription_plan` CHECK; add seat/entitlement columns. (§3.1)
2. Signup: map `plan` → `signup_plan`; verify param survives the callback. (§3.2)
3. ITN webhook `/api/payfast/notify` with full validation + idempotency. (§3.4) — build/test this before checkout so payments actually register.
4. Checkout screens per tier. (§3.3)
5. `/payment/success` + `/payment/cancel` routes. (§3.5)
6. Feature gating: breakdown entitlement + team-endpoint tier checks. (§3.6)
7. End-to-end test: signup(`plan=tier_2`) → checkout → PayFast sandbox → ITN → entitlement granted → team features unlock.

## 6. Open questions to resolve in the app repo

- **Tier 1 model:** is a paid breakdown a consumable *credit* (buy N, spend over time) or a per-run charge each time? The business spec §8.1 mentions a "credit/wallet" — confirm the intended UX.
- **Seat proration:** business spec defers mid-cycle proration to "Phase 2" — confirm out of scope for v1.
- **Failed renewal:** business spec §8.2 says downgrade Tier 2 → Tier 1 and make team features read-only — confirm and implement.
- **VAT:** ZAR pricing — is R450 / R1,850 / R150 VAT-inclusive? Affects PayFast `amount` and invoices.
- **One vs many Notify URLs:** does the PayFast merchant config allow per-charge `notify_url` query params, or must you use one URL + `custom_str1`?

---

**Cross-references:** `docs/pricing-model-change-spec.md` (full spec incl. §6 PayFast snippets), `docs/changelog/2026-07-16-two-tier-pricing.md` (landing changes), `ScripDown_AI/docs/SPEC_Tiered_Business_Model.md` (business model source of truth).

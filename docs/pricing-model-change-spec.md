# SlateOne Pricing Model Change — Implementation Spec

> **Status:** Landing side implemented (2026-07-16). App side pending.  
> **Scope:** Landing page frontend + lead-capture backend  
> **Note:** This repo is the marketing/landing site only. The production SaaS (`app.slateone.studio` frontend + `api.slateone.studio` Flask backend) lives in a separate codebase and must also be updated — that is where the PayFast integration in §6 belongs.

---

## 1. Objective

Replace the current single-tier `$49/month` subscription model with a new multi-tier pricing structure.

- **Current live tier:** `monthly` at `$49/mo` (Wise payment link)
- **Legacy code still present:** `R49` / `R249` Yoco packs in `PaymentModal` and `HowItWorks`
- **New model:** TBD — product owner to define tiers, prices, features, currencies and payment providers

---

## 2. Current Pricing Architecture

### 2.1 Frontend (Vite + React 19 + TypeScript)

| File | Role | Current Behavior |
|------|------|------------------|
| `components/Pricing.tsx` | Public pricing page | Displays one `$49/mo` card; opens `TierSelectionModal` |
| `components/TierSelectionModal.tsx` | Lead-capture modal | Email-only capture; saves `payment_tier: 'monthly'`; redirects to Wise |
| `components/PaymentModal.tsx` | Legacy Yoco modal | Two tiers: `R49` and `R249`; captures email/name/phone; redirects to Yoco |
| `components/HowItWorks.tsx` | Legacy usage section | Imports `PaymentModal` but the open state is never set to `true` (dead code) |
| `components/Hero.tsx` | Landing hero | CTA scrolls to `#pricing` |
| `components/App.tsx` | App shell | Renders `<Pricing />`; nav links to `#pricing` |
| `components/TermsOfService.tsx` + `public/TERMS OF SERVICE FOR SLATEONE STUDIO.md` | Legal | `[Monthly/Annually]` placeholder; references "Team Plan" |

### 2.2 Backend / Lead Capture (`lib/supabase.ts`)

```ts
// Current types
export interface PaymentLeadData {
  email: string;
  name: string;
  phone?: string;
  payment_tier: 'R49' | 'R249';
  source?: string;
}

export type SubscriptionTier = 'monthly';

export interface SubscriptionLeadData {
  email: string;
  payment_tier: SubscriptionTier;
  source?: string;
}

// Current functions
export async function createPaymentLead(leadData: PaymentLeadData)
export async function createSubscriptionLead(leadData: SubscriptionLeadData)
export async function updatePaymentLeadStatus(trackingId, status)
```

Key constants:

- `WISE_PAYMENT_URL = 'https://wise.com/pay/r/8j9W0j5SUuPivxk'`
- Yoco links for `R49`/`R249` in `createPaymentLead`

### 2.3 Database (Supabase)

| File | Purpose |
|------|---------|
| `supabase/migrations/create_payment_leads.sql` | Creates `payment_leads` table with `payment_tier CHECK ('R49','R249')` |
| `supabase/migrations/extend_payment_leads_subscription_tiers.sql` | Widens `payment_tier` to include legacy pack and subscription strings, adds `company` and `tier_price` columns, makes `yoco_url` nullable |
| `supabase/migrations/add_script_limits_to_profiles.sql` | Adds `script_upload_limit`, `scripts_uploaded`, `signup_plan`, `subscription_status` to `profiles` (used by app backend) |

### 2.4 Email / Edge Function

| File | Relevance |
|------|-----------|
| `supabase/functions/send-waitlist-confirmation/index.ts` | Waitlist confirmation email; copy references beta / free / pricing; may need updating if messaging changes |
| `send-waitlist-confirmation-email-template.ts` + `send-waitlist-confirmation-email-template-v2.ts` | Working copies of the email template |

### 2.5 Documentation to Update

- `docs/changelog/2026-04-07-pricing-simplification.md` — last pricing change record
- `docs/marketing-reference.md` — section 8 still describes the old per-breakdown packs
- `docs/payment-contact-capture.md` — documents the `R49`/`R249` Yoco flow
- `docs/free-trial-implementation.md` — describes `profiles` plan/status columns

---

## 3. Confirmed New Tier Model (2026-07)

> **Status:** Confirmed. Source of truth: `ScripDown_AI/docs/SPEC_Tiered_Business_Model.md` (product/app repo), adapted for the landing page. **No "AI" wording on the landing page** (product-owner directive) — the billable concept is referred to as "breakdown" / "script analysis".

| Tier ID (lead) | URL plan param | App signup_plan id | Display Name | Price | Billing | Landing CTA | Team features |
|----------------|----------------|--------------------|--------------|-------|---------|-------------|---------------|
| `tier_1` | `tier_1` | `tier_1_pay_per_breakdown` | Pay-Per-Breakdown | R450 / breakdown | Pay as you go | Email capture → app signup | ✕ |
| `tier_2` | `tier_2` | `tier_2_annual_team` | Annual Team License | R1,850 / yr + R150 / seat | Annual, upfront | Email capture → app signup | ✓ |

**Decisions:**

- **Tiers:** 2
- **Currency:** ZAR only
- **Billing:** Tier 1 consumption (per breakdown); Tier 2 annual + per-seat
- **Payment:** No checkout on the landing page. Both CTAs capture the email as a lead, then redirect to `https://app.slateone.studio/login?mode=signup&plan=<tier>`. Account creation happens first so payment can be attributed to the account; **checkout runs inside the app via PayFast** (merchant `33568687`) after signup — see §6 for the confirmed buttons/links and app-side integration.
- **Free/trial:** None. No "sign up free" framing on the landing page.
- **Legacy data:** Preserved. The new migration widens the `payment_tier` CHECK to add `tier_1`/`tier_2` and keeps every legacy value (`monthly`, `R49`, `R249`, packs, etc.). No backfill/deletion.
- **App-side (separate repo):** `profiles.subscription_plan` CHECK (`032_pricing_simplification.sql`) is constrained to `('trial','monthly')` and must be widened to allow `tier_1_pay_per_breakdown` / `tier_2_annual_team`. `/api/auth/set-plan` already writes the `plan` param to `signup_plan` and maps it to the full id once the constraint is updated.

---

## 4. Required Code Changes

### 4.1 Frontend

#### `lib/supabase.ts`

1. Replace `SubscriptionTier` with a union of new tier IDs.
2. Replace `PaymentLeadData.payment_tier` type.
3. Delete or deprecate `createPaymentLead` (Yoco legacy).
4. Update `createSubscriptionLead` (or replace with a generic `createPricingLead`) to:
   - Accept any new tier
   - Generate the correct payment URL per tier
   - Store `payment_tier`, `tier_price`, `company`, `billing_period` if needed
5. Decide whether `yoco_url` column will be renamed/repurposed for generic `payment_url`.

#### `components/Pricing.tsx`

- Convert single-card layout to tier grid (or keep highlighted preferred tier).
- Pull tier config into a data array instead of hard-coded `$49/mo`.
- Update copy: "Simple Pricing. Unlimited Breakdowns." and feature list.
- Pass selected tier to modal.

#### `components/TierSelectionModal.tsx`

- Accept any new tier as a prop, not just `'monthly'`.
- Display tier-specific name, price, billing period and features.
- Optionally capture `name`, `company`, `phone`.
- Redirect to the tier-specific payment URL.

#### `components/PaymentModal.tsx` and `components/HowItWorks.tsx`

- These are dead legacy code. **Decision:** remove both files and their references, or update to new tiers.
- Currently `isModalOpen` in `HowItWorks` is never set to `true`; `PaymentModal` is not rendered anywhere live.

#### `App.tsx`

- No direct pricing logic, but confirm nav CTA still routes to `#pricing`.

#### `components/TermsOfService.tsx` + `public/TERMS OF SERVICE FOR SLATEONE STUDIO.md`

- Replace `[Monthly/Annually]` placeholder with actual billing terms.
- Update "Team Plan" copy if tiers change.

### 4.2 Backend / Supabase

#### New or updated migration

Create a migration (e.g. `supabase/migrations/update_pricing_tiers.sql`) that:

1. Drops/recreates the `payment_tier` CHECK constraint with new tier IDs.
2. Backfills existing `monthly`, `R49`, `R249` rows to a sensible new tier (or preserves them if using a lookup table).
3. Renames or retains `yoco_url` as a generic `payment_url` column (recommended rename to `payment_url`).
4. Adds columns if needed:
   - `billing_period TEXT` (`monthly` | `annual`)
   - `currency TEXT`
   - `amount INTEGER`
   - `company TEXT` (already added by previous migration)
   - `tier_price INTEGER` (already added by previous migration)

Suggested schema update:

```sql
ALTER TABLE payment_leads
DROP CONSTRAINT IF EXISTS payment_leads_payment_tier_check;

ALTER TABLE payment_leads
ADD CONSTRAINT payment_leads_payment_tier_check
CHECK (payment_tier IN (...)); -- fill with new tier IDs

-- Optional: rename yoco_url -> payment_url
-- Do not do this if legacy integrations depend on the column name
```

#### Edge function / webhook (if needed)

- If using a new payment provider with webhooks, add or update a Supabase Edge Function to update `payment_leads.status` to `completed`/`abandoned`.
- Yoco webhook example exists in `docs/payment-contact-capture.md` under *Next Steps*.

### 4.3 Production SaaS Backend (`app.slateone.studio`)

The actual application backend is **not in this repo**. Based on `docs/free-trial-implementation.md`, the following likely need updating in the app codebase:

| Area | Required Change |
|------|-----------------|
| `profiles` table | `signup_plan` and `subscription_status` must support new tier IDs; update `can_upload_script()` logic |
| Signup handler | Map landing-page `plan` query param to correct new tier and entitlement |
| Billing/subscription engine | Create/update subscriptions with new prices; handle renewals/cancellations |
| Upgrade prompts | In-app "upgrade" UI must point to new tier checkout URLs |
| Role/permission limits | If tiers include seat limits or feature gates, update authorization logic |

### 4.4 Documentation

- Update `docs/marketing-reference.md` section 8 (Pricing) with new tiers.
- Update `docs/payment-contact-capture.md` with new flow.
- Add changelog entry in `docs/changelog/` (e.g. `2026-07-pricing-tiers.md`).

---

## 5. Implementation Sequence

1. **Define tiers** — product owner fills section 3.
2. **Design DB changes** — update `payment_tier` CHECK and decide column renames.
3. **Update `lib/supabase.ts`** — types and `createSubscriptionLead` / lead helper.
4. **Update frontend** — `Pricing.tsx`, `TierSelectionModal.tsx`; remove or update legacy `PaymentModal`/`HowItWorks`.
5. **Update legal copy** — TOS and Privacy Policy.
6. **Apply Supabase migrations** and backfill data.
7. **Update production app backend** (separate repo).
8. **Update docs/changelog**.
9. **Test end-to-end** — intent → redirect → status update → access entitlement.

---


## 6. PayFast Integration (App Side)

> **Belongs to the app repo, not this landing repo.** Checkout runs inside `app.slateone.studio` after signup. Merchant (receiver) ID: **`33568687`**. Process endpoint: `https://payment.payfast.io/eng/process`. Confirmation emails go to `hello@slateone.studio`.

### 6.1 Charge summary

| # | Purpose | Tier | Amount (ZAR) | PayFast type | Recurring | Shareable link |
|---|---------|------|--------------|--------------|-----------|----------------|
| 1 | Pay-Per-Breakdown | `tier_1` | 450 | One-off (`_paynow`) | No | `https://payf.st/mjg3x` |
| 2 | Member Seat | `tier_2` (`type=seats`) | 150 × quantity | One-off (`_paynow`) | No | `https://payf.st/2egtc` |
| 3 | Annual Team License | `tier_2` | 1,850 | Subscription (`subscription_type=1`) | Yes | `https://payf.st/8crta` |

**Subscription params (charge #3):** `subscription_type=1`, `recurring_amount=1850`, `cycles=0` (renew until cancelled), `frequency=6` (annual).
**Seat params (charge #2):** quantity chosen client-side; a small JS multiplier sets `amount = 150 × custom_quantity` before submit.

### 6.2 Return / notify URL scheme

Each charge passes context back via query params so the backend knows what completed:

| Charge | return_url / cancel_url | notify_url |
|--------|-------------------------|------------|
| Tier 1 breakdown | `app.slateone.studio/payment/{success,cancel}?plan=tier_1` | `api.slateone.studio/api/payfast/notify?plan=tier_1` |
| Tier 2 seat | `app.slateone.studio/payment/{success,cancel}?type=seats` | `api.slateone.studio/api/payfast/notify?type=seats` |
| Tier 2 annual | `app.slateone.studio/payment/{success,cancel}?plan=tier_2` | `api.slateone.studio/api/payfast/notify?plan=tier_2` |

> If PayFast restricts the merchant to a single Notify URL, use one `https://api.slateone.studio/api/payfast/notify` with no query params and pass the discriminator (`plan` / `type`) in `custom_str1` instead.

### 6.3 App-side work required

- [ ] **Backend (Flask):** create the `POST /api/payfast/notify` route — it does not exist yet. Validate PayFast's ITN signature + source IP, then update the account's `subscription_status` / seat count.
- [ ] **Frontend (`App.jsx`):** wire the `/payment/success` and `/payment/cancel` routes (the old commented-out `PaymentSuccessPage` used a different path).
- [ ] **Seat purchases:** carry quantity via `custom_quantity` (client multiplies `amount`); the `type=seats` discriminator distinguishes a seat top-up from a tier subscription.
- [ ] Map the landing `plan` param (`tier_1` / `tier_2`) to `signup_plan` and to the correct PayFast charge on the app pricing/checkout screen.

### 6.4 Raw button & email-link snippets (verbatim from PayFast dashboard)

Amounts/params source of truth is §6.1–6.2; regenerate these from the PayFast dashboard if merchant config changes.

**Charge 1 — Pay-Per-Breakdown (Tier 1) — email link**

```html
<a href="https://payment.payfast.io/eng/process?cmd=_paynow&receiver=33568687&item_name=Tier+1&email_confirmation=1&confirmation_address=hello@slateone.studio&item_description=Pay-Per-Breakdown&return_url=https://app.slateone.studio/payment/success?plan=tier_1&cancel_url=https://app.slateone.studio/payment/cancel?plan=tier_1&notify_url=https://api.slateone.studio/api/payfast/notify?plan=tier_1&amount=450">Buy Now</a>
```

**Charge 1 — button form**

```html
<form name="PayFastPayNowForm" action="https://payment.payfast.io/eng/process" method="post">
<input required type="hidden" name="cmd" value="_paynow">
<input required type="hidden" name="receiver" pattern="[0-9]" value="33568687">
<input type="hidden" name="return_url" value="https://app.slateone.studio/payment/success?plan=tier_1">
<input type="hidden" name="cancel_url" value="https://app.slateone.studio/payment/cancel?plan=tier_1">
<input type="hidden" name="notify_url" value="https://api.slateone.studio/api/payfast/notify?plan=tier_1">
<input required type="hidden" name="amount" value="450">
<input required type="hidden" name="item_name" maxlength="255" value="Tier 1">
<input type="hidden" name="item_description" maxlength="255" value="Pay-Per-Breakdown">
<table><tr><td colspan=2 align=center>
<input type="image" src="https://my.payfast.io/images/buttons/BuyNow/Light-Small-BuyNow.png" alt="Buy Now" title="Buy Now with Payfast">
</td></tr></table>
</form>
```

**Charge 2 — Member Seat (Tier 2) — quantity button form**

```html
<script type="text/javascript">
function customQuantitiesPayFast (formReference) {
formReference['amount'].value = formReference['amount'].value * formReference['custom_quantity'].value;
return true;
}
</script>
<script type="text/javascript">
function actionPayFastJavascript ( formReference ) {
let shippingValidOrOff = typeof shippingValid !== 'undefined' ? shippingValid : true;
let customValid = shippingValidOrOff ? customQuantitiesPayFast( formReference ) : false;
 if (typeof shippingValid !== 'undefined' && !shippingValid) { return false; }
if (typeof customValid !== 'undefined' && !customValid) { return false; }
return true;
 }
</script>
<form onsubmit="return actionPayFastJavascript( this );" name="PayFastPayNowForm" action="https://payment.payfast.io/eng/process" method="post">
<input required type="hidden" name="cmd" value="_paynow">
<input required type="hidden" name="receiver" pattern="[0-9]" value="33568687">
<input type="hidden" name="return_url" value="https://app.slateone.studio/payment/success?type=seats">
<input type="hidden" name="cancel_url" value="https://app.slateone.studio/payment/cancel?type=seats">
<input type="hidden" name="notify_url" value="https://api.slateone.studio/api/payfast/notify?type=seats">
<input required type="hidden" name="amount" value="150">
<table><tr><td><label for="custom_quantity">Quantity: </label></td>
<td><input required id="custom_quantity" type="number" name="custom_quantity" value="1"></td></tr></table>
<input required type="hidden" name="item_name" maxlength="255" value="Tier_2_seat">
<input type="hidden" name="item_description" maxlength="255" value="Member Seat">
<table><tr><td colspan=2 align=center>
<input type="image" src="https://my.payfast.io/images/buttons/BuyNow/Light-Small-BuyNow.png" alt="Buy Now" title="Buy Now with Payfast">
</td></tr></table>
</form>
```

**Charge 2 — email link**

```html
<a href="https://payment.payfast.io/eng/process?cmd=_paynow&receiver=33568687&item_name=Tier_2_seat&email_confirmation=1&confirmation_address=hello@slateone.studio&item_description=Member+Seat&return_url=https://app.slateone.studio/payment/success?type=seats&cancel_url=https://app.slateone.studio/payment/cancel?type=seats&notify_url=https://api.slateone.studio/api/payfast/notify?type=seats&amount=150">Buy Now</a>
```

**Charge 3 — Annual Team License (Tier 2) — subscription button form**

```html
<form name="PayFastPayNowForm" action="https://payment.payfast.io/eng/process" method="post">
<input required type="hidden" name="cmd" value="_paynow">
<input required type="hidden" name="receiver" pattern="[0-9]" value="33568687">
<input type="hidden" name="return_url" value="https://app.slateone.studio/payment/success?plan=tier_2">
<input type="hidden" name="cancel_url" value="https://app.slateone.studio/payment/cancel?plan=tier_2">
<input type="hidden" name="notify_url" value="https://api.slateone.studio/api/payfast/notify?plan=tier_2">
<input required type="hidden" name="amount" value="1850">
<input required type="hidden" name="item_name" maxlength="255" value="Tier_2_Annual">
<input type="hidden" name="item_description" maxlength="255" value="Tier 2 Annual Subscription">
<input required type="hidden" name="subscription_type" pattern="1" value="1">
<input type="hidden" name="recurring_amount" value="1850">
<input required type="hidden" name="cycles" pattern="[0-9]" value="0">
<input required type="hidden" name="frequency" pattern="[0-9]" value="6">
<table><tr><td colspan=2 align=center>
<input type="image" src="https://my.payfast.io/images/buttons/Subscribe/Primary-Small-Subscribe.png" alt="Subscribe" title="Subscribe with Payfast">
</td></tr></table>
</form>
```

**Charge 3 — email link**

```html
<a href="https://payment.payfast.io/eng/process?cmd=_paynow&receiver=33568687&item_name=Tier_2_Annual&email_confirmation=1&confirmation_address=hello@slateone.studio&item_description=Tier+2+Annual+Subscription&return_url=https://app.slateone.studio/payment/success?plan=tier_2&cancel_url=https://app.slateone.studio/payment/cancel?plan=tier_2&notify_url=https://api.slateone.studio/api/payfast/notify?plan=tier_2&amount=1850&subscription_type=1&recurring_amount=1850&cycles=0&frequency=6">Subscribe</a>
```


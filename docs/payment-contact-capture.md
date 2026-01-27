# Payment Contact Capture Implementation

## Overview
This document describes the modal-based contact capture system implemented before Yoco payment redirects. This enables full conversion funnel tracking and follow-up capabilities.

## Architecture

### Database Schema
**Table:** `payment_leads`

```sql
- id: UUID (primary key)
- email: TEXT (required)
- name: TEXT (required)
- phone: TEXT (optional)
- payment_tier: 'R49' | 'R249'
- status: 'intent' | 'redirected' | 'completed' | 'abandoned'
- yoco_url: TEXT (generated with tracking params)
- tracking_id: TEXT (unique identifier)
- source: TEXT (default: 'how_it_works_section')
- redirected_at: TIMESTAMPTZ
- completed_at: TIMESTAMPTZ
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### Status Flow
1. **intent** - User opened modal and submitted contact info
2. **redirected** - User was redirected to Yoco payment page
3. **completed** - Payment confirmed (via webhook)
4. **abandoned** - User didn't complete payment (detected via scheduled job)

## Components

### 1. PaymentModal Component
**Location:** `/components/PaymentModal.tsx`

**Features:**
- Email (required)
- Name (required)
- Phone (optional for R249 tier)
- Form validation
- Loading states
- Error handling
- Auto-redirect to Yoco after submission

### 2. Updated HowItWorks Component
**Location:** `/components/HowItWorks.tsx`

**Changes:**
- Replaced direct `<a>` links with `<button>` elements
- Added modal state management
- Integrated PaymentModal component

### 3. Supabase Functions
**Location:** `/lib/supabase.ts`

**New Functions:**
- `createPaymentLead(leadData)` - Creates payment intent record
- `updatePaymentLeadStatus(trackingId, status)` - Updates lead status
- `generateTrackingId()` - Generates unique tracking identifier

## User Flow

```
1. User clicks "Try 1 Script (R49)" or "Join Beta (R249)"
   ↓
2. Modal appears requesting contact information
   ↓
3. User fills form (email, name, phone?)
   ↓
4. Submit → Creates payment_leads record with status='intent'
   ↓
5. Auto-redirect to Yoco with tracking params
   - URL: https://pay.yoco.com/r/[code]?ref=[tracking_id]&email=[email]
   - Status updated to 'redirected'
   ↓
6. User completes payment on Yoco
   ↓
7. Yoco webhook updates status to 'completed'
```

## Tracking & Analytics

### Conversion Funnel Metrics
```sql
-- Total payment intents
SELECT COUNT(*) FROM payment_leads WHERE status = 'intent';

-- Redirected to payment page
SELECT COUNT(*) FROM payment_leads WHERE status = 'redirected';

-- Completed payments
SELECT COUNT(*) FROM payment_leads WHERE status = 'completed';

-- Abandoned carts
SELECT COUNT(*) FROM payment_leads WHERE status = 'abandoned';

-- Conversion rate (intent → completed)
SELECT 
  (COUNT(*) FILTER (WHERE status = 'completed')::float / 
   COUNT(*) FILTER (WHERE status IN ('intent', 'redirected', 'completed'))) * 100 
  AS conversion_rate
FROM payment_leads;
```

### Tier Performance
```sql
-- Breakdown by payment tier
SELECT 
  payment_tier,
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE status = 'completed') as completed,
  COUNT(*) FILTER (WHERE status = 'abandoned') as abandoned
FROM payment_leads
GROUP BY payment_tier;
```

## Next Steps

### 1. Yoco Webhook Integration
Create webhook endpoint to receive payment confirmations:

```typescript
// /api/webhooks/yoco
export async function POST(request: Request) {
  const payload = await request.json();
  
  // Extract tracking ID from payment metadata
  const trackingId = payload.metadata?.ref;
  
  if (payload.status === 'successful' && trackingId) {
    await updatePaymentLeadStatus(trackingId, 'completed');
  }
  
  return new Response('OK', { status: 200 });
}
```

### 2. Abandoned Cart Recovery
Schedule a daily job to identify and email abandoned carts:

```sql
-- Find abandoned carts (redirected but not completed after 24 hours)
SELECT * FROM payment_leads
WHERE status = 'redirected'
  AND redirected_at < NOW() - INTERVAL '24 hours'
  AND completed_at IS NULL;
```

### 3. Email Automation
- **Immediate:** Receipt email after payment completion
- **24 hours:** Abandoned cart reminder
- **7 days:** Follow-up for uncompleted intents

### 4. Analytics Dashboard
Track key metrics:
- Daily/weekly/monthly conversion rates
- Average time from intent to completion
- Tier preference (R49 vs R249)
- Source attribution

## Database Migration

To apply the schema, run the migration in Supabase:

```bash
# Via Supabase CLI
supabase db push

# Or manually in Supabase SQL Editor
# Copy contents of /supabase/migrations/create_payment_leads.sql
```

## Testing Checklist

- [ ] Modal opens when clicking payment cards
- [ ] Form validation works (required fields)
- [ ] Email format validation
- [ ] Loading state during submission
- [ ] Error handling for failed submissions
- [ ] Successful redirect to Yoco with tracking params
- [ ] Database record created with correct data
- [ ] Status updates from 'intent' to 'redirected'
- [ ] Modal closes on ESC key
- [ ] Modal closes on backdrop click
- [ ] Responsive design on mobile

## Security Considerations

- ✅ Row Level Security (RLS) enabled on `payment_leads` table
- ✅ Anonymous users can only insert/update (no read access to others' data)
- ✅ Email addresses are stored securely
- ✅ No sensitive payment data stored (handled by Yoco)
- ✅ Tracking IDs are unique and unpredictable

## Benefits

1. **Complete Funnel Visibility** - Track every step from intent to completion
2. **Abandoned Cart Recovery** - Follow up with users who didn't complete payment
3. **Attribution** - Know which sections/campaigns drive conversions
4. **Personalization** - Welcome emails with user's name
5. **Customer Support** - Contact users if payment issues occur
6. **Analytics** - Data-driven optimization of pricing and messaging

## Support

For issues or questions:
- Check Supabase logs for database errors
- Review browser console for frontend errors
- Verify Yoco webhook configuration
- Test with different email providers

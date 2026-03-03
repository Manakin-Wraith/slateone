# Persona-Based Email System - Deployment Guide

## Quick Start

This guide walks you through deploying the persona-based email system for SlateOne waitlist confirmations.

---

## Prerequisites

- Supabase CLI installed
- Access to SlateOne Supabase project
- Resend API key configured

---

## Step 1: Deploy Database Migration

### Option A: Using Supabase CLI (Recommended)

```bash
# Navigate to project root
cd /Users/thecasterymedia/slateone

# Link to your Supabase project (if not already linked)
supabase link --project-ref twzfaizeyqwevmhjyicz

# Apply migration
supabase db push

# Verify migration
supabase db diff
```

### Option B: Using Supabase Dashboard

1. Go to https://supabase.com/dashboard/project/twzfaizeyqwevmhjyicz
2. Navigate to **SQL Editor**
3. Copy contents of `supabase/migrations/add_user_type_to_waitlist.sql`
4. Paste and run
5. Verify in **Table Editor** → `waitlist` → check for `user_type` column

### Verify Migration Success

```sql
-- Check column exists
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'waitlist' AND column_name = 'user_type';

-- Check backfill worked
SELECT user_type, COUNT(*) 
FROM waitlist 
GROUP BY user_type;

-- Test trigger
INSERT INTO waitlist (email, role) 
VALUES ('test@example.com', 'Producer');

SELECT email, role, user_type 
FROM waitlist 
WHERE email = 'test@example.com';

-- Cleanup test
DELETE FROM waitlist WHERE email = 'test@example.com';
```

---

## Step 2: Deploy Edge Function

### Option A: Using Supabase CLI

```bash
# Deploy the new version
supabase functions deploy send-waitlist-confirmation \
  --project-ref twzfaizeyqwevmhjyicz

# Set environment variables (if not already set)
supabase secrets set RESEND_API_KEY=re_gtgcoYQP_HTJe9TWSL72aB7jkfjpWZQN1
```

### Option B: Manual Deployment via Dashboard

1. Go to **Edge Functions** in Supabase Dashboard
2. Find `send-waitlist-confirmation` function
3. Replace code with contents of `send-waitlist-confirmation-email-template-v2.ts`
4. Save and deploy

### Test Edge Function

```bash
# Test with professional persona
curl -X POST \
  'https://twzfaizeyqwevmhjyicz.supabase.co/functions/v1/send-waitlist-confirmation' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "record": {
      "email": "test-producer@example.com",
      "role": "Producer",
      "user_type": "professional"
    }
  }'

# Test with student persona
curl -X POST \
  'https://twzfaizeyqwevmhjyicz.supabase.co/functions/v1/send-waitlist-confirmation' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "record": {
      "email": "test-student@example.com",
      "role": "Student",
      "user_type": "student"
    }
  }'
```

---

## Step 3: Update Database Trigger (If Needed)

If the Edge Function isn't automatically triggered, ensure the database trigger is set up:

```sql
-- Check if trigger exists
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name LIKE '%waitlist%';

-- If needed, create trigger to call Edge Function on survey completion
CREATE OR REPLACE FUNCTION trigger_send_confirmation_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Only send email when survey is completed
  IF NEW.survey_completed_at IS NOT NULL AND OLD.survey_completed_at IS NULL THEN
    PERFORM
      net.http_post(
        url := 'https://twzfaizeyqwevmhjyicz.supabase.co/functions/v1/send-waitlist-confirmation',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
        ),
        body := jsonb_build_object('record', row_to_json(NEW))
      );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER send_confirmation_email_trigger
  AFTER UPDATE ON waitlist
  FOR EACH ROW
  EXECUTE FUNCTION trigger_send_confirmation_email();
```

---

## Step 4: Test End-to-End

### Test Professional Flow

1. Go to https://slateone.studio
2. Join waitlist with email: `test-pro@yourdomain.com`
3. Complete survey selecting **"Producer"** as role
4. Check email inbox for professional version
5. Verify subject: "Welcome to SlateOne Beta"

### Test Student Flow

1. Go to https://slateone.studio
2. Join waitlist with email: `test-student@yourdomain.com`
3. Complete survey selecting **"Student"** as role
4. Check email inbox for student version
5. Verify subject: "Welcome to SlateOne Beta - Learn & Build With Us"

---

## Step 5: Monitor & Validate

### Check Logs

```bash
# View Edge Function logs
supabase functions logs send-waitlist-confirmation --project-ref twzfaizeyqwevmhjyicz

# Look for persona routing logs
# Should see: "Sending professional email to..." or "Sending student email to..."
```

### Query Analytics

```sql
-- Check persona distribution
SELECT 
  user_type,
  COUNT(*) as total_users,
  COUNT(CASE WHEN survey_completed_at IS NOT NULL THEN 1 END) as completed_surveys
FROM waitlist
GROUP BY user_type;

-- Check recent signups with persona
SELECT 
  email,
  role,
  user_type,
  created_at,
  survey_completed_at
FROM waitlist
ORDER BY created_at DESC
LIMIT 10;
```

---

## Rollback Plan

If issues arise, revert to single template:

### Quick Rollback

```bash
# Redeploy old Edge Function
supabase functions deploy send-waitlist-confirmation \
  --project-ref twzfaizeyqwevmhjyicz \
  --file send-waitlist-confirmation-email-template.ts
```

### Database Rollback (Optional)

```sql
-- Drop trigger
DROP TRIGGER IF EXISTS trigger_set_user_type ON waitlist;
DROP FUNCTION IF EXISTS set_user_type_from_role();
DROP FUNCTION IF EXISTS compute_user_type(TEXT);

-- Remove column (only if necessary)
ALTER TABLE waitlist DROP COLUMN IF EXISTS user_type;
```

---

## Troubleshooting

### Issue: Emails not sending

**Check:**
1. Resend API key is valid
2. Edge Function logs for errors
3. Database trigger is firing
4. Email addresses are valid

**Fix:**
```bash
# Check Edge Function status
supabase functions list

# View recent errors
supabase functions logs send-waitlist-confirmation --tail
```

### Issue: Wrong persona email sent

**Check:**
1. `user_type` field populated correctly
2. Role mapping logic in `getUserType()`
3. Survey role options match mapping

**Fix:**
```sql
-- Manually fix user_type for specific users
UPDATE waitlist 
SET user_type = 'student' 
WHERE role = 'Student' AND user_type != 'student';
```

### Issue: Trigger not auto-populating user_type

**Check:**
```sql
-- Verify trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'trigger_set_user_type';

-- Test trigger manually
UPDATE waitlist 
SET role = 'Producer' 
WHERE email = 'test@example.com';

SELECT email, role, user_type FROM waitlist WHERE email = 'test@example.com';
```

---

## Performance Considerations

- **Index on user_type**: Already created in migration
- **Edge Function cold starts**: ~500ms first call, <100ms warm
- **Email delivery**: Resend typically <2 seconds
- **Database trigger**: Negligible overhead (<10ms)

---

## Monitoring Metrics

Track these KPIs post-deployment:

1. **Email delivery rate** by persona
2. **Open rate** by persona (via Resend dashboard)
3. **Survey completion rate** by persona
4. **Time to first login** by persona
5. **Feature adoption** by persona

---

## Next Steps

After successful deployment:

1. Monitor for 1 week
2. Gather qualitative feedback
3. Compare open rates between personas
4. Iterate on email content based on data
5. Consider A/B testing subject lines

---

## Support

- **Supabase Issues**: Check project logs and status page
- **Resend Issues**: Check Resend dashboard and API logs
- **Code Issues**: Review Edge Function logs and error traces

---

## Changelog

- **2025-01-28**: Initial persona-based email system deployed
  - Added `user_type` field to waitlist table
  - Created professional and student email variants
  - Implemented routing logic in Edge Function
  - Added automatic persona detection via trigger

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function addToWaitlist(email: string, source: string = 'landing_page') {
  const { data, error } = await supabase
    .from('waitlist')
    .insert([{ email, source }])
    .select()
    .single();

  if (error) {
    // Handle duplicate email
    if (error.code === '23505') {
      return { success: false, error: 'already_registered' };
    }
    console.error('Waitlist error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export interface SurveyData {
  role: string;
  scripts_per_year: string;
  current_tool: string;
  breakdown_time: string;
  is_vip: boolean;
}

export async function updateWaitlistSurvey(email: string, surveyData: SurveyData) {
  const { data, error } = await supabase
    .from('waitlist')
    .update({
      role: surveyData.role,
      scripts_per_year: surveyData.scripts_per_year,
      current_tool: surveyData.current_tool,
      breakdown_time: surveyData.breakdown_time,
      is_vip: surveyData.is_vip,
      survey_completed_at: new Date().toISOString()
    })
    .eq('email', email)
    .select()
    .single();

  if (error) {
    console.error('Survey update error:', error);
    return { success: false, error: error.message };
  }

  // Send confirmation email
  if (data) {
    try {
      await sendConfirmationEmail(data);
    } catch (e) {
      console.error('Failed to send confirmation email:', e);
      // Don't fail the whole operation if email fails
    }
  }

  return { success: true, data };
}

async function sendConfirmationEmail(record: any) {
  const response = await fetch(`${supabaseUrl}/functions/v1/send-waitlist-confirmation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({ record }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to send email');
  }

  return response.json();
}

function generateTrackingId(): string {
  return `sl_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// ── Pricing tiers (2026-07) ──────────────────────────────────────────────
// tier_1 = Pay-Per-Breakdown (R450 per breakdown)
// tier_2 = Annual Team License (R1,850/yr + R150 per seat)
// The landing page captures the email as a lead, then redirects to the app
// signup page. The app backend maps the `plan` query param to the full
// signup_plan id (tier_1_pay_per_breakdown / tier_2_annual_team).
export type PricingTier = 'tier_1' | 'tier_2';

// Headline ZAR amount stored on the lead for analytics (not a charge here).
const TIER_PRICE: Record<PricingTier, number> = {
  tier_1: 450,
  tier_2: 1850,
};

// Where the CTA sends the user to complete signup on the product app.
const APP_SIGNUP_BASE_URL = 'https://app.slateone.studio/login';

export interface PricingLeadData {
  email: string;
  tier: PricingTier;
  source?: string;
}

export async function createPricingLead(leadData: PricingLeadData) {
  const trackingId = generateTrackingId();
  const source = leadData.source || 'pricing_section';

  const signupUrl =
    `${APP_SIGNUP_BASE_URL}?mode=signup&plan=${leadData.tier}` +
    `&source=${encodeURIComponent(source)}&ref=${trackingId}`;

  // Lead capture is best-effort; a save failure must not block the redirect.
  const { error } = await supabase
    .from('payment_leads')
    .insert([{
      email: leadData.email,
      name: '',
      payment_tier: leadData.tier,
      tier_price: TIER_PRICE[leadData.tier],
      yoco_url: signupUrl,
      tracking_id: trackingId,
      source,
      status: 'intent',
    }]);

  if (error) {
    console.error('Pricing lead save error (non-blocking):', error.message);
  }

  return { success: true, signupUrl, trackingId };
}

export async function updatePaymentLeadStatus(
  trackingId: string, 
  status: 'redirected' | 'completed' | 'abandoned'
) {
  const updateData: any = { status };
  
  if (status === 'redirected') {
    updateData.redirected_at = new Date().toISOString();
  } else if (status === 'completed') {
    updateData.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('payment_leads')
    .update(updateData)
    .eq('tracking_id', trackingId)
    .select()
    .single();

  if (error) {
    console.error('Payment lead status update error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

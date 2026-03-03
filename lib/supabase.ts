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

export interface PaymentLeadData {
  email: string;
  name: string;
  phone?: string;
  payment_tier: 'R49' | 'R249';
  source?: string;
}

function generateTrackingId(): string {
  return `sl_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export async function createPaymentLead(leadData: PaymentLeadData) {
  const trackingId = generateTrackingId();
  const yocoBaseUrl = leadData.payment_tier === 'R49' 
    ? 'https://pay.yoco.com/r/m9jYrx'
    : 'https://pay.yoco.com/r/mEDpxp';
  
  const yocoUrl = `${yocoBaseUrl}?ref=${trackingId}&email=${encodeURIComponent(leadData.email)}`;

  const { data, error } = await supabase
    .from('payment_leads')
    .insert([{
      email: leadData.email,
      name: leadData.name,
      phone: leadData.phone || null,
      payment_tier: leadData.payment_tier,
      yoco_url: yocoUrl,
      tracking_id: trackingId,
      source: leadData.source || 'how_it_works_section',
      status: 'intent'
    }])
    .select()
    .single();

  if (error) {
    console.error('Payment lead creation error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data, yocoUrl, trackingId };
}

export type SubscriptionTier = 'development_os' | 'producer_os' | 'studio_os';

export interface SubscriptionLeadData {
  email: string;
  name: string;
  phone?: string;
  company?: string;
  payment_tier: SubscriptionTier;
  source?: string;
}

const TIER_CONFIG: Record<SubscriptionTier, { dbTier: string; price: number; yocoUrl: string | null }> = {
  development_os: {
    dbTier: 'R499',
    price: 499,
    yocoUrl: 'https://pay.yoco.com/celebration-house-entertainment?amount=499.00&reference=development-os',
  },
  producer_os: {
    dbTier: 'R1999',
    price: 1999,
    yocoUrl: 'https://pay.yoco.com/celebration-house-entertainment?amount=1999.00&reference=producer-os',
  },
  studio_os: {
    dbTier: 'R3499',
    price: 3499,
    yocoUrl: null, // Studio OS uses contact sales flow
  },
};

export async function createSubscriptionLead(leadData: SubscriptionLeadData) {
  const trackingId = generateTrackingId();
  const config = TIER_CONFIG[leadData.payment_tier];
  
  const yocoUrl = config.yocoUrl 
    ? `${config.yocoUrl}&ref=${trackingId}&email=${encodeURIComponent(leadData.email)}`
    : null;

  try {
    await supabase
      .from('payment_leads')
      .insert([{
        email: leadData.email,
        name: leadData.name,
        phone: leadData.phone || null,
        payment_tier: config.dbTier,
        yoco_url: yocoUrl || '',
        tracking_id: trackingId,
        source: `pricing_${leadData.payment_tier}${leadData.company ? `:${leadData.company}` : ''}`,
        status: 'intent'
      }]);
  } catch (e) {
    console.error('Subscription lead save error (non-blocking):', e);
  }

  return { success: true, yocoUrl, trackingId };
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

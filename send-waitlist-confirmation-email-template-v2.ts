import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = 're_gtgcoYQP_HTJe9TWSL72aB7jkfjpWZQN1';
const YOCO_PAYMENT_LINK = 'https://pay.yoco.com/r/mEDpxp';

interface WaitlistEntry {
  id: string;
  email: string;
  role?: string;
  scripts_per_year?: string;
  current_tool?: string;
  is_vip?: boolean;
  user_type?: 'professional' | 'student' | 'other';
  created_at: string;
}

type UserType = 'professional' | 'student' | 'other';

// Determine user type from role
function getUserType(role?: string): UserType {
  if (!role) return 'other';
  
  const professionalRoles = ['Producer', '1st AD', 'Line Manager'];
  
  if (professionalRoles.includes(role)) {
    return 'professional';
  } else if (role === 'Student') {
    return 'student';
  }
  return 'other';
}

// Generate professional email (current optimized version)
function generateProfessionalEmail(record: WaitlistEntry): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">
          <!-- Header -->
          <tr>
            <td style="padding-bottom: 32px;">
              <span style="font-size: 28px; font-weight: bold; color: #f0f0f0;">Slate<span style="color: #E3FF00;">One</span></span>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="background-color: #161616; border-radius: 12px; padding: 48px 40px; border: 1px solid #2a2a2a;">
              
              <!-- 1. Welcome + Value -->
              <h1 style="color: #f0f0f0; font-size: 28px; margin: 0 0 16px 0; font-weight: 600;">
                Welcome to SlateOne
              </h1>
              <p style="color: #a0a0a0; font-size: 15px; line-height: 1.6; margin: 0 0 12px 0;">
                We help you turn a script into a production-ready breakdown in minutes.
              </p>
              <p style="color: #a0a0a0; font-size: 15px; line-height: 1.6; margin: 0 0 32px 0;">
                <strong style="color: #E3FF00;">As a beta user, your feedback directly influences what we build next.</strong>
              </p>
              
              <div style="height: 1px; background-color: #2a2a2a; margin: 32px 0;"></div>
              
              <!-- 2. Why This Exists -->
              <h2 style="color: #f0f0f0; font-size: 18px; margin: 0 0 12px 0; font-weight: 600;">Built for SA Film Professionals</h2>
              <p style="color: #a0a0a0; font-size: 14px; line-height: 1.6; margin: 0 0 32px 0;">
                We're film people in South Africa who got tired of manual breakdowns and expensive overseas tools. So we built this.
              </p>
              
              <div style="height: 1px; background-color: #2a2a2a; margin: 32px 0;"></div>
              
              <!-- 3. What Works Today -->
              <h2 style="color: #f0f0f0; font-size: 18px; margin: 0 0 12px 0; font-weight: 600;">What You Can Expect in Beta</h2>
              <ul style="color: #a0a0a0; font-size: 14px; line-height: 1.8; margin: 0 0 12px 0; padding-left: 20px;">
                <li><strong style="color: #fff;">Fast AI script breakdowns</strong> — cast, props, locations, FX, wardrobe</li>
                <li><strong style="color: #fff;">Team collaboration</strong> — unlimited seats, no extra cost</li>
                <li><strong style="color: #fff;">Weekly improvements</strong> — based on your feedback</li>
              </ul>
              <p style="color: #666; font-size: 13px; line-height: 1.6; margin: 0 0 32px 0;">
                We're actively improving accuracy, exports, and speed. If something breaks, tell us.
              </p>
              
              <div style="height: 1px; background-color: #2a2a2a; margin: 32px 0;"></div>
              
              <!-- 4. What We Need From You -->
              <h2 style="color: #f0f0f0; font-size: 18px; margin: 0 0 12px 0; font-weight: 600;">What We Need From You</h2>
              <p style="color: #a0a0a0; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0;">
                <strong style="color: #fff;">Use it. Break a script. Tell us what's missing.</strong>
              </p>
              <p style="color: #a0a0a0; font-size: 14px; line-height: 1.6; margin: 0 0 32px 0;">
                Your feedback determines which features we build, how the interface works, and what we charge.
              </p>
              
              <div style="height: 1px; background-color: #2a2a2a; margin: 32px 0;"></div>
              
              <!-- 5. What Happens Next -->
              <h2 style="color: #f0f0f0; font-size: 18px; margin: 0 0 12px 0; font-weight: 600;">What Happens Next</h2>
              <ol style="color: #a0a0a0; font-size: 14px; line-height: 1.8; margin: 0 0 24px 0; padding-left: 20px;">
                <li>We'll send login credentials within 24 hours</li>
                <li>Upload your script and get your first breakdown (free during beta)</li>
                <li>Share what works and what doesn't</li>
              </ol>
              
              <div style="background-color: #1a1a1a; border-left: 3px solid #E3FF00; padding: 16px 20px; margin: 24px 0; border-radius: 4px;">
                <p style="color: #a0a0a0; font-size: 13px; line-height: 1.6; margin: 0;">
                  <strong style="color: #E3FF00;">Our commitment:</strong> We read every piece of feedback, ship updates weekly, and keep pricing fair for SA budgets.
                </p>
              </div>
              
              <div style="height: 1px; background-color: #2a2a2a; margin: 32px 0;"></div>
              
              <!-- Close -->
              <p style="color: #f0f0f0; font-size: 14px; margin: 0 0 8px 0;">
                The SlateOne Team
              </p>
              <p style="color: #666; font-size: 12px; margin: 0;">
                hello@slateone.studio
              </p>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding-top: 32px; text-align: center;">
              <p style="color: #505050; font-size: 12px; margin: 0;">© 2025 SlateOne · Built for the SA Film Industry</p>
              <p style="color: #404040; font-size: 11px; margin: 8px 0 0 0;">You received this because you signed up at slateone.studio</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

// Generate student/learner email
function generateStudentEmail(record: WaitlistEntry): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">
          <!-- Header -->
          <tr>
            <td style="padding-bottom: 32px;">
              <span style="font-size: 28px; font-weight: bold; color: #f0f0f0;">Slate<span style="color: #E3FF00;">One</span></span>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="background-color: #161616; border-radius: 12px; padding: 48px 40px; border: 1px solid #2a2a2a;">
              
              <!-- 1. Welcome + Learning -->
              <h1 style="color: #f0f0f0; font-size: 28px; margin: 0 0 16px 0; font-weight: 600;">
                Welcome to SlateOne
              </h1>
              <p style="color: #a0a0a0; font-size: 15px; line-height: 1.6; margin: 0 0 12px 0;">
                You're joining a community of SA film students learning professional breakdown techniques.
              </p>
              <p style="color: #a0a0a0; font-size: 15px; line-height: 1.6; margin: 0 0 32px 0;">
                <strong style="color: #E3FF00;">As a beta user, you're not just testing—you're helping shape the future of film production tools.</strong>
              </p>
              
              <div style="height: 1px; background-color: #2a2a2a; margin: 32px 0;"></div>
              
              <!-- 2. Why We Built This -->
              <h2 style="color: #f0f0f0; font-size: 18px; margin: 0 0 12px 0; font-weight: 600;">Why We Built This</h2>
              <p style="color: #a0a0a0; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0;">
                Film school taught us storytelling, but not the practical tools we'd need on set.
              </p>
              <p style="color: #a0a0a0; font-size: 14px; line-height: 1.6; margin: 0 0 32px 0;">
                We spent years learning script breakdowns the hard way—Excel sheets, late nights, and lots of mistakes. We want to change that for the next generation of SA filmmakers.
              </p>
              
              <div style="height: 1px; background-color: #2a2a2a; margin: 32px 0;"></div>
              
              <!-- 3. What You'll Learn -->
              <h2 style="color: #f0f0f0; font-size: 18px; margin: 0 0 12px 0; font-weight: 600;">What You'll Learn in Beta</h2>
              <ul style="color: #a0a0a0; font-size: 14px; line-height: 1.8; margin: 0 0 12px 0; padding-left: 20px;">
                <li><strong style="color: #fff;">Professional breakdown workflows</strong> — how industry pros analyze scripts</li>
                <li><strong style="color: #fff;">AI-powered tools</strong> — learn to work with modern production tech</li>
                <li><strong style="color: #fff;">Team collaboration</strong> — practice working with crew members</li>
                <li><strong style="color: #fff;">Industry standards</strong> — SA-specific formatting and practices</li>
              </ul>
              <p style="color: #666; font-size: 13px; line-height: 1.6; margin: 0 0 32px 0;">
                Plus, you'll get hands-on experience with real production tools while building your portfolio.
              </p>
              
              <div style="height: 1px; background-color: #2a2a2a; margin: 32px 0;"></div>
              
              <!-- 4. Join the Community -->
              <h2 style="color: #f0f0f0; font-size: 18px; margin: 0 0 12px 0; font-weight: 600;">You're Part of the Community</h2>
              <p style="color: #a0a0a0; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0;">
                <strong style="color: #fff;">Your feedback matters.</strong> A lot.
              </p>
              <p style="color: #a0a0a0; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
                Tell us what works, what doesn't, and what features would help you learn faster. We're building this with you, not just for you.
              </p>
              <ul style="color: #a0a0a0; font-size: 14px; line-height: 1.8; margin: 0 0 32px 0; padding-left: 20px;">
                <li>Connect with other film students in beta</li>
                <li>Share your breakdowns and learn from others</li>
                <li>Get direct support from our team</li>
                <li>Build real-world production experience</li>
              </ul>
              
              <div style="height: 1px; background-color: #2a2a2a; margin: 32px 0;"></div>
              
              <!-- 5. Your Journey Starts Here -->
              <h2 style="color: #f0f0f0; font-size: 18px; margin: 0 0 12px 0; font-weight: 600;">Your Journey Starts Here</h2>
              <ol style="color: #a0a0a0; font-size: 14px; line-height: 1.8; margin: 0 0 24px 0; padding-left: 20px;">
                <li>We'll send your login credentials within 24 hours</li>
                <li>Upload a script from class or a personal project</li>
                <li>Get your first AI-powered breakdown (free during beta)</li>
                <li>Share your experience and help us improve</li>
              </ol>
              
              <div style="background-color: #1a1a1a; border-left: 3px solid #E3FF00; padding: 16px 20px; margin: 24px 0; border-radius: 4px;">
                <p style="color: #a0a0a0; font-size: 13px; line-height: 1.6; margin: 0;">
                  <strong style="color: #E3FF00;">Student promise:</strong> SlateOne will always be free for students during beta. We're here to help you learn, not to charge you for education.
                </p>
              </div>
              
              <div style="height: 1px; background-color: #2a2a2a; margin: 32px 0;"></div>
              
              <!-- Close -->
              <p style="color: #a0a0a0; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
                We're excited to have you on this journey. Let's build something that helps the next generation of SA filmmakers.
              </p>
              <p style="color: #f0f0f0; font-size: 14px; margin: 0 0 8px 0;">
                The SlateOne Team
              </p>
              <p style="color: #666; font-size: 12px; margin: 0;">
                hello@slateone.studio
              </p>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding-top: 32px; text-align: center;">
              <p style="color: #505050; font-size: 12px; margin: 0;">© 2025 SlateOne · Built for the SA Film Industry</p>
              <p style="color: #404040; font-size: 11px; margin: 8px 0 0 0;">You received this because you signed up at slateone.studio</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

// Route to appropriate email template
function getEmailContent(record: WaitlistEntry): { subject: string; html: string } {
  const userType = record.user_type || getUserType(record.role);
  
  switch (userType) {
    case 'professional':
      return {
        subject: 'Welcome to SlateOne Beta',
        html: generateProfessionalEmail(record)
      };
    case 'student':
      return {
        subject: 'Welcome to SlateOne Beta - Learn & Build With Us',
        html: generateStudentEmail(record)
      };
    default:
      return {
        subject: 'Welcome to SlateOne Beta',
        html: generateProfessionalEmail(record) // Default to professional
      };
  }
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const body = await req.json();
    const { record } = body as { record: WaitlistEntry };
    
    if (!record?.email) {
      return new Response(JSON.stringify({ error: 'No email provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get persona-specific email content
    const { subject, html } = getEmailContent(record);
    
    // Log persona routing for analytics
    console.log(`Sending ${record.user_type || getUserType(record.role)} email to ${record.email}`);

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'SlateOne <hello@slateone.studio>',
        to: [record.email],
        subject: subject,
        html: html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Resend error:', data);
      return new Response(JSON.stringify({ error: 'Failed to send email', details: data }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      id: data.id,
      persona: record.user_type || getUserType(record.role)
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

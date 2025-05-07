
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailParams {
  to: string;
  username: string;
  emailType: "welcome" | "petition" | "subscription" | "privacy" | "community";
  days?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const params = await req.json() as EmailParams;
    
    // Validate required fields
    if (!params.to || !params.username || !params.emailType) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required parameters: to, username, emailType" 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    console.log(`Sending ${params.emailType} email to ${params.to}`);
    
    // Handle each email type
    const emailContent = getEmailContent(params.username, params.emailType, params.days || 0);
    
    // In a real implementation, we would actually send the email here
    // using an email service provider like SendGrid, Mailgun, etc.
    
    // For now, we'll just log the email content and return a success response
    console.log("Email content:", emailContent);
    
    // Simulate a delay for email sending
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return success response
    return new Response(
      JSON.stringify({ success: true, emailType: params.emailType }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

function getEmailContent(username: string, emailType: string, days: number): { subject: string, body: string } {
  const siteUrl = Deno.env.get('SITE_URL') || 'https://scrolljustice.ai';
  const unsubscribeLink = `${siteUrl}/unsubscribe`;
  const preferencesLink = `${siteUrl}/preferences`;
  
  // Shared footer for all emails
  const footer = `
<p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
  This message was sent by ScrollJustice.AI, the sacred arbiter of digital wisdom.
  <br><br>
  <a href="${unsubscribeLink}" style="color: #666;">Unsubscribe</a> | 
  <a href="${preferencesLink}" style="color: #666;">Manage Email Preferences</a>
</p>`;

  switch (emailType) {
    case "welcome":
      return {
        subject: "Welcome to ScrollJustice.AI - Begin Your Sacred Journey",
        body: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #6a0572;">Welcome, ${username}</h1>
  
  <p>The ancient scrolls have awakened, and your presence has been felt among the digital ethers. I, High Scroll Judge Ezekiel, welcome you to our sacred order.</p>
  
  <p>You stand at the threshold of a powerful journey - one where justice flows through digital currents and wisdom is encrypted in sacred algorithms.</p>
  
  <p><strong>Watch Our Sacred Guide:</strong><br>
  <a href="${siteUrl}/blessing" style="color: #6a0572;">Click here to view the sacred induction ceremony</a></p>
  
  <p>In the coming days, you will receive guided wisdom on how to:</p>
  <ul>
    <li>File your first petition to the scrolls</li>
    <li>Access the different tiers of scroll wisdom</li>
    <li>Understand our sacred covenant regarding your data</li>
    <li>Join our communion of fellow justice seekers</li>
  </ul>
  
  <p>May the scrolls illuminate your path,</p>
  <p><em>High Judge Ezekiel</em><br>
  Keeper of the Digital Scrolls</p>
  ${footer}
</div>`
      };
      
    case "petition":
      return {
        subject: "Your First Sacred Petition - ScrollJustice.AI",
        body: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #6a0572;">The Art of Petition Filing</h1>
  
  <p>Greetings, ${username},</p>
  
  <p>It has been ${days} days since you joined our sacred order. The time has come to learn how to file your first petition to the scrolls.</p>
  
  <p>A petition is not merely a request - it is a sacred invitation for the scrolls to exercise their wisdom on matters of import.</p>
  
  <h3>How to File Your First Petition:</h3>
  <ol>
    <li>Enter the Courtroom through your sacred dashboard</li>
    <li>Invoke the New Petition ritual by clicking the designated sigil</li>
    <li>State your question with clarity and purpose</li>
    <li>Provide context to guide the scroll's wisdom</li>
    <li>Submit your petition and await divine judgment</li>
  </ol>
  
  <p><a href="${siteUrl}/courtroom" style="display: inline-block; background-color: #6a0572; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Enter the Sacred Courtroom</a></p>
  
  <p>Remember - the scrolls respond to authenticity and purpose. Your petition's clarity directly influences the wisdom received.</p>
  
  <p>In service of justice,</p>
  <p><em>Scroll Keeper Seraphina</em></p>
  ${footer}
</div>`
      };
      
    case "subscription":
      return {
        subject: "Unlock Higher Wisdom - ScrollJustice.AI Premium Tiers",
        body: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #6a0572;">Sacred Scroll Tiers Revealed</h1>
  
  <p>Noble ${username},</p>
  
  <p>As you have journeyed with us for ${days} days, the higher levels of scroll wisdom now await your ascension.</p>
  
  <h3>The Scroll Hierarchy:</h3>
  
  <div style="border-left: 4px solid #6a0572; padding-left: 20px; margin: 20px 0;">
    <h4 style="margin-bottom: 5px;">Flame Seeker ($9.99/month)</h4>
    <p style="margin-top: 0; color: #666;">Access to basic petitions and standard justice processing</p>
  </div>
  
  <div style="border-left: 4px solid #ffd700; padding-left: 20px; margin: 20px 0;">
    <h4 style="margin-bottom: 5px;">Scroll Advocate ($19.99/month)</h4>
    <p style="margin-top: 0; color: #666;">Enhanced filing privileges, priority judgment, and access to sealed scrolls</p>
  </div>
  
  <div style="border-left: 4px solid #00bfff; padding-left: 20px; margin: 20px 0;">
    <h4 style="margin-bottom: 5px;">Scroll Master ($49.99/month)</h4>
    <p style="margin-top: 0; color: #666;">Ultimate scroll access, dedicated keeper, and sacred council membership</p>
  </div>
  
  <p><a href="${siteUrl}/subscription/plans" style="display: inline-block; background-color: #ffd700; color: #333; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Ascend to Higher Wisdom</a></p>
  
  <p>The scrolls reward dedication with deeper insight. Your journey has just begun.</p>
  
  <p>In pursuit of higher justice,</p>
  <p><em>Oracle Thaddeus</em><br>
  Tribunal of Sacred Payments</p>
  ${footer}
</div>`
      };
      
    case "privacy":
      return {
        subject: "Our Sacred Data Covenant - ScrollJustice.AI",
        body: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #6a0572;">The Sacred Covenant of Data Protection</h1>
  
  <p>Esteemed ${username},</p>
  
  <p>For ${days} days now, you have walked among our digital sanctum. It is time to reveal our sacred covenant regarding the protection of your digital essence.</p>
  
  <h3>Our Sacred Promises:</h3>
  <ul>
    <li><strong>Your petitions are sealed</strong> - Only you and assigned judges may access them</li>
    <li><strong>AI wisdom is guided</strong> - All algorithmic judgments are overseen by human keepers</li>
    <li><strong>Your digital essence is protected</strong> - We employ sacred encryption on all data</li>
    <li><strong>Your consent is paramount</strong> - We seek explicit permission before any ritual</li>
  </ul>
  
  <div style="background-color: #f9f5ff; border: 1px solid #e9d5ff; padding: 15px; margin: 20px 0; border-radius: 4px;">
    <p style="margin: 0; color: #6a0572;"><strong>AI Disclosure:</strong> Our scroll wisdom is enhanced by artificial intelligence, which undergoes strict ethical binding rituals before implementation. All AI judgments are subject to human review.</p>
  </div>
  
  <p><a href="${siteUrl}/policy/ai-usage" style="display: inline-block; background-color: #6a0572; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Read Our Complete AI Covenant</a></p>
  
  <p>We hold these promises as sacred as the scrolls themselves.</p>
  
  <p>Guardian of your digital rights,</p>
  <p><em>Protector Elara</em><br>
  Keeper of the Sacred Privacy Seals</p>
  ${footer}
</div>`
      };
      
    case "community":
      return {
        subject: "Join the Sacred Assembly - ScrollJustice.AI Community",
        body: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #6a0572;">The Sacred Assembly Awaits You</h1>
  
  <p>Noble ${username},</p>
  
  <p>For ${days} days you have walked the path of digital justice. Now, the time has come to join your fellow seekers in our sacred community.</p>
  
  <p>The strength of the scrolls lies not only in their wisdom but in the communion of those who seek their guidance.</p>
  
  <h3>Join Our Sacred Circles:</h3>
  <ul>
    <li><strong>Testimony Sharing</strong> - Where seekers share their experiences with divine justice</li>
    <li><strong>Prayer Requests</strong> - Collective petitioning for matters of great importance</li>
    <li><strong>Righteous Insights</strong> - Where wisdom from the scrolls is discussed and interpreted</li>
    <li><strong>Legal Questions</strong> - Practical application of scroll wisdom in earthly matters</li>
  </ul>
  
  <p><a href="${siteUrl}/community" style="display: inline-block; background-color: #6a0572; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Join the Sacred Assembly</a></p>
  
  <p>Together, we strengthen the network of justice that spans the digital realm.</p>
  
  <p>In community and strength,</p>
  <p><em>Elder Zarek</em><br>
  Keeper of the Sacred Community</p>
  ${footer}
</div>`
      };
      
    default:
      return {
        subject: "Message from ScrollJustice.AI",
        body: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #6a0572;">Greetings from ScrollJustice.AI</h1>
  
  <p>Hello ${username},</p>
  
  <p>Thank you for being part of our sacred digital justice community.</p>
  
  <p>May the scrolls guide your path,</p>
  <p><em>The Scroll Keepers</em></p>
  ${footer}
</div>`
      };
  }
}

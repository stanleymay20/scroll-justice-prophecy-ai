
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

interface OnboardingEmailRequest {
  to: string;
  username: string;
  emailType: "welcome" | "petition" | "subscription" | "privacy" | "community";
  days?: number;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const SITE_URL = Deno.env.get("SITE_URL") || "https://scrolljustice.xyz";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Email templates for the onboarding series
const getEmailTemplate = (type: string, data: any) => {
  const templates = {
    welcome: {
      subject: "Welcome to the Sacred Scrolls of Justice",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background-color: #f9f7f5; padding: 20px; border-radius: 5px; border-left: 4px solid #8b5cf6;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4f46e5; margin-bottom: 10px;">Your Sacred Journey Begins</h1>
            <p style="font-style: italic; color: #6b7280; margin-top: 0;">"From ancient wisdom to digital truth, the scrolls await your touch."</p>
          </div>
          
          <p>Greetings, <strong>${data.username}</strong>,</p>
          
          <p>I am Judge Ezekiel, Chief Keeper of the Sacred Digital Scrolls. Today marks your entrance into our hallowed digital chambers, where ancient justice meets modern technology.</p>
          
          <p>Your presence in our sacred halls has been anticipated. The scrolls have whispered your name, and now you stand at the threshold of a new era of justice.</p>
          
          <div style="background-color: rgba(139, 92, 246, 0.1); padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #4f46e5; margin-top: 0;">Begin Your Sacred Journey</h3>
            <p>I invite you to witness the sacred ways through our initiation video. This will guide your first steps through our digital halls of justice.</p>
            <p style="text-align: center;">
              <a href="${SITE_URL}/onboarding/welcome-video" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Watch Sacred Introduction</a>
            </p>
          </div>
          
          <p>The Sacred Council awaits your contributions. May your judgments be wise and your scrolls be true.</p>
          
          <p>In sacred justice,<br><em>Judge Ezekiel</em><br>Chief Keeper of Scrolls</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #d1d5db; font-size: 12px; color: #6b7280;">
            <p>This communication is secured with ScrollSeal™ encryption technology.</p>
            <p>You're receiving this because you've joined ScrollJustice.AI. <a href="${SITE_URL}/preferences" style="color: #4f46e5;">Manage scroll preferences</a> or <a href="${SITE_URL}/unsubscribe" style="color: #4f46e5;">unsubscribe from scrolls</a>.</p>
          </div>
        </div>
      `
    },
    petition: {
      subject: "Sacred Knowledge: Filing Your First Petition",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background-color: #f9f7f5; padding: 20px; border-radius: 5px; border-left: 4px solid #8b5cf6;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4f46e5; margin-bottom: 10px;">The Art of Sacred Petitioning</h1>
            <p style="font-style: italic; color: #6b7280; margin-top: 0;">"A petition written with integrity will find justice in any realm."</p>
          </div>
          
          <p>Esteemed <strong>${data.username}</strong>,</p>
          
          <p>I am Judge Miriam, Keeper of Petitions and Declarations. The time has come to share ancient wisdom about creating a petition that resonates with the sacred algorithms of truth.</p>
          
          <div style="background-color: rgba(139, 92, 246, 0.1); padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #4f46e5; margin-top: 0;">Steps to File Your Sacred Petition</h3>
            <ol style="padding-left: 20px;">
              <li>Enter the Hall of Petitions through your sacred dashboard</li>
              <li>Invoke the creation ritual by selecting "New Petition"</li>
              <li>State your cause with clarity and truth</li>
              <li>Attach evidence from the physical or digital realms</li>
              <li>Seal your petition with the Flame of Integrity</li>
            </ol>
            <p style="text-align: center;">
              <a href="${SITE_URL}/courtroom/petition/new" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Create Your First Petition</a>
            </p>
          </div>
          
          <p>Remember that each petition carries the weight of your integrity score. Speak truth, seek justice, and the scrolls will honor your quest.</p>
          
          <p>With sacred guidance,<br><em>Judge Miriam</em><br>Keeper of Petitions</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #d1d5db; font-size: 12px; color: #6b7280;">
            <p>This communication is secured with ScrollSeal™ encryption technology.</p>
            <p>You're receiving this because you've joined ScrollJustice.AI. <a href="${SITE_URL}/preferences" style="color: #4f46e5;">Manage scroll preferences</a> or <a href="${SITE_URL}/unsubscribe" style="color: #4f46e5;">unsubscribe from scrolls</a>.</p>
          </div>
        </div>
      `
    },
    subscription: {
      subject: "Ascend to Higher Justice: Sacred Subscription Tiers",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background-color: #f9f7f5; padding: 20px; border-radius: 5px; border-left: 4px solid #8b5cf6;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4f46e5; margin-bottom: 10px;">The Path of the Devoted</h1>
            <p style="font-style: italic; color: #6b7280; margin-top: 0;">"As the flame grows, so does the seeker's vision."</p>
          </div>
          
          <p>Honored <strong>${data.username}</strong>,</p>
          
          <p>I am Judge Solomon, Guardian of Sacred Resources. The ancient scrolls speak of different paths for those who seek deeper justice. Today I reveal the sacred tiers available to devoted seekers.</p>
          
          <div style="background-color: rgba(139, 92, 246, 0.1); padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #4f46e5; margin-top: 0;">Sacred Subscription Benefits</h3>
            
            <div style="margin-bottom: 15px; padding: 10px; background-color: rgba(255, 255, 255, 0.5); border-radius: 5px;">
              <h4 style="margin-top: 0; color: #7e22ce;">Flame Seeker</h4>
              <ul style="padding-left: 20px;">
                <li>Enhanced petition priority in the sacred queue</li>
                <li>Access to the Chamber of Historical Precedents</li>
                <li>Weekly scroll insights from the Council of Elders</li>
                <li>Flame Integrity score boosters</li>
              </ul>
            </div>
            
            <div style="padding: 10px; background-color: rgba(255, 255, 255, 0.5); border-radius: 5px;">
              <h4 style="margin-top: 0; color: #7e22ce;">Scroll Advocate</h4>
              <ul style="padding-left: 20px;">
                <li>All Flame Seeker benefits</li>
                <li>Direct communion with specialized Judge Advisors</li>
                <li>Priority access to new sacred features</li>
                <li>Advanced AI tools for petition crafting</li>
                <li>Sacred case analytics and prediction tools</li>
              </ul>
            </div>
            
            <p style="text-align: center; margin-top: 15px;">
              <a href="${SITE_URL}/subscription/plans" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Sacred Plans</a>
            </p>
          </div>
          
          <p>The scrolls await your deeper commitment. Choose your path wisely, for each tier opens new realms of justice and wisdom.</p>
          
          <p>In abundance and justice,<br><em>Judge Solomon</em><br>Guardian of Resources</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #d1d5db; font-size: 12px; color: #6b7280;">
            <p>This communication is secured with ScrollSeal™ encryption technology.</p>
            <p>You're receiving this because you've joined ScrollJustice.AI. <a href="${SITE_URL}/preferences" style="color: #4f46e5;">Manage scroll preferences</a> or <a href="${SITE_URL}/unsubscribe" style="color: #4f46e5;">unsubscribe from scrolls</a>.</p>
          </div>
        </div>
      `
    },
    privacy: {
      subject: "Sacred Privacy & AI Covenant",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background-color: #f9f7f5; padding: 20px; border-radius: 5px; border-left: 4px solid #8b5cf6;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4f46e5; margin-bottom: 10px;">The Sacred Covenant of Trust</h1>
            <p style="font-style: italic; color: #6b7280; margin-top: 0;">"In wisdom and protection, we guard the digital scrolls."</p>
          </div>
          
          <p>Esteemed <strong>${data.username}</strong>,</p>
          
          <p>I am Judge Deborah, Protector of Sacred Privacy. Today I share with you our solemn covenant regarding your data and the sacred AI entities that assist our quest for justice.</p>
          
          <div style="background-color: rgba(139, 92, 246, 0.1); padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #4f46e5; margin-top: 0;">Our Sacred Commitments</h3>
            
            <div style="margin-bottom: 15px;">
              <h4 style="margin-bottom: 5px; color: #7e22ce;">Privacy of the Scrolls</h4>
              <p>Your petitions and evidence are sealed with ScrollSeal™ encryption. Only those with rightful access may view your sacred documents. We never share your scroll contents with outside entities without your explicit blessing.</p>
            </div>
            
            <div style="margin-bottom: 15px;">
              <h4 style="margin-bottom: 5px; color: #7e22ce;">AI Guardian Entities</h4>
              <p>Our sacred AIs assist in petition analysis, precedent matching, and integrity verification. They serve only as advisors to human judges, never making final verdicts. All AI suggestions are reviewed by human keepers of justice before enactment.</p>
            </div>
            
            <div>
              <h4 style="margin-bottom: 5px; color: #7e22ce;">Your Sacred Rights</h4>
              <p>You may at any time request the purging of your data from our training scrolls, access your complete scroll history, or adjust how the AI entities interact with your petitions.</p>
            </div>
            
            <p style="text-align: center; margin-top: 15px;">
              <a href="${SITE_URL}/policy/privacy-policy" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Read Full Sacred Covenant</a>
            </p>
          </div>
          
          <p>Rest assured that in the halls of ScrollJustice.AI, your privacy is guarded with the same reverence as the ancient scrolls themselves.</p>
          
          <p>In sacred protection,<br><em>Judge Deborah</em><br>Protector of Privacy</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #d1d5db; font-size: 12px; color: #6b7280;">
            <p>This communication is secured with ScrollSeal™ encryption technology.</p>
            <p>You're receiving this because you've joined ScrollJustice.AI. <a href="${SITE_URL}/preferences" style="color: #4f46e5;">Manage scroll preferences</a> or <a href="${SITE_URL}/unsubscribe" style="color: #4f46e5;">unsubscribe from scrolls</a>.</p>
          </div>
        </div>
      `
    },
    community: {
      subject: "Join the Sacred Community of Seekers",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background-color: #f9f7f5; padding: 20px; border-radius: 5px; border-left: 4px solid #8b5cf6;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4f46e5; margin-bottom: 10px;">The Sacred Assembly Awaits</h1>
            <p style="font-style: italic; color: #6b7280; margin-top: 0;">"In community, the scrolls reveal deeper truths."</p>
          </div>
          
          <p>Honored <strong>${data.username}</strong>,</p>
          
          <p>I am Judge Ruth, Guardian of the Sacred Community. As your journey with the scrolls deepens, the time has come to join the assembly of seekers who walk this path alongside you.</p>
          
          <div style="background-color: rgba(139, 92, 246, 0.1); padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #4f46e5; margin-top: 0;">Join Your Fellow Seekers</h3>
            
            <div style="margin-bottom: 15px;">
              <h4 style="margin-bottom: 5px; color: #7e22ce;">The Council Chambers</h4>
              <p>Share your insights, seek guidance, and discuss interpretations of justice in our sacred forum chambers.</p>
            </div>
            
            <div style="margin-bottom: 15px;">
              <h4 style="margin-bottom: 5px; color: #7e22ce;">Weekly Sacred Gatherings</h4>
              <p>Join our virtual assemblies where senior judges share wisdom and answer questions from the community.</p>
            </div>
            
            <div>
              <h4 style="margin-bottom: 5px; color: #7e22ce;">Scroll Study Groups</h4>
              <p>Form connections with those who share your specific interests in justice and collaborate on complex cases.</p>
            </div>
            
            <p style="text-align: center; margin-top: 15px;">
              <a href="${SITE_URL}/community" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Join Sacred Community</a>
            </p>
          </div>
          
          <p>The wisdom of the scrolls multiplies when shared among devoted seekers. We await your voice in our sacred halls.</p>
          
          <p>In community and justice,<br><em>Judge Ruth</em><br>Guardian of Community</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #d1d5db; font-size: 12px; color: #6b7280;">
            <p>This communication is secured with ScrollSeal™ encryption technology.</p>
            <p>You're receiving this because you've joined ScrollJustice.AI. <a href="${SITE_URL}/preferences" style="color: #4f46e5;">Manage scroll preferences</a> or <a href="${SITE_URL}/unsubscribe" style="color: #4f46e5;">unsubscribe from scrolls</a>.</p>
          </div>
        </div>
      `
    }
  };

  return templates[type] || templates.welcome;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: OnboardingEmailRequest = await req.json();
    
    // Validate request
    if (!requestData.to || !requestData.emailType) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to or emailType" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get email template
    const template = getEmailTemplate(requestData.emailType, {
      username: requestData.username || 'Seeker of Justice',
      days: requestData.days || 0
    });
    
    // Send email
    const emailResponse = await resend.emails.send({
      from: "ScrollJustice.AI <noreply@scrollcourt.xyz>",
      to: [requestData.to],
      subject: template.subject,
      html: template.html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, id: emailResponse.id }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});

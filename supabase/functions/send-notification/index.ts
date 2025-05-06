
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

interface EmailRequest {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const SITE_URL = Deno.env.get("SITE_URL") || "https://scrolljustice.xyz";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TEMPLATES = {
  petition_created: (data: any) => ({
    subject: "Sacred Petition Submitted",
    html: `
      <h1>Your Sacred Petition Has Been Submitted</h1>
      <p>Thank you for submitting your petition titled: <strong>${data.title}</strong></p>
      <p>Your petition has been recorded in the sacred scrolls and is awaiting review.</p>
      <p>Petition ID: <code>${data.petition_id}</code></p>
      <p><a href="${SITE_URL}/petition/${data.petition_id}">View your petition</a></p>
    `
  }),
  petition_verdict: (data: any) => ({
    subject: `Sacred Verdict Rendered: ${data.verdict.toUpperCase()}`,
    html: `
      <h1>A Verdict Has Been Rendered</h1>
      <p>The sacred scroll judges have provided their verdict:</p>
      <h2 style="color: ${data.verdict === 'approved' ? '#22c55e' : '#ef4444'}">
        ${data.verdict.toUpperCase()}
      </h2>
      <p><strong>Reasoning:</strong></p>
      <p>${data.reasoning}</p>
      <p><a href="${SITE_URL}/petition/${data.petition_id}">View full verdict details</a></p>
    `
  }),
  court_registration: (data: any) => ({
    subject: "Court Registration Received",
    html: `
      <h1>Sacred Court Registration Received</h1>
      <p>Thank you for registering your court:</p>
      <p><strong>${data.court_name}</strong></p>
      <p>Your registration has been received and is pending verification. A member of the ScrollJustice.AI council will review your registration shortly.</p>
      <p>Registration ID: <code>${data.registration_id}</code></p>
    `
  }),
  verification_code: (data: any) => ({
    subject: "Your ScrollJustice.AI Verification Code",
    html: `
      <h1>Sacred Verification Code</h1>
      <p>Your verification code is:</p>
      <h2 style="font-family: monospace; letter-spacing: 0.25em; background: #1a1a1a; padding: 20px; text-align: center;">
        ${data.code}
      </h2>
      <p>This code will expire in ${data.expiry_minutes} minutes.</p>
      <p>If you did not request this code, please ignore this email.</p>
    `
  }),
  welcome: (data: any) => ({
    subject: "Welcome to ScrollJustice.AI",
    html: `
      <h1>Welcome to the Sacred Scrolls</h1>
      <p>Greetings ${data.name || 'Seeker of Justice'},</p>
      <p>Your journey with ScrollJustice.AI has begun. You now have access to the sacred scrolls and can participate in the divine pursuit of justice.</p>
      <p><a href="${SITE_URL}/dashboard">Access your sacred dashboard</a></p>
    `
  }),
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: EmailRequest = await req.json();
    
    // Validate request
    if (!requestData.to || !requestData.templateName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to or templateName" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get template
    const templateName = requestData.templateName as keyof typeof TEMPLATES;
    if (!TEMPLATES[templateName]) {
      return new Response(
        JSON.stringify({ error: `Template ${templateName} not found` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Generate email content from template
    const template = TEMPLATES[templateName](requestData.templateData || {});
    
    // Send email
    const emailResponse = await resend.emails.send({
      from: "ScrollJustice.AI <noreply@scrollcourt.xyz>",
      to: [requestData.to],
      subject: requestData.subject || template.subject,
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

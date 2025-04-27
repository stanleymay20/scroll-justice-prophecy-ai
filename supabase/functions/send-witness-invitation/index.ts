
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use the service role key for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { email, role, sessionId, token, inviteLink } = await req.json();

    if (!email || !role || !sessionId || !token || !inviteLink) {
      throw new Error("Missing required invitation data");
    }

    // Get session information
    const { data: sessionData, error: sessionError } = await supabaseAdmin
      .from("court_sessions")
      .select("title, scheduled_start")
      .eq("id", sessionId)
      .single();

    if (sessionError) throw sessionError;

    // Get inviter information
    const { data: summonData, error: summonError } = await supabaseAdmin
      .from("witness_summons")
      .select(`
        invited_by,
        profiles(username, email)
      `)
      .eq("token", token)
      .single();

    if (summonError) throw summonError;

    const inviterName = summonData?.profiles?.username || "A ScrollJustice user";
    const sessionTitle = sessionData?.title || "Sacred Court Session";
    const sessionDate = sessionData?.scheduled_start
      ? new Date(sessionData.scheduled_start).toLocaleDateString()
      : "upcoming";
    
    const sessionTime = sessionData?.scheduled_start
      ? new Date(sessionData.scheduled_start).toLocaleTimeString()
      : "scheduled time";

    // In a real implementation, you would send an actual email here
    // For this demo, we'll simulate a successful email send
    console.log(`Email invitation would be sent to: ${email}`);
    console.log(`Subject: You've Been Summoned to a Sacred Court Session`);
    console.log(`Body: ${inviterName} has summoned you to participate as a ${role} in "${sessionTitle}" on ${sessionDate} at ${sessionTime}. Click the link to respond to this summon: ${inviteLink}`);

    // Update the summon record to indicate email was sent
    const { error: updateError } = await supabaseAdmin
      .from("witness_summons")
      .update({
        email_sent: true,
        email_sent_at: new Date().toISOString()
      })
      .eq("token", token);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Invitation sent to ${email}`
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

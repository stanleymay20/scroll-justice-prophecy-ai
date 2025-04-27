
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

    const { alertId, sessionId, userId, alertType } = await req.json();

    if (!alertId || !sessionId || !alertType) {
      throw new Error("Missing required alert data");
    }

    // Get session information
    const { data: sessionData, error: sessionError } = await supabaseAdmin
      .from("court_sessions")
      .select("title")
      .eq("id", sessionId)
      .single();

    if (sessionError) throw sessionError;

    // Create MCP alert
    const alertData = {
      type: alertType,
      severity: alertType === "emergency_mercy" ? "critical" : "warning",
      message: `Emergency alert raised in session: ${sessionData?.title || "Unknown session"}`,
      timestamp: new Date().toISOString(),
      session_id: sessionId,
      user_id: userId || null,
      resolved: false
    };

    const { error: alertError } = await supabaseAdmin
      .from("mcp_alerts")
      .insert(alertData);

    if (alertError) throw alertError;

    // Update session flame integrity score
    const { error: updateError } = await supabaseAdmin
      .from("court_sessions")
      .update({
        flame_integrity_score: 50, // Significantly reduce the flame integrity score
      })
      .eq("id", sessionId);

    if (updateError) throw updateError;

    // Notify all session participants
    const { data: participants, error: participantError } = await supabaseAdmin
      .from("court_session_participants")
      .select("user_id")
      .eq("session_id", sessionId)
      .neq("user_id", userId); // Don't notify the user who raised the alert

    if (participantError) throw participantError;

    // Create notification for each participant
    if (participants && participants.length > 0) {
      const notifications = participants.map(participant => ({
        user_id: participant.user_id,
        title: "Emergency Alert",
        message: `An emergency has been raised in the court session: ${sessionData?.title}`,
        type: "emergency",
        read: false,
        created_at: new Date().toISOString()
      }));

      const { error: notificationError } = await supabaseAdmin
        .from("notifications")
        .insert(notifications);

      if (notificationError) throw notificationError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        alertId
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

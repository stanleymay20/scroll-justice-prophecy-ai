
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[MCP-EMERGENCY] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    // Initialize Supabase client with the service role key for admin operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    // Parse request body
    const { alertId, sessionId, userId, alertType } = await req.json();
    logStep("Request parsed", { alertId, sessionId, userId, alertType });
    
    if (!alertId || !sessionId) {
      throw new Error("Alert ID and Session ID are required");
    }
    
    // Get alert details from database
    const { data: alertData, error: alertError } = await supabaseClient
      .from('emergency_alerts')
      .select('*')
      .eq('id', alertId)
      .single();
      
    if (alertError || !alertData) {
      throw new Error(`Error fetching alert: ${alertError?.message || "Alert not found"}`);
    }
    logStep("Alert fetched", { alert: alertData });
    
    // Get session details
    const { data: sessionData, error: sessionError } = await supabaseClient
      .from('court_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();
      
    if (sessionError || !sessionData) {
      throw new Error(`Error fetching session: ${sessionError?.message || "Session not found"}`);
    }
    logStep("Session fetched", { session: sessionData });
    
    // Get participants with court steward role
    const { data: stewards, error: stewardsError } = await supabaseClient
      .from('court_session_participants')
      .select('user_id')
      .eq('session_id', sessionId)
      .eq('role', 'steward');
      
    if (stewardsError) {
      throw new Error(`Error fetching stewards: ${stewardsError.message}`);
    }
    logStep("Stewards fetched", { count: stewards?.length || 0 });
    
    // Update flame integrity score in session
    // Decrease the flame integrity score as there was an emergency
    const newFlameScore = Math.max((sessionData.flame_integrity_score || 100) - 15, 0);
    const { error: updateError } = await supabaseClient
      .from('court_sessions')
      .update({ flame_integrity_score: newFlameScore })
      .eq('id', sessionId);
      
    if (updateError) {
      throw new Error(`Error updating session flame score: ${updateError.message}`);
    }
    logStep("Updated session flame score", { oldScore: sessionData.flame_integrity_score, newScore: newFlameScore });
    
    // Create an audit log entry
    const { error: logError } = await supabaseClient
      .from('scroll_witness_logs')
      .insert({
        session_id: sessionId,
        user_id: userId,
        action: 'mcp_emergency_notification',
        details: `Emergency alert processed: ${alertType}. Flame integrity reduced to ${newFlameScore}.`,
        timestamp: new Date().toISOString()
      });
      
    if (logError) {
      throw new Error(`Error creating log entry: ${logError.message}`);
    }
    
    // In a real system, we would send notifications to stewards here
    // For now, we'll just log that they would be notified
    logStep("Would notify stewards", { 
      stewardCount: stewards?.length || 0,
      stewardIds: stewards?.map(s => s.user_id) || []
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Emergency alert processed",
        newFlameIntegrityScore: newFlameScore
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

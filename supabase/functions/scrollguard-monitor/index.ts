
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SCROLLGUARD] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("ScrollGuard monitor started");
    
    // Initialize Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    // Check for integrity violations
    const { data: violations, error: violationsError } = await supabaseAdmin
      .from('scroll_integrity_logs')
      .select('*')
      .eq('flame_alert', true)
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (violationsError) throw violationsError;
    logStep("Retrieved recent integrity violations", { count: violations?.length || 0 });
    
    // Check for suspicious petition patterns
    // 1. Multiple rejected petitions from same user
    const { data: rejections, error: rejectionsError } = await supabaseAdmin
      .from('scroll_petitions')
      .select('petitioner_id, count(*)')
      .eq('status', 'rejected')
      .group('petitioner_id')
      .having('count(*) > 3');
      
    if (rejectionsError) throw rejectionsError;
    
    // 2. Self-verdict attempts
    const { data: selfVerdicts, error: selfVerdictsError } = await supabaseAdmin
      .from('scroll_integrity_logs')
      .select('user_id, count(*)')
      .eq('action_type', 'SELF_VERDICT_ATTEMPT')
      .group('user_id')
      .having('count(*) > 1');
      
    if (selfVerdictsError) throw selfVerdictsError;
    
    // Log suspicious users to the scrollguard_alerts table
    const suspiciousUsers = new Set<string>();
    
    // Add users with multiple rejections
    rejections?.forEach(rejection => {
      if (rejection.petitioner_id) {
        suspiciousUsers.add(rejection.petitioner_id);
      }
    });
    
    // Add users with self-verdict attempts
    selfVerdicts?.forEach(sv => {
      if (sv.user_id) {
        suspiciousUsers.add(sv.user_id);
      }
    });
    
    logStep("Identified suspicious users", { count: suspiciousUsers.size });
    
    // Record alerts for suspicious users
    for (const userId of suspiciousUsers) {
      const { error: alertError } = await supabaseAdmin
        .from('scrollguard_alerts')
        .insert({
          user_id: userId,
          alert_type: 'SUSPICIOUS_ACTIVITY',
          description: 'Multiple integrity violations or rejected petitions detected',
          severity: 'high',
          resolved: false
        });
        
      if (alertError) {
        logStep("Error recording alert", { userId, error: alertError });
      }
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      alerts_created: suspiciousUsers.size
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

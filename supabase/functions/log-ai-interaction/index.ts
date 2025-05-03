
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[LOG-AI-INTERACTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    // Parse the request body for parameters
    const { 
      user_id_param, 
      action_type_param, 
      ai_model_param, 
      input_summary_param, 
      output_summary_param 
    } = await req.json();
    
    logStep("Parameters received", {
      user_id: user_id_param,
      action_type: action_type_param,
      ai_model: ai_model_param
    });
    
    // Initialize Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    // Insert into ai_audit_logs table
    const { error } = await supabaseAdmin.from('ai_audit_logs').insert({
      user_id: user_id_param,
      action_type: action_type_param,
      ai_model: ai_model_param,
      input_summary: input_summary_param,
      output_summary: output_summary_param,
      created_at: new Date().toISOString()
    });
    
    if (error) throw error;
    
    logStep("AI interaction logged successfully");
    
    return new Response(JSON.stringify({ success: true }), {
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

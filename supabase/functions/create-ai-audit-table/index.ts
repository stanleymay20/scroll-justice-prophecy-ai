
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-AI-AUDIT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    // Initialize Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    // Check if the ai_audit_logs table exists
    try {
      const { data: tableExists, error: tableCheckError } = await supabaseAdmin.rpc(
        'check_table_exists',
        { table_name: 'ai_audit_logs' }
      );
      
      if (tableCheckError) {
        console.error("Error creating AI audit log table:", tableCheckError);
        throw tableCheckError;
      }
      
      if (!tableExists) {
        // Create the ai_audit_logs table if it doesn't exist
        const { error: createError } = await supabaseAdmin.rpc('create_ai_audit_logs_table');
        
        if (createError) {
          console.error("Error creating AI audit log table:", createError);
          throw createError;
        }
        
        logStep("AI audit log table created successfully");
      } else {
        logStep("AI audit log table already exists");
      }
    } catch (err) {
      logStep("Error checking/creating AI audit log table", { error: String(err) });
    }
    
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

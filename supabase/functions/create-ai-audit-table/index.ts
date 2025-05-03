
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the Supabase client
    const supabaseClient = await getSupabaseClient(req);
    
    // Check if the table already exists
    const { data: tableExists, error: checkError } = await supabaseClient.rpc(
      'check_table_exists',
      { table_name: 'ai_audit_log' }
    );

    if (checkError) {
      throw checkError;
    }

    if (tableExists) {
      return new Response(JSON.stringify({ 
        message: "AI audit log table already exists"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    // Create the ai_audit_log table
    const { error: createTableError } = await supabaseClient.query(`
      CREATE TABLE public.ai_audit_log (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users NOT NULL,
        action_type TEXT NOT NULL,
        ai_model TEXT NOT NULL,
        input_summary TEXT,
        output_summary TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
      );

      -- Enable Row Level Security
      ALTER TABLE public.ai_audit_log ENABLE ROW LEVEL SECURITY;

      -- Create policy for users to view only their own logs
      CREATE POLICY "Users can view their own logs"
        ON public.ai_audit_log
        FOR SELECT
        USING (auth.uid() = user_id);
        
      -- Create policy for admins to view all logs
      CREATE POLICY "Admins can view all logs"
        ON public.ai_audit_log
        FOR SELECT
        USING ((SELECT role FROM public.user_roles WHERE user_id = auth.uid()) = 'admin');
        
      -- Create policy for inserting logs (any authenticated user)
      CREATE POLICY "Allow insert for authenticated users"
        ON public.ai_audit_log
        FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    `);

    if (createTableError) {
      throw createTableError;
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: "AI audit log table created successfully" 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error("Error creating AI audit log table:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
});

// Helper to get authenticated Supabase client
async function getSupabaseClient(req) {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader) {
    throw new Error('Authorization header is required');
  }
  
  // Call Supabase service role client (for admin operations)
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing environment variables for Supabase');
  }

  // Create a Supabase client with the service role key
  const supabaseClient = {
    query: async (sql) => {
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
        },
        body: JSON.stringify({
          query: sql,
        }),
      });
      
      return response.ok 
        ? { error: null } 
        : { error: await response.json() };
    },
    rpc: async (fn, params) => {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/${fn}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
        },
        body: JSON.stringify(params),
      });
      
      if (response.ok) {
        return { data: await response.json(), error: null };
      } else {
        return { data: null, error: await response.json() };
      }
    }
  };

  return supabaseClient;
}

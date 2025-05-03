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

    // Apply RLS policies
    const rlsResult = await applyRlsPolicies(supabaseClient);
    if (!rlsResult.success) {
      throw new Error(`Failed to apply RLS policies: ${rlsResult.error}`);
    }

    // Create the check_table_exists function
    const checkTableExistsResult = await createCheckTableExistsFunction(supabaseClient);
    if (!checkTableExistsResult.success) {
      throw new Error(`Failed to create check_table_exists function: ${checkTableExistsResult.error}`);
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: "RLS policies applied and check_table_exists function created successfully" 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error("Error applying RLS policies:", error);
    
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

// Apply RLS policies
const applyRlsPolicies = async (supabaseClient) => {
  try {
    // Enable Row Level Security for scroll_petitions table
    const { error: enableRlsError } = await supabaseClient.query(`
      ALTER TABLE public.scroll_petitions ENABLE ROW LEVEL SECURITY;
    `);
    if (enableRlsError) throw enableRlsError;

    // Create policy for users to view only their own petitions
    const { error: createPolicyError } = await supabaseClient.query(`
      CREATE POLICY "Users can view their own petitions"
      ON public.scroll_petitions
      FOR SELECT
      USING (auth.uid() = petitioner_id);
    `);
    if (createPolicyError) throw createPolicyError;

    // Create policy for judges/admins to view all petitions
    const { error: createAdminPolicyError } = await supabaseClient.query(`
      CREATE POLICY "Admins and Judges can view all petitions"
      ON public.scroll_petitions
      FOR SELECT
      USING ((SELECT role FROM public.user_roles WHERE user_id = auth.uid()) IN ('admin', 'judge'));
    `);
    if (createAdminPolicyError) throw createAdminPolicyError;

    // Create policy for users to create petitions
    const { error: createInsertPolicyError } = await supabaseClient.query(`
      CREATE POLICY "Users can create petitions"
      ON public.scroll_petitions
      FOR INSERT
      WITH CHECK (auth.uid() = petitioner_id);
    `);
    if (createInsertPolicyError) throw createInsertPolicyError;

    // Create policy for users to update their own petitions
    const { error: createUpdatePolicyError } = await supabaseClient.query(`
      CREATE POLICY "Users can update their own petitions"
      ON public.scroll_petitions
      FOR UPDATE
      USING (auth.uid() = petitioner_id)
      WITH CHECK (auth.uid() = petitioner_id);
    `);
    if (createUpdatePolicyError) throw createUpdatePolicyError;

    return { success: true, message: "RLS policies applied to scroll_petitions" };
  } catch (err) {
    console.error("Error applying RLS policies:", err);
    return { success: false, error: err.message };
  }
};

// Add the check_table_exists RPC function
const createCheckTableExistsFunction = async (supabaseClient) => {
  try {
    const { error } = await supabaseClient.query(`
      CREATE OR REPLACE FUNCTION public.check_table_exists(table_name TEXT)
      RETURNS BOOLEAN
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        table_exists BOOLEAN;
      BEGIN
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public'
          AND table_name = $1
        ) INTO table_exists;
        
        RETURN table_exists;
      END;
      $$;
    `);

    if (error) throw error;
    return { success: true, message: "check_table_exists function created" };
  } catch (err) {
    console.error("Error creating check_table_exists function:", err);
    return { success: false, error: err.message };
  }
};

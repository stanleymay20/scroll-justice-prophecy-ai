
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse request body
    const { userId } = await req.json();
    
    if (!userId) {
      throw new Error("User ID is required");
    }

    // First check if user already has a role
    const { data: existingRole, error: selectError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (selectError) {
      throw new Error(`Error checking for existing role: ${selectError.message}`);
    }
    
    if (existingRole) {
      // User already has a role, return it
      return new Response(
        JSON.stringify({ 
          success: true,
          role: existingRole.role,
          message: "User role already exists"
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
    
    // User doesn't have a role, create default one
    const defaultRole = 'flame_seeker';
    const now = new Date().toISOString();
    
    const { data: insertData, error: insertError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: defaultRole,
        reputation_score: 50,
        created_at: now,
        updated_at: now,
        last_role_change: now
      })
      .select()
      .single();
      
    if (insertError) {
      throw new Error(`Error creating default role: ${insertError.message}`);
    }
    
    // Return the newly created role
    return new Response(
      JSON.stringify({ 
        success: true,
        role: defaultRole,
        message: "Default user role created"
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error ensuring user role:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

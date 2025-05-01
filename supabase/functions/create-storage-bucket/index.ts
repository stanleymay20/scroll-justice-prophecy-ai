
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://preview-da2a66b3--scroll-justice-prophecy-ai.lovable.app',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create the scroll_evidence bucket if it doesn't exist
    const { data: bucketData, error: bucketError } = await supabaseAdmin
      .storage
      .createBucket('scroll_evidence', {
        public: false,
        fileSizeLimit: 10485760, // 10MB
      });

    if (bucketError && !bucketError.message.includes('already exists')) {
      throw bucketError;
    }

    // Set up security policies for the bucket
    const { error: policyError } = await supabaseAdmin
      .rpc('create_storage_policy', {
        bucket_name: 'scroll_evidence',
        policy_name: 'Allow authenticated users to upload evidence',
        definition: 'auth.role() = \'authenticated\'',
        operation: 'INSERT'
      });

    if (policyError) {
      console.error('Policy error:', policyError);
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: bucketError?.message?.includes('already exists') ? 
        'Bucket already exists' : 'Bucket created successfully',
      bucket: 'scroll_evidence'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in create-storage-bucket function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

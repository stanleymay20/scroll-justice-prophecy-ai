
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.36.0";

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
    // Get Supabase client with service role (admin privileges)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Create the scroll_evidence storage bucket if it doesn't exist
    const { data: existingBuckets, error: listError } = await supabase
      .storage
      .listBuckets();
      
    if (listError) throw listError;
    
    const bucketExists = existingBuckets.some(bucket => bucket.name === 'scroll_evidence');
    
    if (!bucketExists) {
      const { error } = await supabase
        .storage
        .createBucket('scroll_evidence', { 
          public: true, // Make files publicly accessible
          fileSizeLimit: 10485760, // 10MB limit
          allowedMimeTypes: [
            'image/png',
            'image/jpeg',
            'image/jpg',
            'application/pdf',
            'audio/mpeg',
            'video/mp4'
          ]
        });
        
      if (error) throw error;
    }
    
    // Create RLS policies for the bucket
    await supabase.rpc('create_storage_policy', {
      bucket_name: 'scroll_evidence',
      policy_name: 'Allow authenticated users to upload evidence',
      definition: `(auth.uid() IS NOT NULL)`
    });
    
    return new Response(JSON.stringify({ 
      message: 'Scroll evidence bucket created or already exists',
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
});

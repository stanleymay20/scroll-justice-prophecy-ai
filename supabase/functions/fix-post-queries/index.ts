
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
    const { category } = await req.json();

    // Build query for posts
    let query = supabase
      .from('posts')
      .select(`
        id, 
        user_id,
        title,
        content,
        category,
        created_at,
        updated_at,
        likes,
        comments_count
      `)
      .order('created_at', { ascending: false })
      .limit(25);
    
    // Add category filter if specified
    if (category && category !== "all") {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Error fetching posts: ${error.message}`);
    }
    
    // For each post, try to get the username
    const postsWithUsernames = await Promise.all(data.map(async (post) => {
      // Try to get user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', post.user_id)
        .maybeSingle();
      
      return {
        ...post,
        username: profileData?.username || "Anonymous Witness"
      };
    }));

    return new Response(
      JSON.stringify({ 
        success: true,
        posts: postsWithUsernames
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
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

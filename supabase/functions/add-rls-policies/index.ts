
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

    // Execute SQL commands to create RLS policies
    const queries = [
      // Posts table RLS policies
      `
      -- Enable RLS on posts table if not already enabled
      ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

      -- Allow users to view all published posts (public read)
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'posts' AND policyname = 'Anyone can view posts'
        ) THEN
          CREATE POLICY "Anyone can view posts" ON public.posts FOR SELECT USING (true);
        END IF;
      END
      $$;

      -- Allow authenticated users to insert their own posts
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'posts' AND policyname = 'Users can insert their own posts'
        ) THEN
          CREATE POLICY "Users can insert their own posts" ON public.posts 
            FOR INSERT TO authenticated 
            WITH CHECK (auth.uid() = user_id);
        END IF;
      END
      $$;

      -- Allow users to update only their own posts
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'posts' AND policyname = 'Users can update their own posts'
        ) THEN
          CREATE POLICY "Users can update their own posts" ON public.posts 
            FOR UPDATE TO authenticated 
            USING (auth.uid() = user_id);
        END IF;
      END
      $$;

      -- Allow users to delete only their own posts
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'posts' AND policyname = 'Users can delete their own posts'
        ) THEN
          CREATE POLICY "Users can delete their own posts" ON public.posts 
            FOR DELETE TO authenticated 
            USING (auth.uid() = user_id);
        END IF;
      END
      $$;
      `,

      // User roles table RLS policies
      `
      -- Enable RLS on user_roles table if not already enabled
      ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

      -- Allow users to read only their own role
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'Users can view their own role'
        ) THEN
          CREATE POLICY "Users can view their own role" ON public.user_roles 
            FOR SELECT TO authenticated 
            USING (auth.uid() = user_id);
        END IF;
      END
      $$;

      -- Allow service roles to manage all user_roles (for edge functions)
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'Service role can manage all roles'
        ) THEN
          CREATE POLICY "Service role can manage all roles" ON public.user_roles 
            USING (true);
        END IF;
      END
      $$;
      `,

      // Fix posts table, ensure user_id cannot be null
      `
      -- Alter posts table to ensure user_id is not null
      DO $$ 
      BEGIN
        -- Check if the user_id column is nullable
        IF EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
            AND table_name = 'posts' 
            AND column_name = 'user_id' 
            AND is_nullable = 'YES'
        ) THEN
          -- Update any posts with null user_id to a default service account
          UPDATE public.posts 
          SET user_id = '00000000-0000-0000-0000-000000000000' 
          WHERE user_id IS NULL;
          
          -- Make user_id not null
          ALTER TABLE public.posts ALTER COLUMN user_id SET NOT NULL;
        END IF;
      END
      $$;
      `
    ];

    for (const query of queries) {
      const { error } = await supabase.rpc('exec_sql', { sql_query: query });
      if (error) throw new Error(`SQL Error: ${error.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Successfully updated RLS policies for posts and user_roles tables" 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error applying RLS policies:', error);
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

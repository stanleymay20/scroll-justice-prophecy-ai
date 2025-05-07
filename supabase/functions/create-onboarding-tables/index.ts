
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (_req) => {
  try {
    // Check if the table exists
    const { data: tableExists } = await supabaseAdmin
      .rpc('check_table_exists', { table_name: 'user_onboarding' });
    
    if (!tableExists) {
      // Create the user_onboarding table
      const { error: createError } = await supabaseAdmin
        .rpc('execute_sql', {
          sql_query: `
            CREATE TABLE IF NOT EXISTS public.user_onboarding (
              id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
              user_id UUID REFERENCES auth.users(id),
              user_email TEXT NOT NULL UNIQUE,
              welcome_sent BOOLEAN DEFAULT false,
              welcome_sent_at TIMESTAMP WITH TIME ZONE,
              petition_sent BOOLEAN DEFAULT false,
              petition_sent_at TIMESTAMP WITH TIME ZONE,
              subscription_sent BOOLEAN DEFAULT false,
              subscription_sent_at TIMESTAMP WITH TIME ZONE,
              privacy_sent BOOLEAN DEFAULT false,
              privacy_sent_at TIMESTAMP WITH TIME ZONE,
              community_sent BOOLEAN DEFAULT false,
              community_sent_at TIMESTAMP WITH TIME ZONE,
              sequence_position INTEGER DEFAULT 0,
              next_email_type TEXT DEFAULT 'welcome',
              next_email_date TIMESTAMP WITH TIME ZONE,
              opted_out BOOLEAN DEFAULT false,
              opted_out_at TIMESTAMP WITH TIME ZONE,
              preferences JSONB DEFAULT '{"receiveWelcome": true, "receivePetition": true, "receiveSubscription": true, "receivePrivacy": true, "receiveCommunity": true}'::jsonb,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            );

            -- Enable RLS
            ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;

            -- Create basic policies
            CREATE POLICY "Users can view their own onboarding data" 
              ON public.user_onboarding 
              FOR SELECT 
              USING (auth.uid() = user_id OR auth.email() = user_email);
            
            CREATE POLICY "Admin can view all onboarding data" 
              ON public.user_onboarding 
              FOR SELECT 
              USING (
                EXISTS (
                  SELECT 1 FROM user_roles 
                  WHERE user_id = auth.uid() AND role = 'admin'
                )
              );
          `
        });
      
      if (createError) {
        throw createError;
      }

      console.log("User onboarding table created successfully");
      return new Response(JSON.stringify({ success: true, message: "User onboarding table created" }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log("User onboarding table already exists");
    return new Response(JSON.stringify({ success: true, message: "User onboarding table already exists" }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error creating user onboarding table:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

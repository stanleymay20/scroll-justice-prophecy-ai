
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get the user auth data from the request
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Parse request data
    const { title, description, scheduledStart, scheduledEnd } = await req.json();

    if (!title || !scheduledStart || !scheduledEnd) {
      throw new Error("Missing required courtroom session data");
    }

    // Create the court session
    const { data: session, error } = await supabaseClient
      .from("court_sessions")
      .insert({
        title,
        description,
        scheduled_start: scheduledStart,
        scheduled_end: scheduledEnd,
        status: "scheduled",
        created_by: user.id,
        prayer_completed: false,
        is_encrypted: true,
        flame_integrity_score: 100
      })
      .select()
      .single();

    if (error) throw error;

    // Add the creator as a participant with the judge role
    if (session) {
      const { error: participantError } = await supabaseClient
        .from("court_session_participants")
        .insert({
          session_id: session.id,
          user_id: user.id,
          role: "judge",
          oath_taken: false
        });

      if (participantError) throw participantError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: session
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

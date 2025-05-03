
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[TRANSCRIBE-AUDIO] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    // Get API key from environment variable
    const openAIKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIKey) {
      throw new Error("OpenAI API key not configured");
    }
    
    // Verify authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !userData.user) {
      throw new Error("Authentication failed");
    }
    
    logStep("User authenticated", { userId: userData.user.id });
    
    // Check if the request is multipart form data
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      throw new Error("Request must be multipart/form-data");
    }
    
    // Parse the form data
    const formData = await req.formData();
    const audioFile = formData.get("audio");
    
    if (!audioFile || !(audioFile instanceof File)) {
      throw new Error("No audio file provided");
    }
    
    logStep("Audio file received", { 
      filename: audioFile.name,
      type: audioFile.type,
      size: audioFile.size
    });
    
    // Convert the file to an array buffer
    const audioBuffer = await audioFile.arrayBuffer();
    
    // Create a FormData object to send to OpenAI
    const openAIFormData = new FormData();
    openAIFormData.append("file", new Blob([audioBuffer], { type: audioFile.type }), audioFile.name);
    openAIFormData.append("model", "whisper-1");
    openAIFormData.append("language", "en");
    
    // Call OpenAI's Whisper API
    logStep("Calling OpenAI Whisper API");
    const openAIResponse = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIKey}`
      },
      body: openAIFormData
    });
    
    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      logStep("OpenAI API error", { status: openAIResponse.status, text: errorText });
      throw new Error(`OpenAI API error: ${openAIResponse.status} - ${errorText}`);
    }
    
    const result = await openAIResponse.json();
    logStep("Transcription successful", { 
      textLength: result.text.length
    });
    
    // Return the transcription result
    return new Response(JSON.stringify({ 
      text: result.text, 
      success: true 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage, success: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

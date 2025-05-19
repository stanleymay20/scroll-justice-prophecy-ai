
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
    const { petitionTitle, petitionDescription } = await req.json();
    
    // Validate required fields
    if (!petitionTitle || !petitionDescription) {
      throw new Error("Missing required petition information");
    }
    
    console.log("Processing verdict request for petition:", petitionTitle);

    // For academic research purposes only
    const disclaimer = "DISCLAIMER: This is an AI-assisted research tool only. This does not represent a real court, judge, or legal conclusion. Not a substitute for legal advice. For academic exploration only.";
    
    // Simplified verdict for research/educational purposes only
    const verdict = "This is a simulated response for educational purposes only. Not a legal determination.";
    const reasoning = `The AI tool has analyzed your query titled "${petitionTitle}" for educational purposes. ${disclaimer}`;
    
    // Log the generated verdict
    console.log("Generated AI research output with disclaimer");

    return new Response(JSON.stringify({ 
      suggested_verdict: verdict,
      reasoning: reasoning,
      confidence_score: 0,  // Removing fictional confidence scores
      disclaimer: disclaimer
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error("Error generating educational response:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
});

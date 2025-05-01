
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { petitionTitle, petitionDescription, evidence } = await req.json();
    
    // This would connect to an external AI service
    // For now, we'll return a mock verdict
    
    const verdict = {
      suggested_verdict: petitionTitle.includes('approve') ? 'Approved' : 'Consider with caution',
      reasoning: `Based on the available evidence and the sacred scroll principles, 
        this petition requires careful consideration. The matter concerns "${petitionTitle}" 
        which has been evaluated with the following key points:
        
        1. The petitioner's claim has been analyzed according to scroll integrity standards
        2. Historical precedents in similar cases suggest a moderate approach
        3. The evidence provided shows ${evidence ? 'some supporting material' : 'limited support'} for the claims
        
        The final determination should balance justice with mercy, following the sacred oath.`,
      integrity_score: 85,
      suggested_actions: [
        "Review historical precedents in the sacred scrolls",
        "Consider the petitioner's scroll witness reputation",
        "Apply the principle of balanced justice"
      ]
    };

    return new Response(JSON.stringify(verdict), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-ai-verdict function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});


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

    // In a real application, this would call an actual AI model
    // For now, we'll generate verdicts based on simple rules
    
    // The verdict will be positive or negative based on some simple analysis
    const contentLowerCase = (petitionTitle + " " + petitionDescription).toLowerCase();
    
    // Look for key phrases that might indicate verdict direction
    const positiveKeywords = ["help", "support", "fair", "equal", "justice", "reasonable", "rights"];
    const negativeKeywords = ["unfair", "corrupt", "violation", "illegal", "unlawful", "harm"];
    
    let positiveScore = positiveKeywords.filter(word => contentLowerCase.includes(word)).length;
    let negativeScore = negativeKeywords.filter(word => contentLowerCase.includes(word)).length;
    
    // Analyze length - longer petitions might be more detailed and well-reasoned
    const wordCount = petitionDescription.split(/\s+/).length;
    if (wordCount > 100) positiveScore += 1;
    if (wordCount < 20) negativeScore += 1;
    
    let verdict, reasoning;
    
    if (positiveScore > negativeScore) {
      verdict = "The petition is found to have merit and is approved.";
      reasoning = `After careful analysis of the petition titled "${petitionTitle}", the scrolls have determined that the arguments presented hold sufficient merit. The petition demonstrates a reasonable basis for the claims made and is in accordance with the principles of justice.`;
    } else if (positiveScore < negativeScore) {
      verdict = "The petition is found to lack sufficient merit and is rejected.";
      reasoning = `After careful analysis of the petition titled "${petitionTitle}", the scrolls have determined that the arguments presented lack sufficient merit. The petition fails to demonstrate a reasonable basis for the claims made or contradicts established principles of justice.`;
    } else {
      verdict = "The petition requires further deliberation by a human judge.";
      reasoning = `After analyzing the petition titled "${petitionTitle}", the scrolls are unable to reach a clear determination. The case presents complex factors that would benefit from human judicial review and wisdom.`;
    }
    
    // Log the generated verdict
    console.log("Generated AI verdict:", verdict);

    return new Response(JSON.stringify({ 
      suggested_verdict: verdict,
      reasoning: reasoning,
      confidence_score: Math.min(Math.max(Math.abs(positiveScore - negativeScore) * 20, 40), 90) // Score between 40-90
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error("Error generating verdict:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
});

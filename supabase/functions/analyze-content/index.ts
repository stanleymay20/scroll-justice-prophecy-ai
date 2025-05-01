
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
    const { text } = await req.json();
    
    if (!text) {
      throw new Error("No text provided for analysis");
    }
    
    console.log("Analyzing content, length:", text.length);
    
    // Analyze text for integrity metrics
    // In a real application, this would use a sophisticated NLP model
    
    // Basic analysis
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    const avgWordsPerSentence = sentences > 0 ? words / sentences : 0;
    
    // Check for common issues
    const allCaps = text.toUpperCase() === text;
    const hasRepeatedPunctuation = /[!?]{2,}/.test(text);
    const hasVeryLongSentences = avgWordsPerSentence > 35;
    const isVeryShort = words < 15;
    
    // Calculate integrity score
    let integrityScore = 100; // Start at perfect
    let recommendations = [];
    
    if (allCaps) {
      integrityScore -= 30;
      recommendations.push("Avoid writing in all capital letters as it may be perceived as excessive emphasis");
    }
    
    if (hasRepeatedPunctuation) {
      integrityScore -= 15;
      recommendations.push("Multiple exclamation or question marks may seem unprofessional");
    }
    
    if (hasVeryLongSentences) {
      integrityScore -= 10;
      recommendations.push("Consider breaking up very long sentences for clarity");
    }
    
    if (isVeryShort) {
      integrityScore -= 25;
      recommendations.push("Petition is too brief. Please provide more details to support your case");
    }
    
    // Sentence structure analysis
    if (sentences > 0) {
      const sentenceVariety = Math.min(sentences / 2, 4); // 0-4 points for variety
      integrityScore += sentenceVariety;
    }
    
    // Word count bonus
    if (words > 50) integrityScore += 5;
    if (words > 150) integrityScore += 5;
    
    // Cap score between 0-100
    integrityScore = Math.min(Math.max(Math.round(integrityScore), 0), 100);
    
    console.log("Content analysis complete, score:", integrityScore);
    
    return new Response(JSON.stringify({
      integrityScore,
      recommendations,
      metrics: {
        wordCount: words,
        sentenceCount: sentences,
        avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error("Error analyzing content:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      integrityScore: 70, // Default fallback score
      success: false 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
});

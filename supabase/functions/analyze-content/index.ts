
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
    const { text } = await req.json();
    
    // Simple content analysis logic
    // In a real implementation, this would use more sophisticated NLP
    const lowercaseText = text.toLowerCase();
    
    // Check for toxic content
    const toxicTerms = ['hate', 'attack', 'stupid', 'idiot', 'destroy', 'kill'];
    const hasToxicTerms = toxicTerms.some(term => lowercaseText.includes(term));
    
    // Calculate integrity score
    let integrityScore = 100;
    
    if (hasToxicTerms) {
      integrityScore -= 40;
    }
    
    if (text.length < 20) {
      integrityScore -= 20;
    }
    
    if (text.includes('!!!') || text.includes('???')) {
      integrityScore -= 10;
    }
    
    // Prepare result
    const result = {
      integrityScore: Math.max(integrityScore, 0),
      hasToxicContent: hasToxicTerms,
      recommendations: []
    };
    
    if (hasToxicTerms) {
      result.recommendations.push('Content contains language that may violate scroll integrity guidelines');
    }
    
    if (text.length < 20) {
      result.recommendations.push('Consider providing more detailed information');
    }
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-content function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

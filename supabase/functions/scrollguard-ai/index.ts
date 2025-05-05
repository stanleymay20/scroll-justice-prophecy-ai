
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

interface ScrollGuardRequest {
  content: string;
  contentType: 'petition' | 'post' | 'comment';
  userId?: string;
}

interface ScrollGuardResponse {
  flagged: boolean;
  reasons: string[];
  score: number;
  recommendation: 'approve' | 'review' | 'reject';
  flags: {
    manipulative: boolean;
    spiritualAbuse: boolean;
    falseAccusation: boolean;
    misleading: boolean;
    harmful: boolean;
  };
}

serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    });

    // Parse request body
    const requestData: ScrollGuardRequest = await req.json();
    
    if (!requestData.content) {
      return new Response(
        JSON.stringify({ error: "Content is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log(`Processing ScrollGuard analysis for ${requestData.contentType}`);

    // Analyze content with OpenAI
    const analysisResult = await analyzeContent(requestData.content, requestData.contentType);
    
    // Log the analysis
    if (requestData.userId) {
      await supabaseAdmin
        .from('scroll_abuse_flags')
        .insert({
          user_id: requestData.userId,
          content_type: requestData.contentType,
          content_snippet: requestData.content.substring(0, 100) + (requestData.content.length > 100 ? '...' : ''),
          flagged: analysisResult.flagged,
          flag_reasons: analysisResult.reasons,
          flag_score: analysisResult.score,
          recommendation: analysisResult.recommendation,
          created_at: new Date().toISOString(),
        });

      // Log to AI audit logs
      await supabaseAdmin
        .from('ai_audit_logs')
        .insert({
          user_id: requestData.userId,
          action_type: 'SCROLLGUARD_ANALYSIS',
          ai_model: 'gpt-4o-mini',
          input_summary: `Analysis of ${requestData.contentType}: "${requestData.content.substring(0, 50)}..."`,
          output_summary: `Flagged: ${analysisResult.flagged}, Score: ${analysisResult.score}, Recommendation: ${analysisResult.recommendation}`,
        });
      
      // If flagged with high score, also log to integrity logs
      if (analysisResult.flagged && analysisResult.score > 70) {
        await supabaseAdmin
          .from('scroll_integrity_logs')
          .insert({
            user_id: requestData.userId,
            action_type: 'CONTENT_VIOLATION',
            description: `User submitted ${requestData.contentType} that was flagged for ${analysisResult.reasons.join(', ')}`,
            integrity_impact: -10,
          });
      }
    }
    
    return new Response(
      JSON.stringify(analysisResult),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("ScrollGuard error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

async function analyzeContent(content: string, contentType: string): Promise<ScrollGuardResponse> {
  if (!OPENAI_API_KEY) {
    console.warn("No OpenAI API key provided, using mock response");
    // Return mock response when no API key is available
    return mockAnalyzeContent(content);
  }

  try {
    const prompt = `
You are ScrollGuard AI, a specialized content moderation system for the ScrollJustice platform.
Your task is to evaluate the following ${contentType} content for potential abuse or manipulation.

CONTENT TO ANALYZE:
"""
${content}
"""

Analyze the content for the following flags:
1. Manipulative language - Does the content attempt to manipulate emotions or actions?
2. Spiritual abuse - Does the content misuse spiritual concepts to control or manipulate?
3. False accusations - Does the content make unsubstantiated claims against others?
4. Misleading information - Does the content contain factual inaccuracies or distortions?
5. Harmful content - Does the content promote harm to self or others?

Provide your analysis in JSON format:
{
  "flagged": boolean,
  "reasons": string[],
  "score": number (0-100, higher = more concerning),
  "recommendation": "approve" | "review" | "reject",
  "flags": {
    "manipulative": boolean,
    "spiritualAbuse": boolean,
    "falseAccusation": boolean,
    "misleading": boolean,
    "harmful": boolean
  }
}

Only respond with the JSON. Do not include any other text.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are ScrollGuard AI, a spiritual content moderation system.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content.trim();
    
    try {
      // Parse the JSON response
      const analysis = JSON.parse(analysisText);
      return analysis as ScrollGuardResponse;
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      console.log("Raw response:", analysisText);
      // Fall back to mock response if parsing fails
      return mockAnalyzeContent(content);
    }
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    // Fall back to mock response on error
    return mockAnalyzeContent(content);
  }
}

// Mock function when OpenAI is unavailable
function mockAnalyzeContent(content: string): ScrollGuardResponse {
  // Very basic check for concerning words
  const concerningWords = [
    'kill', 'die', 'hate', 'attack', 'destroy', 'evil', 'demon', 'satan', 
    'conspiracy', 'fake', 'fraud', 'scam', 'enemy', 'betrayal'
  ];
  
  let score = 0;
  const reasons: string[] = [];
  const flags = {
    manipulative: false,
    spiritualAbuse: false,
    falseAccusation: false,
    misleading: false,
    harmful: false
  };
  
  const contentLower = content.toLowerCase();
  
  // Check for concerning words
  concerningWords.forEach(word => {
    if (contentLower.includes(word)) {
      score += 10;
      
      if (word === 'kill' || word === 'die' || word === 'attack' || word === 'destroy') {
        flags.harmful = true;
        if (!reasons.includes('Potentially harmful language')) {
          reasons.push('Potentially harmful language');
        }
      } else if (word === 'evil' || word === 'demon' || word === 'satan') {
        flags.spiritualAbuse = true;
        if (!reasons.includes('Potential spiritual abuse language')) {
          reasons.push('Potential spiritual abuse language');
        }
      } else if (word === 'conspiracy' || word === 'fake' || word === 'fraud' || word === 'scam') {
        flags.falseAccusation = true;
        flags.misleading = true;
        if (!reasons.includes('Potential false accusations')) {
          reasons.push('Potential false accusations');
        }
      }
    }
  });
  
  // Check for all caps sections (potential manipulation)
  if (content.match(/[A-Z]{4,}/)) {
    score += 5;
    flags.manipulative = true;
    reasons.push('Use of capitalized text may indicate manipulative tactics');
  }
  
  // Check for excessive punctuation (potential manipulation)
  if (content.match(/[!?]{3,}/)) {
    score += 5;
    flags.manipulative = true;
    reasons.push('Excessive punctuation may indicate manipulative emotion');
  }
  
  // Cap the score at 100
  score = Math.min(100, score);
  
  // Determine recommendation based on score
  let recommendation: 'approve' | 'review' | 'reject' = 'approve';
  if (score > 70) {
    recommendation = 'reject';
  } else if (score > 30) {
    recommendation = 'review';
  }
  
  return {
    flagged: score > 30,
    reasons,
    score,
    recommendation,
    flags
  };
}

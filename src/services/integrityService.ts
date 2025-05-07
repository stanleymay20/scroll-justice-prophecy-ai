import { supabase } from "@/integrations/supabase/client";
import { safeRpcCall } from "@/utils/supabaseUtils";
import { generateFlameSignature } from "@/utils/cryptoUtils";

/**
 * Flags an integrity violation in the system
 * 
 * @param userId The user who violated integrity rules
 * @param actionType The type of violation (e.g., "self_verdict", "inappropriate_content")
 * @param impactScore Negative impact score (0-100)
 * @param description Optional description of the violation
 * @param petitionId Optional associated petition ID
 */
export async function flagIntegrityViolation(
  userId: string,
  actionType: string,
  impactScore: number,
  description?: string,
  petitionId?: string
) {
  try {
    // Record the integrity violation
    const { error } = await supabase
      .from('scroll_integrity_logs')
      .insert({
        user_id: userId,
        action_type: actionType,
        integrity_impact: impactScore,
        description,
        petition_id: petitionId,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    // Return the impact score
    return impactScore;
  } catch (error) {
    console.error('Error flagging integrity violation:', error);
    throw error;
  }
}

/**
 * Check if a user is attempting to deliver a verdict on their own petition
 * 
 * @param userId The user ID attempting to deliver a verdict
 * @param petitionId The petition ID
 * @returns True if the user is the petitioner (self-verdict attempt)
 */
export async function checkSelfVerdict(userId: string, petitionId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('scroll_petitions')
      .select('petitioner_id')
      .eq('id', petitionId)
      .single();
    
    if (error) throw error;
    
    const isSelfVerdict = data.petitioner_id === userId;
    
    if (isSelfVerdict) {
      // Flag as an integrity violation if it's a self-verdict attempt
      await flagIntegrityViolation(
        userId,
        'self_verdict_attempt',
        15,
        'Attempted to deliver verdict on own petition',
        petitionId
      );
    }
    
    return isSelfVerdict;
  } catch (error) {
    console.error('Error checking self verdict:', error);
    return false;
  }
}

/**
 * Get an AI-suggested verdict for a petition
 * 
 * @param petitionId The petition ID to get a verdict suggestion for
 * @returns An AI-suggested verdict or null if unavailable
 */
export async function getAiSuggestedVerdict(petitionId: string): Promise<string | null> {
  try {
    // First check if we already have an AI-suggested verdict
    const { data: petition, error } = await supabase
      .from('scroll_petitions')
      .select('ai_suggested_verdict')
      .eq('id', petitionId)
      .single();
    
    if (error) throw error;
    
    // If we already have an AI suggestion, return it
    if (petition.ai_suggested_verdict) {
      return petition.ai_suggested_verdict;
    }
    
    // Otherwise, analyze the petition and generate a suggested verdict
    // This would typically call an AI service or model
    // For now, we'll return a placeholder
    return "Based on the content and precedents, this petition appears to have merit and should be approved with conditions.";
  } catch (error) {
    console.error('Error getting AI suggested verdict:', error);
    return null;
  }
}

/**
 * Analyze content for integrity issues
 * 
 * @param content The content to analyze
 * @returns An analysis result with score and issues
 */
export async function analyzeContent(content: string): Promise<{ score: number; issues: string[] }> {
  try {
    // For demo purposes, we'll use a placeholder
    const result = await safeRpcCall(
      "calculate_integrity_score",
      { content },
      async () => {
        // Basic fallback if the RPC call fails
        const wordCount = content.split(/\s+/).length;
        const score = Math.min(100, Math.max(50, wordCount / 2));
        const issues = [];
        
        if (score < 70) {
          issues.push('Content may be insufficient');
        }
        
        if (/\b(fraud|scam|illegal|weapon)\b/i.test(content)) {
          issues.push('Potentially concerning terminology');
        }
        
        return {
          score,
          issues
        };
      }
    );
    
    return result;
  } catch (error) {
    console.error('Error analyzing content:', error);
    return {
      score: 70,
      issues: ['Error analyzing content']
    };
  }
}

/**
 * Get the integrity score for a user
 * 
 * @param userId The user ID to check
 * @returns The user's integrity score (0-100)
 */
export async function getUserIntegrityScore(userId: string): Promise<number> {
  try {
    const score = await safeRpcCall(
      "calculate_user_integrity",
      { user_id: userId },
      async () => {
        // Basic fallback if the RPC call fails
        return 85; // Default score
      }
    );
    
    return score as number;
  } catch (error) {
    console.error('Error getting user integrity score:', error);
    return 70; // Default fallback score
  }
}

/**
 * Generate a cryptographic hash signature for a scroll verdict
 * 
 * @param petitionId The petition ID
 * @param verdict The verdict (approved/rejected)
 * @param reasoning The reasoning text
 * @param judgeId The ID of the judge
 * @returns A promise resolving to the flame signature hash
 */
export async function generateFlameSignatureHash(
  petitionId: string,
  verdict: string,
  reasoning: string,
  judgeId: string
): Promise<string> {
  const timestamp = new Date().toISOString();
  const content = `${petitionId}|${verdict}|${reasoning}|${judgeId}|${timestamp}`;
  
  return generateFlameSignature(content);
}

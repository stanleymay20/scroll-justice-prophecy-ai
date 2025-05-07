import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { safeRpcCall } from '@/utils/supabaseUtils';
import { FlameIntegrityLevel, OathValidationStatus } from '@/types/mcp';

/**
 * Flag an integrity violation in the system
 * @param userId The ID of the user reporting the violation
 * @param petitionId The ID of the petition with the violation
 * @param description Description of the violation
 * @param impactLevel The impact level of the violation (negative number)
 */
export const flagIntegrityViolation = async (
  userId: string,
  petitionId: string,
  description: string,
  impactLevel: number
): Promise<boolean> => {
  try {
    const { error } = await supabase.from('scroll_integrity_logs').insert({
      user_id: userId,
      petition_id: petitionId,
      action_type: 'integrity_violation',
      description,
      integrity_impact: -Math.abs(impactLevel), // Ensure it's negative
    });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error flagging integrity violation:', err);
    return false;
  }
};

/**
 * Check if a judge is trying to judge their own petition
 * @param judgeId The ID of the judge
 * @param petitionId The ID of the petition
 */
export const checkSelfVerdict = async (
  judgeId: string,
  petitionId: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('scroll_petitions')
      .select('petitioner_id')
      .eq('id', petitionId)
      .single();

    if (error) throw error;
    
    // Return true if it's the same person (self-verdict)
    return data.petitioner_id === judgeId;
  } catch (err) {
    console.error('Error checking self verdict:', err);
    return false;
  }
};

/**
 * Get AI-suggested verdict for a petition
 * @param petitionId The ID of the petition
 */
export const getAiSuggestedVerdict = async (
  petitionId: string
): Promise<string | null> => {
  try {
    // First try to see if we have a cached suggested verdict
    const { data: petitionData, error: petitionError } = await supabase
      .from('scroll_petitions')
      .select('ai_suggested_verdict')
      .eq('id', petitionId)
      .single();
    
    if (petitionError) throw petitionError;
    
    // If we already have a suggestion, return it
    if (petitionData.ai_suggested_verdict) {
      return petitionData.ai_suggested_verdict;
    }
    
    // Otherwise, get a new suggestion from the AI service
    const { data, error } = await supabase.functions.invoke('get-ai-verdict', {
      body: { petitionId }
    });
    
    if (error) throw error;
    
    // Update the petition with the suggested verdict
    await supabase
      .from('scroll_petitions')
      .update({ ai_suggested_verdict: data.verdict })
      .eq('id', petitionId);
    
    return data.verdict;
  } catch (err) {
    console.error('Error getting AI suggested verdict:', err);
    return null;
  }
};

/**
 * Get the integrity score for a user
 * @param userId The ID of the user
 */
export const getUserIntegrityScore = async (
  userId: string
): Promise<number> => {
  try {
    return await safeRpcCall<number, number>(
      'calculate_user_integrity',
      { user_id: userId },
      async () => {
        // Fallback calculation if the RPC function isn't available
        const { data, error } = await supabase
          .from('scroll_integrity_logs')
          .select('integrity_impact')
          .eq('user_id', userId);
        
        if (error) throw error;
        
        // Calculate the integrity score based on the logs
        let score = 100; // Start with perfect score
        if (data && data.length > 0) {
          const totalImpact = data.reduce((sum, log) => sum + (log.integrity_impact || 0), 0);
          score = Math.max(0, Math.min(100, score + totalImpact));
        }
        
        return score;
      }
    );
  } catch (err) {
    console.error('Error calculating user integrity score:', err);
    return 75; // Default moderate score
  }
};

/**
 * Analyze content for integrity issues
 * @param content The content to analyze
 */
export const analyzeContent = async (
  content: string
): Promise<{ score: number; issues: string[] }> => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-content', {
      body: { content }
    });
    
    if (error) throw error;
    
    return {
      score: data.score,
      issues: data.issues
    };
  } catch (err) {
    console.error('Error analyzing content:', err);
    // Return a default response if the analysis fails
    return { 
      score: 75,
      issues: ["Content could not be fully analyzed"]
    };
  }
};

/**
 * Generate a flame signature hash for authentication
 * @param userId The ID of the user
 * @param timestamp The timestamp to include in the signature
 */
export const generateFlameSignatureHash = (
  userId: string,
  timestamp: number = Date.now()
): string => {
  const randomSalt = Math.random().toString(36).substring(2, 15);
  const signature = `${userId}:${timestamp}:${randomSalt}`;
  
  // In a real implementation, this would use a secure hashing algorithm
  // For now we'll just return an encoded version of the signature
  return btoa(signature);
};

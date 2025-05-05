import { supabase } from '@/integrations/supabase/client';
import { logIntegrityAction } from './petitionQueries';
import { generateFlameSignatureHash } from './utils/hashUtils';

/**
 * Flags an integrity violation
 */
export async function flagIntegrityViolation(
  petitionId: string,
  description: string
): Promise<boolean> {
  try {
    // Log a negative integrity impact
    await logIntegrityAction(
      'INTEGRITY_VIOLATION',
      -10, // Significant negative impact
      description,
      petitionId
    );
    
    // Update the petition's integrity score
    const { error } = await supabase
      .from('scroll_petitions')
      .update({
        scroll_integrity_score: supabase.rpc('calculate_new_score', { 
          current_score: 100, 
          impact: -10 
        })
      })
      .eq('id', petitionId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error flagging integrity violation:', error);
    return false;
  }
}

/**
 * Checks if the user has rendered a verdict on their own petition
 */
export async function checkSelfVerdict(petitionId: string): Promise<boolean> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    
    if (!userId) return false;
    
    const { data, error } = await supabase
      .from('scroll_petitions')
      .select('petitioner_id, assigned_judge_id')
      .eq('id', petitionId)
      .single();
      
    if (error) throw error;
    
    // Check if user is both petitioner and judge
    const isSelfVerdict = data.petitioner_id === userId && data.assigned_judge_id === userId;
    return isSelfVerdict;
  } catch (error) {
    console.error('Error checking for self verdict:', error);
    return false;
  }
}

/**
 * Gets an AI suggested verdict for a petition
 */
export async function getAiSuggestedVerdict(petitionId: string): Promise<string | null> {
  try {
    // In a real implementation, this would call an AI API
    // For now, we'll generate a simple response
    const suggestions = [
      "Based on the evidence provided, the petition has merit.",
      "The petition requires further evidence before a verdict can be reached.",
      "The petition appears to lack sufficient grounds.",
      "The submitted evidence supports the petitioner's claims.",
      "This case should be referred to a higher court."
    ];
    
    // Randomly select a suggestion
    const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    
    // Update the petition with the AI suggestion
    const { error } = await supabase
      .from('scroll_petitions')
      .update({
        ai_suggested_verdict: suggestion
      })
      .eq('id', petitionId);
      
    if (error) throw error;
    
    // Log the AI interaction
    await logIntegrityAction(
      'AI_VERDICT_REQUESTED',
      0, // Neutral impact
      `AI verdict suggestion requested for petition #${petitionId.substring(0, 8)}`,
      petitionId
    );
    
    return suggestion;
  } catch (error) {
    console.error('Error getting AI suggested verdict:', error);
    return null;
  }
}

/**
 * Gets a user's integrity score
 */
export async function getUserIntegrityScore(userId: string): Promise<number> {
  try {
    // Calculate integrity score based on logs
    const { data, error } = await supabase
      .rpc('calculate_integrity_score', { user_id_param: userId });
    
    if (error) {
      console.error('Error calculating integrity score:', error);
      return 50; // Default score
    }
    
    return data || 50;
  } catch (error) {
    console.error('Error in getUserIntegrityScore:', error);
    return 50; // Default score on error
  }
}

/**
 * Analyzes content for integrity issues
 */
export async function analyzeContent(content: string): Promise<{
  integrity_score: number;
  flagged_terms: string[];
}> {
  try {
    // For demo purposes, we'll use a simple analysis
    const flaggedTerms = [];
    let integrityScore = 100;
    
    // Check for potentially problematic terms
    const problematicTerms = [
      "fraud", "deceive", "manipulate", "corrupt", "bribe", "false", 
      "fake", "illegal", "unlawful", "mislead", "violate"
    ];
    
    problematicTerms.forEach(term => {
      if (content.toLowerCase().includes(term)) {
        flaggedTerms.push(`Contains potentially concerning term: "${term}"`);
        integrityScore -= 10; // Reduce score for each flagged term
      }
    });
    
    // Check text length
    if (content.length < 20) {
      flaggedTerms.push("Content is too short for meaningful analysis");
      integrityScore -= 15;
    }
    
    // Ensure score stays within 0-100 range
    integrityScore = Math.max(0, Math.min(100, integrityScore));
    
    return {
      integrity_score: integrityScore,
      flagged_terms: flaggedTerms
    };
  } catch (error) {
    console.error('Error analyzing content:', error);
    return {
      integrity_score: 50,
      flagged_terms: ["Error during analysis"]
    };
  }
}

export { generateFlameSignatureHash };


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
    
    // First get the current integrity score
    const { data: petitionData, error: fetchError } = await supabase
      .from('scroll_petitions')
      .select('scroll_integrity_score')
      .eq('id', petitionId)
      .single();
      
    if (fetchError) throw fetchError;
    
    const currentScore = petitionData?.scroll_integrity_score || 100;
    const newScore = Math.max(0, Math.min(100, currentScore - 10)); // Ensure score stays within 0-100
    
    // Update the petition's integrity score
    const { error } = await supabase
      .from('scroll_petitions')
      .update({
        scroll_integrity_score: newScore
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
    
    // Fetch the petition to check the petitioner_id and assigned_judge_id
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
    // Calculate average integrity score from user's petitions
    const { data, error } = await supabase
      .from('scroll_petitions')
      .select('scroll_integrity_score')
      .eq('petitioner_id', userId);
      
    if (error) throw error;
    
    if (!data || data.length === 0) return 100; // Default score for new users
    
    // Calculate average
    const total = data.reduce((sum, petition) => sum + (petition.scroll_integrity_score || 0), 0);
    return Math.round(total / data.length);
  } catch (error) {
    console.error('Error getting user integrity score:', error);
    return 75; // Default fallback score
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

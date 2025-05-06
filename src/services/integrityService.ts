
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';
import { generateHash } from '@/utils/cryptoUtils';
import { safeRpcCall } from '@/utils/supabaseUtils';

interface IntegrityResult {
  score: number;
  issues: string[];
}

/**
 * Analyzes text content for integrity issues
 * @param content The content to analyze
 * @returns An object with integrity score and any identified issues
 */
export const analyzeContent = async (content: string): Promise<IntegrityResult> => {
  try {
    // Extract title (first line) and description (rest)
    const lines = content.split('\n');
    const title = lines[0] || '';
    const description = lines.slice(1).join('\n') || '';

    // Try to use the database function for calculation
    const result = await safeRpcCall<IntegrityResult, IntegrityResult>(
      "calculate_integrity_score",
      { petition_title: title, petition_description: description },
      async () => {
        // Fallback implementation if the RPC function doesn't exist
        console.log('Using fallback integrity calculation');
        return performLocalIntegrityCheck(title, description);
      }
    );

    return result;
  } catch (error) {
    console.error("Error analyzing content integrity:", error);
    // Return a default result if something goes wrong
    return { 
      score: 50, 
      issues: ["Could not properly analyze integrity due to an error."]
    };
  }
};

/**
 * Fallback function for local integrity checking if the DB function is unavailable
 */
const performLocalIntegrityCheck = (title: string, description: string): IntegrityResult => {
  let score = 100;
  const issues: string[] = [];

  // Check length requirements
  if (title.length < 10) {
    score -= 15;
    issues.push('Title is too short (minimum 10 characters)');
  }

  if (description.length < 50) {
    score -= 20;
    issues.push('Description is too short (minimum 50 characters)');
  }

  // Check for suspicious patterns
  const combinedText = (title + " " + description).toLowerCase();
  
  const forbiddenTerms = ['fake', 'lie', 'scam', 'false', 'misleading', 'deceptive'];
  forbiddenTerms.forEach(term => {
    if (combinedText.includes(term)) {
      score -= 10;
      issues.push(`Contains prohibited term: ${term}`);
    }
  });
  
  const suspiciousPatterns = ['!!!', '???', 'URGENT', 'SECRET', 'CONFIDENTIAL'];
  suspiciousPatterns.forEach(pattern => {
    if (title.includes(pattern) || description.includes(pattern)) {
      score -= 5;
      issues.push(`Contains suspicious pattern: ${pattern}`);
    }
  });
  
  // Check for excessive capitalization
  const uppercaseCount = (title + description).replace(/[^A-Z]/g, '').length;
  const totalLength = (title + description).length;
  
  if (uppercaseCount > totalLength * 0.7) {
    score -= 15;
    issues.push('Excessive use of capital letters');
  }

  // Ensure score doesn't go below zero
  score = Math.max(0, score);
  
  return { score, issues };
};

/**
 * Flags an integrity violation for a petition
 */
export const flagIntegrityViolation = async (
  petitionId: string, 
  violationType: string, 
  description: string
) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be logged in to flag integrity violations');
  }
  
  // Determine impact based on violation type
  const impactMap: Record<string, number> = {
    'minor': 5,
    'moderate': 10,
    'severe': 20,
    'critical': 30
  };
  
  const impact = impactMap[violationType.toLowerCase()] || 10;
  
  // Log the integrity violation
  const { data, error } = await supabase
    .from('scroll_integrity_logs')
    .insert({
      petition_id: petitionId,
      user_id: user.id,
      action_type: 'flag_violation',
      description,
      integrity_impact: impact
    });
    
  if (error) {
    throw error;
  }
  
  // Update the petition's integrity score
  await supabase
    .from('scroll_petitions')
    .update({ 
      scroll_integrity_score: supabase.rpc('decrement_and_bound', { 
        current_value: 100, 
        decrement_by: impact,
        lower_bound: 0
      }) 
    })
    .eq('id', petitionId);
    
  return data;
};

/**
 * Check if user has submitted a self-verdict
 */
export const checkSelfVerdict = async (petitionId: string, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('scroll_petitions')
      .select('petitioner_id, assigned_judge_id, verdict')
      .eq('id', petitionId)
      .single();
      
    if (error) throw error;
    
    // If user is the petitioner or judge and there's a verdict, return true
    return (
      data.verdict !== null && 
      (data.petitioner_id === userId || data.assigned_judge_id === userId)
    );
  } catch (error) {
    console.error('Error checking self-verdict:', error);
    return false;
  }
};

/**
 * Get AI-suggested verdict based on petition content
 */
export const getAiSuggestedVerdict = async (
  petitionId: string
): Promise<{verdict: string, reasoning: string}> => {
  try {
    // Get petition details
    const { data: petition, error } = await supabase
      .from('scroll_petitions')
      .select('title, description')
      .eq('id', petitionId)
      .single();
      
    if (error) throw error;
    if (!petition) throw new Error('Petition not found');
    
    // Log AI interaction to audit logs
    await logAIInteraction({
      action_type: "PETITION_ANALYSIS",
      ai_model: "scroll-justice-model-1.0",
      input_summary: `Petition analysis for "${petition.title.substring(0, 30)}..."`,
      output_summary: "AI verdict suggestion"
    });
    
    // In a real app, we would call a real AI model here
    // This is just a simple simulation based on the petition content
    const petitionText = (petition.title + " " + petition.description).toLowerCase();
    
    let verdict: string;
    let reasoning: string;
    
    // Simple mock AI verdict generation based on keywords
    if (petitionText.includes('justice') && petitionText.includes('truth')) {
      verdict = 'approved';
      reasoning = 'The petition demonstrates a clear commitment to justice and truth, which aligns with scroll principles.';
    } else if (petitionText.length < 100) {
      verdict = 'rejected';
      reasoning = 'The petition lacks sufficient detail to make a proper judgment. More information is needed.';
    } else {
      const randomScore = Math.random();
      if (randomScore > 0.5) {
        verdict = 'approved';
        reasoning = 'Based on the content analysis, this petition meets the minimum threshold for approval.';
      } else {
        verdict = 'rejected';
        reasoning = 'The petition contents do not sufficiently demonstrate alignment with sacred principles of justice.';
      }
    }
    
    return { verdict, reasoning };
  } catch (error) {
    console.error('Error getting AI suggested verdict:', error);
    return { 
      verdict: 'pending', 
      reasoning: 'Unable to analyze petition due to an error.'
    };
  }
};

/**
 * Get a user's integrity score
 */
export const getUserIntegrityScore = async (userId: string): Promise<number> => {
  try {
    // Try to use the database function
    const score = await safeRpcCall<number, number>(
      "calculate_user_integrity",
      { user_id: userId },
      async () => {
        // Fallback to a simple implementation
        const { data, error } = await supabase
          .from('scroll_integrity_logs')
          .select('integrity_impact')
          .eq('user_id', userId);
          
        if (error) throw error;
        
        const totalImpact = data.reduce((sum, log) => sum + (log.integrity_impact || 0), 0);
        return Math.max(0, 100 - totalImpact);
      }
    );
    
    return score || 0;
  } catch (error) {
    console.error('Error calculating user integrity score:', error);
    return 50; // Default middle score on error
  }
};

/**
 * Generate a cryptographic signature for integrity verification
 */
export const generateFlameSignatureHash = (
  userId: string, 
  petitionId: string, 
  timestamp: number
): string => {
  return generateHash(`${userId}|${petitionId}|${timestamp}|SACRED_FLAME`);
};

/**
 * Log AI interactions for audit purposes
 */
export const logAIInteraction = async (params: {
  action_type: string;
  ai_model: string;
  input_summary: string;
  output_summary: string;
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.from('ai_audit_logs').insert({
      user_id: user?.id,
      ...params
    });
  } catch (error) {
    console.error('Error logging AI interaction:', error);
  }
};

/**
 * Hook to automatically log AI usage on component mount
 */
export const useAIUsageLogger = (
  componentName: string,
  aiModel: string = "scrolljustice-interface-1.0"
) => {
  const { toast } = useToast();
  
  useEffect(() => {
    const logUsage = async () => {
      try {
        await logAIInteraction({
          action_type: "COMPONENT_VIEW",
          ai_model: aiModel,
          input_summary: `User viewed ${componentName}`,
          output_summary: "Component rendered successfully"
        });
      } catch (error) {
        console.error(`Error logging AI usage for ${componentName}:`, error);
      }
    };
    
    logUsage();
  }, [componentName, aiModel, toast]);
};

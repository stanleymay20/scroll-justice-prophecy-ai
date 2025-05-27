
import { supabase } from '@/integrations/supabase/client';
import type { AIVerdictResponse } from '@/types';

export const flagIntegrityViolation = async (
  userId: string,
  petitionId: string,
  violationType: string,
  description: string
) => {
  try {
    const { error } = await supabase
      .from('scroll_integrity_logs')
      .insert({
        user_id: userId,
        petition_id: petitionId,
        action_type: violationType,
        integrity_impact: -10,
        description: description
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error flagging integrity violation:', error);
    throw error;
  }
};

export const checkSelfVerdict = async (petitionId: string, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('scroll_petitions')
      .select('petitioner_id')
      .eq('id', petitionId)
      .single();

    if (error) throw error;
    
    const isSelfVerdict = data.petitioner_id === userId;
    
    if (isSelfVerdict) {
      await flagIntegrityViolation(
        userId,
        petitionId,
        'SELF_VERDICT_ATTEMPT',
        'User attempted to render verdict on their own petition'
      );
    }
    
    return isSelfVerdict;
  } catch (error) {
    console.error('Error checking self-verdict:', error);
    return false;
  }
};

export const getAiSuggestedVerdict = async (title: string, description: string): Promise<AIVerdictResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-ai-verdict', {
      body: {
        petitionTitle: title,
        petitionDescription: description
      }
    });

    if (error) throw error;

    return {
      suggested_verdict: data.suggested_verdict,
      reasoning: data.reasoning,
      confidence_score: data.confidence_score,
      legal_citations: data.legal_citations,
      jurisdiction_basis: data.jurisdiction_basis
    };
  } catch (error) {
    console.error('Error getting AI verdict:', error);
    throw error;
  }
};

export const getUserIntegrityScore = async (userId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('scroll_integrity_logs')
      .select('integrity_impact')
      .eq('user_id', userId);

    if (error) throw error;

    const totalImpact = data.reduce((sum, log) => sum + log.integrity_impact, 0);
    return Math.max(0, Math.min(100, 100 + totalImpact));
  } catch (error) {
    console.error('Error getting integrity score:', error);
    return 100;
  }
};

export const analyzeContent = async (content: string) => {
  // Simple content analysis - in production this would use more sophisticated AI
  const flaggedTerms = [];
  const suspiciousPatterns = [
    'fake', 'fabricated', 'made up', 'false claim', 'lie', 'fraud'
  ];

  const contentLower = content.toLowerCase();
  for (const pattern of suspiciousPatterns) {
    if (contentLower.includes(pattern)) {
      flaggedTerms.push(`Potentially suspicious content: "${pattern}"`);
    }
  }

  const integrity_score = Math.max(20, 100 - (flaggedTerms.length * 15));

  return {
    integrity_score,
    flagged_terms: flaggedTerms,
    analysis_date: new Date().toISOString()
  };
};

export const generateFlameSignatureHash = async (content: string): Promise<string> => {
  // Generate a simple hash for content verification
  const encoder = new TextEncoder();
  const data = encoder.encode(content + Date.now().toString());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

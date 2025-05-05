import { supabase } from '@/integrations/supabase/client';

// Flag suspicious activity and record to the scroll_integrity_logs table
export async function flagIntegrityViolation(
  userId: string | null, 
  petitionId: string | null, 
  violationType: string, 
  description: string, 
  impactLevel: number = -10,
  isAlert: boolean = false
) {
  try {
    const { error } = await supabase.from('scroll_integrity_logs').insert({
      user_id: userId,
      petition_id: petitionId,
      action_type: violationType,
      description: description,
      integrity_impact: impactLevel,
      flame_alert: isAlert
    });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error recording integrity violation:', err);
    return false;
  }
}

// Check if a user is attempting to self-verdict
export async function checkSelfVerdict(petitionId: string, judgerId: string) {
  try {
    const { data, error } = await supabase
      .from('scroll_petitions')
      .select('petitioner_id')
      .eq('id', petitionId)
      .single();
      
    if (error) throw error;
    
    // If petitioner is the same as judge, flag as integrity violation
    if (data && data.petitioner_id === judgerId) {
      await flagIntegrityViolation(
        judgerId,
        petitionId,
        'SELF_VERDICT_ATTEMPT',
        'User attempted to deliver verdict on their own petition',
        -25,
        true
      );
      return true; // is a self verdict attempt
    }
    
    return false;
  } catch (err) {
    console.error('Error checking for self verdict:', err);
    return false;
  }
}

// Get an AI suggested verdict (but remember: the final verdict must come from a human judge)
export async function getAiSuggestedVerdict(title: string, description: string) {
  try {
    const { data, error } = await supabase.functions.invoke('generate-verdict-suggestion', {
      body: { title, description }
    });
    
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error getting AI suggested verdict:', err);
    throw err;
  }
}

// Get user's integrity score
export async function getUserIntegrityScore(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase.functions.invoke('calculate-user-integrity', {
      body: { userId }
    });
    
    if (error) throw error;
    return data?.integrity_score || 100; // Default to 100 if not found
  } catch (err) {
    console.error('Error getting user integrity score:', err);
    return 100; // Default to 100 on error
  }
}

// Add content analyzer functionality that was missing
export async function analyzeContent(content: string): Promise<{
  integrity_score: number;
  flagged_terms: string[];
  is_appropriate: boolean;
}> {
  try {
    // Simple content analysis implementation
    const lowercaseContent = content.toLowerCase();
    const flaggedTerms = [
      'hack', 'exploit', 'bypass', 'illegal', 'fraud', 'steal', 'attack',
      'harmful', 'malicious', 'spam', 'scam'
    ];
    
    const foundTerms = flaggedTerms.filter(term => lowercaseContent.includes(term));
    const termCount = foundTerms.length;
    
    // Calculate integrity score (100 is best, 0 is worst)
    const baseScore = 100;
    const penaltyPerTerm = 20;
    const integrityScore = Math.max(0, baseScore - (termCount * penaltyPerTerm));
    
    return {
      integrity_score: integrityScore,
      flagged_terms: foundTerms,
      is_appropriate: integrityScore >= 60 // Threshold for appropriateness
    };
  } catch (error) {
    console.error('Error analyzing content:', error);
    return {
      integrity_score: 50, // Default middle score
      flagged_terms: [],
      is_appropriate: true
    };
  }
}

// Record audio verdict upload
export async function saveAudioVerdict(
  petitionId: string,
  audioUrl: string,
  flameSealHash: string,
  transcription: string | null = null
) {
  try {
    const { data, error } = await supabase
      .from('scroll_petitions')
      .update({
        audio_verdict_url: audioUrl,
        scroll_seal_timestamp: new Date().toISOString(),
        flame_signature_hash: flameSealHash,
        verdict_transcription: transcription
      })
      .eq('id', petitionId)
      .select();
      
    if (error) throw error;
    
    await flagIntegrityViolation(
      null,
      petitionId,
      'AUDIO_VERDICT_SEALED',
      'Audio verdict sealed with flame signature',
      10,
      false
    );
    
    return data?.[0] || null;
  } catch (err) {
    console.error('Error saving audio verdict:', err);
    throw err;
  }
}

// Generate a flame signature hash (simplified - in real system would be more complex)
export function generateFlameSignatureHash(petitionId: string, judgeId: string): string {
  const timestamp = new Date().getTime();
  const baseString = `${petitionId}-${judgeId}-${timestamp}`;
  
  // Simple hash generation for demo purposes
  // In a real system, use a proper cryptographic hash function
  let hash = 0;
  for (let i = 0; i < baseString.length; i++) {
    const char = baseString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return `flame-${Math.abs(hash).toString(16)}-${timestamp.toString(16)}`;
}

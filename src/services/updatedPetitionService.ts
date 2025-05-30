
import { supabase } from '@/integrations/supabase/client';
import { ScrollPetition } from '@/types/petition';
import { validateProductionIntegrity, logProductionAction } from './productionIntegrityService';
import { generateScrollVerdict } from './scrollJusticeAI';

export const createProductionPetition = async (petitionData: {
  title: string;
  description: string;
  jurisdiction: string;
  category: string;
}): Promise<ScrollPetition> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Authentication required to file petition');
  }

  // Validate production integrity
  const integrityCheck = await validateProductionIntegrity({
    ...petitionData,
    petitioner_id: user.id
  });

  if (!integrityCheck.passed) {
    throw new Error(`Petition integrity validation failed: ${integrityCheck.violations.map(v => v.description).join('; ')}`);
  }

  // Create petition with real legal validation
  const { data, error } = await supabase
    .from('scroll_petitions')
    .insert({
      title: petitionData.title,
      description: petitionData.description,
      petitioner_id: user.id,
      status: 'pending',
      scroll_integrity_score: integrityCheck.integrity_score,
      is_sealed: false
    })
    .select()
    .single();

  if (error) throw error;

  // Log production action
  await logProductionAction('PETITION_CREATED', {
    petition_id: data.id,
    jurisdiction: petitionData.jurisdiction,
    category: petitionData.category
  }, user.id);

  return data as ScrollPetition;
};

export const generateProductionVerdict = async (
  petitionId: string,
  petitionData: {
    title: string;
    description: string;
    jurisdiction: string;
    category: string;
  }
): Promise<void> => {
  try {
    // Generate real legal verdict using ScrollJustice AI
    const scrollVerdict = await generateScrollVerdict(petitionData);

    // Format verdict for database storage
    const verdictText = `${scrollVerdict.sacred_preamble}\n\nVERDICT: ${scrollVerdict.verdict}\n\n${scrollVerdict.legal_analysis}\n\n${scrollVerdict.prophetic_guidance}`;
    
    const reasoningText = `LEGAL CITATIONS:\n${scrollVerdict.legal_citations.join('\n')}\n\nRESTITUTION:\n${scrollVerdict.restitution_ordered || 'None ordered'}\n\n${scrollVerdict.ai_disclaimer}`;

    // Update petition with verdict
    const { error } = await supabase
      .from('scroll_petitions')
      .update({
        verdict: verdictText,
        verdict_reasoning: reasoningText,
        verdict_timestamp: new Date().toISOString(),
        status: 'verdict_delivered',
        ai_suggested_verdict: `SCROLL TIMESTAMP: ${scrollVerdict.scroll_timestamp}\nGREGORIAN: ${scrollVerdict.gregorian_timestamp}\nJURISDICTION: ${scrollVerdict.jurisdiction_applied}`
      })
      .eq('id', petitionId);

    if (error) throw error;

    // Log verdict generation
    await logProductionAction('SCROLL_VERDICT_GENERATED', {
      petition_id: petitionId,
      verdict: scrollVerdict.verdict,
      jurisdiction: scrollVerdict.jurisdiction_applied
    });

  } catch (error) {
    console.error('Error generating production verdict:', error);
    throw error;
  }
};

import { supabase } from '@/integrations/supabase/client';
import { ScrollJudgment, LegalCitation } from '@/types/petition';

// Mock legal citations data since scroll_judgments table doesn't exist yet
const mockLegalCitations: LegalCitation[] = [
  { code: 'SCR-001', section: '1.1', description: 'Wage theft violation', category: 'labor', jurisdiction: 'EU' },
  { code: 'SCR-002', section: '2.1', description: 'Land rights violation', category: 'property', jurisdiction: 'EU' },
  { code: 'SCR-003', section: '3.1', description: 'Violence against person', category: 'criminal', jurisdiction: 'EU' }
];

export const triggerJudgment = async (petitionId: string): Promise<ScrollJudgment> => {
  try {
    console.log(`Triggering ScrollProphet judgment for petition: ${petitionId}`);
    
    // Fetch petition details
    const { data: petition, error: petitionError } = await supabase
      .from('scroll_petitions')
      .select('*')
      .eq('id', petitionId)
      .single();
    
    if (petitionError || !petition) {
      throw new Error('Sacred petition not found in the scrolls');
    }
    
    // Mock AI judgment since we don't have real AI integration yet
    const mockVerdict = generateMockVerdict(petition);
    
    // Update petition with verdict
    const { data: updatedPetition, error: updateError } = await supabase
      .from('scroll_petitions')
      .update({
        verdict: mockVerdict.verdict,
        verdict_reasoning: mockVerdict.reasoning,
        status: 'verdict_delivered',
        verdict_timestamp: new Date().toISOString(),
        ai_suggested_verdict: mockVerdict.verdict
      })
      .eq('id', petitionId)
      .select()
      .single();
    
    if (updateError) {
      throw new Error('Failed to record sacred judgment');
    }
    
    // Return mock judgment object
    return {
      id: crypto.randomUUID(),
      petition_id: petitionId,
      verdict: mockVerdict.verdict,
      reasoning: mockVerdict.reasoning,
      legal_citations: mockLegalCitations.map(c => `${c.code} ${c.section}: ${c.description}`),
      compensation_amount: mockVerdict.compensation,
      currency: 'EUR',
      language: 'en',
      ai_confidence: 0.85,
      created_at: new Date().toISOString(),
      is_public: true
    };
    
  } catch (error) {
    console.error('ScrollProphet judgment failed:', error);
    throw error;
  }
};

const generateMockVerdict = (petition: any) => {
  const verdicts = ['Guilty', 'Innocent', 'Partially Guilty'];
  const randomVerdict = verdicts[Math.floor(Math.random() * verdicts.length)];
  
  return {
    verdict: randomVerdict,
    reasoning: `Based on review of the petition "${petition.title}", the ScrollProphet finds the accused ${randomVerdict.toLowerCase()}. This judgment considers the sacred principles of justice and righteousness.`,
    compensation: randomVerdict === 'Guilty' ? Math.floor(Math.random() * 5000) + 500 : 0
  };
};

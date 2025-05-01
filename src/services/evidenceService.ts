
import { supabase } from '@/integrations/supabase/client';
import { ScrollEvidence } from '@/types/petition';

// Interface matching Supabase's expected insert type for evidence
interface EvidenceInsert {
  petition_id: string;
  file_path: string;
  file_type: string;
  description?: string;
  is_sealed?: boolean;
  uploaded_by: string;
}

// Upload evidence for a petition
export async function uploadEvidence(
  petitionId: string,
  file: File,
  description?: string
): Promise<ScrollEvidence> {
  try {
    // Generate a unique path
    const filePath = `evidence/${petitionId}/${Date.now()}_${file.name}`;
    
    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('scroll_evidence')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Create evidence record
    const evidence: EvidenceInsert = {
      petition_id: petitionId,
      file_path: filePath,
      file_type: file.type,
      description,
      is_sealed: false,
      uploaded_by: (await supabase.auth.getUser()).data.user?.id || 'anonymous',
    };
    
    const { data, error } = await supabase
      .from('scroll_evidence')
      .insert(evidence)
      .select();
      
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to create evidence record');
    
    return data[0] as unknown as ScrollEvidence;
  } catch (error) {
    console.error('Error uploading evidence:', error);
    throw error;
  }
}

// Get evidence for a petition
export async function getPetitionEvidence(petitionId: string): Promise<ScrollEvidence[]> {
  try {
    const { data, error } = await supabase
      .from('scroll_evidence')
      .select('*')
      .eq('petition_id', petitionId);
      
    if (error) throw error;
    if (!data) return [];
    
    return data as unknown as ScrollEvidence[];
  } catch (error) {
    console.error('Error fetching evidence:', error);
    throw error;
  }
}

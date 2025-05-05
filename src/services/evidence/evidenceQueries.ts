
import { supabase } from '@/integrations/supabase/client';
import { ScrollEvidence } from '@/types/petition';
import { logIntegrityAction } from '../petitionQueries';

/**
 * Fetches all evidence associated with a petition
 */
export async function getEvidenceForPetition(petitionId: string): Promise<ScrollEvidence[]> {
  try {
    const { data, error } = await supabase
      .from('scroll_evidence')
      .select('*')
      .eq('petition_id', petitionId)
      .order('uploaded_at', { ascending: false });
      
    if (error) throw error;
    return data as ScrollEvidence[] || [];
  } catch (error) {
    console.error('Error fetching evidence:', error);
    return [];
  }
}

/**
 * Uploads evidence file for a petition
 */
export async function uploadEvidence(
  petitionId: string,
  file: File,
  userId: string
): Promise<{ success: boolean; evidenceId?: string; error?: string }> {
  try {
    // Determine file type
    const fileType = file.type;
    
    // Create a file path with proper organization
    const filePath = `evidence/${petitionId}/${userId}_${Date.now()}_${file.name}`;
    
    // Upload the file to storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('scroll_evidence')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Get the public URL for the file
    const { data: publicUrlData } = await supabase
      .storage
      .from('scroll_evidence')
      .getPublicUrl(filePath);
      
    const fileUrl = publicUrlData.publicUrl;
    
    // Add a record to the scroll_evidence table
    const { data: evidenceData, error: evidenceError } = await supabase
      .from('scroll_evidence')
      .insert({
        petition_id: petitionId,
        file_path: fileUrl,
        file_type: fileType,
        uploaded_by: userId,
        description: '',
        is_sealed: false
      })
      .select()
      .single();
      
    if (evidenceError) throw evidenceError;
    
    // Log the upload as an integrity action
    await logIntegrityAction(
      'EVIDENCE_UPLOADED',
      2, // Small positive impact
      `Evidence uploaded for petition #${petitionId.substring(0, 8)}`,
      petitionId
    );
    
    return {
      success: true,
      evidenceId: evidenceData.id
    };
  } catch (error: any) {
    console.error('Error uploading evidence:', error);
    return {
      success: false,
      error: error.message || 'Error uploading evidence'
    };
  }
}

/**
 * Deletes an evidence file
 */
export async function deleteEvidence(evidenceId: string): Promise<boolean> {
  try {
    const { data: evidenceData, error: fetchError } = await supabase
      .from('scroll_evidence')
      .select('*')
      .eq('id', evidenceId)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Delete the file from storage
    const filePath = evidenceData.file_path;
    const fileName = filePath.split('/').pop();
    
    const { error: storageError } = await supabase
      .storage
      .from('scroll_evidence')
      .remove([`evidence/${evidenceData.petition_id}/${fileName}`]);
      
    if (storageError) console.warn('Error deleting file from storage:', storageError);
    
    // Delete the record from the database
    const { error: deleteError } = await supabase
      .from('scroll_evidence')
      .delete()
      .eq('id', evidenceId);
      
    if (deleteError) throw deleteError;
    
    // Log the deletion as an integrity action
    await logIntegrityAction(
      'EVIDENCE_DELETED',
      -1, // Small negative impact
      `Evidence deleted from petition #${evidenceData.petition_id.substring(0, 8)}`,
      evidenceData.petition_id
    );
    
    return true;
  } catch (error) {
    console.error('Error deleting evidence:', error);
    return false;
  }
}


import { supabase } from '@/integrations/supabase/client';
import { ScrollEvidence } from '@/types/petition';
import { logIntegrityAction } from './petitionQueries';

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

export async function uploadEvidence(
  petitionId: string,
  file: File,
  description: string
): Promise<ScrollEvidence | null> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    
    if (!userId) throw new Error('User must be logged in to upload evidence');
    
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
        description: description,
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
    
    return evidenceData as ScrollEvidence;
  } catch (error) {
    console.error('Error uploading evidence:', error);
    throw error;
  }
}

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

// Upload audio verdict evidence
export async function uploadAudioVerdict(
  petitionId: string,
  audioBlob: Blob,
  transcription: string | null = null
): Promise<string> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    
    if (!userId) throw new Error('User must be logged in to upload audio verdict');
    
    // Create a file path with proper organization
    const filePath = `verdicts/${petitionId}/${userId}_${Date.now()}.webm`;
    
    // Upload the audio file to storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('scroll_verdicts')
      .upload(filePath, audioBlob, {
        contentType: 'audio/webm'
      });
      
    if (uploadError) throw uploadError;
    
    // Get the public URL for the file
    const { data: publicUrlData } = await supabase
      .storage
      .from('scroll_verdicts')
      .getPublicUrl(filePath);
      
    const audioUrl = publicUrlData.publicUrl;
    
    // Generate a flame signature hash for the verdict
    const flameSealHash = generateFlameSignatureHash(petitionId, userId);
    
    // Update the petition with the audio verdict information
    await saveAudioVerdict(petitionId, audioUrl, flameSealHash, transcription);
    
    return audioUrl;
  } catch (error) {
    console.error('Error uploading audio verdict:', error);
    throw error;
  }
}

// Generate a flame signature hash (simplified)
function generateFlameSignatureHash(petitionId: string, judgeId: string): string {
  const timestamp = new Date().getTime();
  const baseString = `${petitionId}-${judgeId}-${timestamp}`;
  
  // Simple hash generation for demo purposes
  let hash = 0;
  for (let i = 0; i < baseString.length; i++) {
    const char = baseString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return `flame-${Math.abs(hash).toString(16)}-${timestamp.toString(16)}`;
}

// Check if an audio verdict exists for a petition
export async function hasAudioVerdict(petitionId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('scroll_petitions')
      .select('audio_verdict_url')
      .eq('id', petitionId)
      .single();
      
    if (error) throw error;
    
    return !!data.audio_verdict_url;
  } catch (error) {
    console.error('Error checking for audio verdict:', error);
    return false;
  }
}

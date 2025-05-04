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

export function getEvidencePublicUrl(filePath: string): string {
  // Extract just the filename from the full path if it's already a URL
  const fileName = filePath.includes('/') ? filePath.split('/').pop() || filePath : filePath;
  
  // If it's already a full URL, return it
  if (filePath.startsWith('http')) {
    return filePath;
  }
  
  // Otherwise get the public URL from Supabase
  const { data } = supabase
    .storage
    .from('scroll_evidence')
    .getPublicUrl(fileName);
    
  return data.publicUrl;
}

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

// Save the audio verdict to the petition
export async function saveAudioVerdict(
  petitionId: string,
  audioUrl: string,
  flameSealHash: string,
  transcription: string | null = null
): Promise<void> {
  try {
    const { error } = await supabase
      .from('scroll_petitions')
      .update({
        audio_verdict_url: audioUrl,
        flame_signature_hash: flameSealHash,
        verdict_transcription: transcription,
        scroll_seal_timestamp: new Date().toISOString()
      })
      .eq('id', petitionId);
      
    if (error) throw error;
    
    // Log the audio verdict as an integrity action
    await logIntegrityAction(
      'AUDIO_VERDICT_UPLOADED',
      5, // Positive impact
      `Audio verdict uploaded for petition #${petitionId.substring(0, 8)}`,
      petitionId
    );
  } catch (error) {
    console.error('Error saving audio verdict:', error);
    throw error;
  }
}

// Check if an audio verdict exists for a petition
export async function hasAudioVerdict(petitionId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('scroll_petitions')
      .select('audio_verdict_url')
      .eq('id', petitionId)
      .single();
      
    if (error) {
      console.error('Error checking for audio verdict:', error);
      return false;
    }
    
    return !!data?.audio_verdict_url;
  } catch (error) {
    console.error('Error checking for audio verdict:', error);
    return false;
  }
}

// Create storage buckets if they don't exist
export async function ensureEvidenceBucketExists(): Promise<boolean> {
  try {
    // Check if evidence bucket exists
    const { data: buckets, error } = await supabase
      .storage
      .listBuckets();
      
    if (error) throw error;
    
    const evidenceBucketExists = buckets?.some(bucket => bucket.name === 'scroll_evidence');
    const verdictsBucketExists = buckets?.some(bucket => bucket.name === 'scroll_verdicts');
    
    if (!evidenceBucketExists) {
      // Create evidence bucket
      const { error: createError } = await supabase
        .storage
        .createBucket('scroll_evidence', { public: true });
        
      if (createError) throw createError;
    }
    
    if (!verdictsBucketExists) {
      // Create verdicts bucket
      const { error: createError } = await supabase
        .storage
        .createBucket('scroll_verdicts', { public: true });
        
      if (createError) throw createError;
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring evidence bucket exists:', error);
    return false;
  }
}

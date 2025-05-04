
import { supabase } from '@/integrations/supabase/client';
import { logIntegrityAction } from '../petitionQueries';
import { generateFlameSignatureHash } from '../utils/hashUtils';

/**
 * Uploads an audio verdict for a petition
 */
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

/**
 * Saves audio verdict data to a petition
 */
export async function saveAudioVerdict(
  petitionId: string,
  audioUrl: string,
  flameSealHash: string,
  transcription: string | null = null
): Promise<void> {
  try {
    // Create the update data object with the correct types
    const { error } = await supabase
      .from('scroll_petitions')
      .update({
        audio_verdict_url: audioUrl,
        flame_signature_hash: flameSealHash,
        verdict_transcription: transcription,
        scroll_seal_timestamp: new Date().toISOString()
      } as any) // Using 'as any' as a temporary fix until Supabase types are regenerated
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

/**
 * Checks if a petition has an audio verdict
 */
export async function hasAudioVerdict(petitionId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('scroll_petitions')
      .select('*') // Using '*' instead of specific columns to avoid type issues
      .eq('id', petitionId)
      .single();
      
    if (error) {
      console.error('Error checking for audio verdict:', error);
      return false;
    }
    
    // Access the property safely to avoid TypeScript errors
    return !!data && 'audio_verdict_url' in data && !!data.audio_verdict_url;
  } catch (error) {
    console.error('Error checking for audio verdict:', error);
    return false;
  }
}


import { supabase } from '@/integrations/supabase/client';

export const uploadAudioVerdict = async (
  petitionId: string, 
  audioBlob: Blob, 
  transcription: string
): Promise<string> => {
  try {
    // Create file name
    const fileName = `verdict_${petitionId}_${Date.now()}.webm`;
    
    // Note: This would require a storage bucket to be set up
    // For now, we'll simulate the upload and return a mock URL
    const mockUrl = `https://example.com/verdicts/${fileName}`;
    
    // Update petition with AI suggested verdict as a placeholder
    const { error } = await supabase
      .from('scroll_petitions')
      .update({
        ai_suggested_verdict: transcription
      })
      .eq('id', petitionId);

    if (error) throw error;

    return mockUrl;
  } catch (error) {
    console.error('Error uploading audio verdict:', error);
    throw error;
  }
};

export const hasAudioVerdict = async (petitionId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('scroll_petitions')
      .select('ai_suggested_verdict')
      .eq('id', petitionId)
      .single();

    if (error) throw error;
    
    // Check if AI suggested verdict exists as a proxy for audio verdict
    return !!data?.ai_suggested_verdict;
  } catch (error) {
    console.error('Error checking audio verdict:', error);
    return false;
  }
};

export const getAudioVerdictUrl = async (petitionId: string): Promise<string | null> => {
  try {
    // For now, return null as the audio_verdict_url field doesn't exist
    // This would need to be implemented once the schema is updated
    return null;
  } catch (error) {
    console.error('Error getting audio verdict URL:', error);
    return null;
  }
};

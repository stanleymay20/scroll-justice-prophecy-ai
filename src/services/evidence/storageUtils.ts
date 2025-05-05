import { supabase } from '@/integrations/supabase/client';

/**
 * Gets the public URL for an evidence file
 */
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

/**
 * Ensures required storage buckets exist
 */
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

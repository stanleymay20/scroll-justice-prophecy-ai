
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

// Ensure the evidence bucket exists
export const ensureEvidenceBucketExists = async (): Promise<boolean> => {
  try {
    // Check if the bucket already exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'scroll_evidence');
    
    if (bucketExists) {
      console.log("Evidence bucket already exists");
      return true;
    }
    
    // If it doesn't exist, call our edge function to create it
    const { data, error } = await supabase.functions.invoke("create-evidence-bucket");
    
    if (error) {
      console.error("Error creating evidence bucket:", error);
      toast({
        title: "Storage Error",
        description: "Could not initialize evidence storage system",
        variant: "destructive"
      });
      return false;
    }
    
    console.log("Evidence bucket created successfully:", data);
    return true;
  } catch (error) {
    console.error("Error ensuring evidence bucket exists:", error);
    return false;
  }
};

// Upload evidence file
export const uploadEvidence = async (
  file: File,
  petitionId: string,
  userId: string
): Promise<{ success: boolean; filePath?: string; error?: string }> => {
  try {
    // Ensure bucket exists first
    const bucketReady = await ensureEvidenceBucketExists();
    if (!bucketReady) {
      return { success: false, error: "Evidence storage system not available" };
    }
    
    // Create a unique filename to prevent collisions
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}_${timestamp}.${fileExt}`;
    const filePath = `${petitionId}/${fileName}`;
    
    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('scroll_evidence')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return { success: false, error: uploadError.message };
    }
    
    // Get the public URL
    const { data: publicURL } = supabase.storage
      .from('scroll_evidence')
      .getPublicUrl(filePath);
      
    // Record in the scroll_evidence table
    const { error: dbError } = await supabase
      .from('scroll_evidence')
      .insert({
        petition_id: petitionId,
        uploaded_by: userId,
        file_path: publicURL.publicUrl,
        file_type: file.type,
        description: file.name,
        is_sealed: false
      });
      
    if (dbError) {
      console.error("Error recording evidence in database:", dbError);
      return { success: false, error: dbError.message };
    }
    
    return { success: true, filePath: publicURL.publicUrl };
  } catch (error) {
    console.error("Error in uploadEvidence:", error);
    return { success: false, error: String(error) };
  }
};

// Get all evidence for a petition
export const getEvidenceForPetition = async (petitionId: string) => {
  try {
    const { data, error } = await supabase
      .from('scroll_evidence')
      .select('*')
      .eq('petition_id', petitionId);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching evidence:", error);
    return [];
  }
};

// Delete evidence
export const deleteEvidence = async (evidenceId: string, filePath: string) => {
  try {
    // Extract just the path part from the full URL if needed
    let storagePath = filePath;
    if (filePath.includes('scroll_evidence/')) {
      storagePath = filePath.split('scroll_evidence/')[1];
    }
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('scroll_evidence')
      .remove([storagePath]);
      
    if (storageError) {
      console.error("Error deleting file from storage:", storageError);
    }
    
    // Delete from database
    const { error: dbError } = await supabase
      .from('scroll_evidence')
      .delete()
      .eq('id', evidenceId);
      
    if (dbError) {
      console.error("Error deleting evidence from database:", dbError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteEvidence:", error);
    return false;
  }
};


import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

/**
 * Uploads an image to the images storage bucket
 * @param file The file to upload
 * @param folder Optional folder path within the bucket
 * @returns The URL of the uploaded image or null if upload failed
 */
export const uploadImage = async (file: File, folder = ""): Promise<string | null> => {
  try {
    // Generate a unique filename to prevent overwriting
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    
    // Create the full path with optional folder
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);
    
    return publicUrl;
  } catch (error) {
    console.error('Error in image upload:', error);
    return null;
  }
};

/**
 * Fetches all images from a folder in the images bucket
 * @param folder The folder path within the bucket (optional)
 * @returns Array of image URLs or empty array if failed
 */
export const getImages = async (folder = ""): Promise<string[]> => {
  try {
    const { data, error } = await supabase.storage
      .from('images')
      .list(folder);
    
    if (error || !data) {
      console.error('Error fetching images:', error);
      return [];
    }
    
    // Filter for image files and get public URLs
    return data
      .filter(file => !file.metadata?.isFolder && 
        (file.metadata?.mimetype?.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)))
      .map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(folder ? `${folder}/${file.name}` : file.name);
        return publicUrl;
      });
  } catch (error) {
    console.error('Error listing images:', error);
    return [];
  }
};

/**
 * Deletes an image from the storage
 * @param url The full public URL of the image to delete
 * @returns Whether the deletion was successful
 */
export const deleteImage = async (url: string): Promise<boolean> => {
  try {
    // Extract the path from the URL
    const path = url.split('/').slice(-2).join('/');
    
    const { error } = await supabase.storage
      .from('images')
      .remove([path]);
    
    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in image deletion:', error);
    return false;
  }
};

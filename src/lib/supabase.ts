
// This file is now just importing from the centralized client
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { getCurrentSiteUrl } from '@/utils/domainUtils';

// Re-export the supabase client and helper functions
export { supabase, isSupabaseConfigured };

// Helper to encrypt data using ScrollSeal
export const encryptWithScrollSeal = async (data: string): Promise<{ encryptedData: string; key: string }> => {
  const key = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256
    },
    true,
    ["encrypt", "decrypt"]
  );
  
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedData = new TextEncoder().encode(data);
  
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv
    },
    key,
    encodedData
  );
  
  // Export the key for storage
  const exportedKey = await window.crypto.subtle.exportKey("jwk", key);
  const keyString = JSON.stringify(exportedKey);
  
  // Combine IV and encrypted data for storage
  const encryptedArray = new Uint8Array(encryptedBuffer);
  const combined = new Uint8Array(iv.length + encryptedArray.length);
  combined.set(iv);
  combined.set(encryptedArray, iv.length);
  
  // Convert to base64 for storage
  const encryptedBase64 = btoa(
    Array.from(combined)
      .map(byte => String.fromCharCode(byte))
      .join("")
  );
  
  return { 
    encryptedData: encryptedBase64,
    key: btoa(keyString)
  };
};

// Helper to decrypt data using ScrollSeal
export const decryptWithScrollSeal = async (encryptedBase64: string, keyBase64: string): Promise<string> => {
  try {
    // Convert base64 to array
    const combined = new Uint8Array(
      atob(encryptedBase64)
        .split("")
        .map(char => char.charCodeAt(0))
    );
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encryptedArray = combined.slice(12);
    
    // Import the key
    const keyString = atob(keyBase64);
    const importedKey = await window.crypto.subtle.importKey(
      "jwk",
      JSON.parse(keyString),
      {
        name: "AES-GCM",
        length: 256
      },
      false,
      ["decrypt"]
    );
    
    // Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv
      },
      importedKey,
      encryptedArray
    );
    
    // Convert to string
    const decryptedData = new TextDecoder().decode(decryptedBuffer);
    return decryptedData;
  } catch (error) {
    console.error("ScrollSeal decryption failed:", error);
    throw new Error("Failed to decrypt with ScrollSeal: Data may be corrupted or key is invalid");
  }
};

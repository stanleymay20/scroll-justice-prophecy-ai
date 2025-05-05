
import { createClient } from '@supabase/supabase-js';

// Use the environment variables with the provided values
const supabaseUrl = 'https://rgstpbaljoamkhjhomzp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnc3RwYmFsam9hbWtoamhvbXpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NjYxMzMsImV4cCI6MjA2MTM0MjEzM30.DLpKUaIo0REcRQzCAYV1bxW2bqqIdHNcsgBYf9SNRuE';
const siteUrl = 'https://lovable.dev/projects/f7d71f55-ae04-491e-87d0-df4a10e1f669/preview';

// Initialize Supabase client with the provided credentials and explicit auth config
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: localStorage
  }
});

// Export helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};

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

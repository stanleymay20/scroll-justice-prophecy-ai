
/**
 * ScrollCourt Cryptographic Utilities
 * Contains utilities for hashing, encrypting, and managing cryptographic 
 * operations for the ScrollCourt system.
 */

/**
 * Generates a SHA-256 hash for a given string input
 * @param input - The string to hash
 * @returns A promise that resolves to the hexadecimal hash string
 */
export async function sha256Hash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Encrypts data with AES-GCM using a provided key
 * @param data - Data to encrypt
 * @param key - Encryption key
 * @returns Encrypted data as a base64 string
 */
export async function encryptData(data: string, key: CryptoKey): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    
    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      encodedData
    );
    
    // Concatenate IV and ciphertext
    const result = new Uint8Array(iv.length + encryptedData.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encryptedData), iv.length);
    
    // Convert to base64
    return btoa(String.fromCharCode(...result));
  } catch (err) {
    console.error('Encryption error:', err);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts AES-GCM encrypted data using the provided key
 * @param encryptedData - Base64 encoded encrypted data
 * @param key - Decryption key
 * @returns Decrypted data as a string
 */
export async function decryptData(encryptedData: string, key: CryptoKey): Promise<string> {
  try {
    // Convert from base64
    const encryptedBytes = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    
    // Extract IV (first 12 bytes)
    const iv = encryptedBytes.slice(0, 12);
    const ciphertext = encryptedBytes.slice(12);
    
    // Decrypt
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      ciphertext
    );
    
    // Decode and return
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (err) {
    console.error('Decryption error:', err);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Generates a flame signature hash for scroll integrity verification
 * @param content - The content to generate a flame signature for
 * @param salt - Optional salt value to add uniqueness
 * @returns A flame signature hash string
 */
export async function generateFlameSignature(content: string, salt?: string): Promise<string> {
  const timestamp = Date.now().toString();
  const contentToHash = `${content}|${salt || ''}|${timestamp}`;
  const hash = await sha256Hash(contentToHash);
  return `${hash.substring(0, 12)}-${timestamp.substring(timestamp.length - 6)}`;
}

/**
 * Verifies whether a scroll's content matches its flame signature
 * @param content - The content to verify
 * @param signature - The flame signature to check against
 * @param salt - Optional salt used in the original signature
 * @returns Boolean indicating if the signature is valid
 */
export async function verifyFlameSignature(
  content: string, 
  signature: string,
  salt?: string
): Promise<boolean> {
  try {
    // Extract timestamp from signature
    const timestampPart = signature.split('-')[1];
    if (!timestampPart) return false;
    
    const timestamp = Date.now().toString().substring(0, 
      Date.now().toString().length - 6) + timestampPart;
    
    const contentToHash = `${content}|${salt || ''}|${timestamp}`;
    const hash = await sha256Hash(contentToHash);
    const sigHash = signature.split('-')[0];
    
    return hash.substring(0, 12) === sigHash;
  } catch (err) {
    console.error('Flame signature verification error:', err);
    return false;
  }
}

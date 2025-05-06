
/**
 * Generates a simple hash from the provided string data
 * @param data The string to hash
 * @returns A hash string
 */
export const generateHash = (data: string): string => {
  let hash = 0;
  if (data.length === 0) return hash.toString(16);
  
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(16);
};

/**
 * Generates a unique ID based on timestamp and random values
 * @returns A unique string ID
 */
export const generateUniqueId = (): string => {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Performs a one-way encryption of a password or phrase
 * @param text The text to encrypt
 * @returns An encrypted string
 */
export const encryptOneWay = async (text: string): Promise<string> => {
  // Create a hash using the Web Crypto API
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Checks if two strings match after one-way encryption
 * @param plainText The plain text to check
 * @param hashedText The previously hashed text to compare against
 * @returns True if the texts match after hashing
 */
export const verifyMatch = async (plainText: string, hashedText: string): Promise<boolean> => {
  const hashedPlainText = await encryptOneWay(plainText);
  return hashedPlainText === hashedText;
};

/**
 * Creates a verification token with expiration
 * @param userId User ID to include in the token
 * @param expiryMinutes Minutes until expiration
 * @returns A token object with the token string and expiry timestamp
 */
export const createVerificationToken = (userId: string, expiryMinutes: number = 60): { 
  token: string, 
  expiresAt: number 
} => {
  const expiresAt = Date.now() + expiryMinutes * 60 * 1000;
  const tokenData = `${userId}|${expiresAt}|${Math.random().toString(36).substring(2)}`;
  return {
    token: generateHash(tokenData),
    expiresAt
  };
};

/**
 * Validates if a token is still valid based on expiry time
 * @param tokenExpiryTimestamp The timestamp when the token expires
 * @returns True if token is still valid
 */
export const isTokenValid = (tokenExpiryTimestamp: number): boolean => {
  return Date.now() < tokenExpiryTimestamp;
};

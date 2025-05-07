
/**
 * Utilities for cryptographic operations used in the ScrollCourt system.
 */

/**
 * Generates a SHA-256 hash from a string input.
 * @param message The string to hash
 * @returns A promise that resolves to the hex-encoded hash
 */
export async function generateSha256Hash(message: string): Promise<string> {
  // Convert the message string to a Uint8Array
  const msgUint8 = new TextEncoder().encode(message);
  
  // Hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  
  // Convert the hash buffer to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates a cryptographic signature based on petition contents,
 * verdict, judge, timestamp, and optional salt.
 * 
 * @param content The concatenated content to sign
 * @param salt Optional cryptographic salt to add entropy
 * @returns A promise that resolves to the flame signature (hex-encoded hash)
 */
export async function generateFlameSignature(
  content: string,
  salt: string = new Date().toISOString()
): Promise<string> {
  const combinedContent = `${content}|${salt}`;
  return generateSha256Hash(combinedContent);
}

/**
 * Verifies a flame signature against provided content
 * 
 * @param content The content that was signed
 * @param signature The signature to verify
 * @param salt The original salt used, if any
 * @returns A promise resolving to true if signature is valid
 */
export async function verifyFlameSignature(
  content: string,
  signature: string,
  salt: string = ""
): Promise<boolean> {
  const combinedContent = salt ? `${content}|${salt}` : content;
  const computedHash = await generateSha256Hash(combinedContent);
  return computedHash === signature;
}

/**
 * Generates a time-limited token based on user ID and purpose
 * 
 * @param userId The user's ID
 * @param purpose The token purpose (e.g., "recovery", "verification")
 * @param expiryHours Hours until token expires
 * @returns A promise resolving to the token
 */
export async function generateTimeToken(
  userId: string,
  purpose: string,
  expiryHours: number = 24
): Promise<string> {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + expiryHours);
  
  const payload = {
    uid: userId,
    purpose,
    exp: Math.floor(expiry.getTime() / 1000)
  };
  
  const payloadStr = JSON.stringify(payload);
  const hash = await generateSha256Hash(payloadStr);
  
  // Return first 16 characters of hash as the token
  return hash.substring(0, 16);
}

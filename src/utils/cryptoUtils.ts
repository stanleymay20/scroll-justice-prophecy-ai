
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

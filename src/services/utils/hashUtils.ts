
/**
 * Generates a flame signature hash for verdict authentication
 */
export function generateFlameSignatureHash(petitionId: string, judgeId: string): string {
  const timestamp = new Date().getTime();
  const baseString = `${petitionId}-${judgeId}-${timestamp}`;
  
  // Simple hash generation for demo purposes
  let hash = 0;
  for (let i = 0; i < baseString.length; i++) {
    const char = baseString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return `flame-${Math.abs(hash).toString(16)}-${timestamp.toString(16)}`;
}

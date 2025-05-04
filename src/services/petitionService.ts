
// Re-export all functions from the new modular services
export * from './petitionQueries';
// Avoid duplicate exports
export { 
  getEvidenceForPetition, 
  uploadEvidence, 
  deleteEvidence, 
  hasAudioVerdict, 
  ensureEvidenceBucketExists, 
  getEvidencePublicUrl,
  uploadAudioVerdict
} from './evidenceService';
export { 
  flagIntegrityViolation, 
  checkSelfVerdict, 
  getAiSuggestedVerdict, 
  getUserIntegrityScore, 
  analyzeContent,
  generateFlameSignatureHash
} from './integrityService';

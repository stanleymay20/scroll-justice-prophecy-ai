
// Re-export all functions from the new modular services
export { 
  getEvidenceForPetition,
  uploadEvidence,
  deleteEvidence
} from './evidence/evidenceQueries';

export {
  getEvidencePublicUrl,
  ensureEvidenceBucketExists
} from './evidence/storageUtils';

export {
  uploadAudioVerdict,
  hasAudioVerdict
} from './evidence/verdictAudio';


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
  saveAudioVerdict,
  hasAudioVerdict
} from './evidence/verdictAudio';

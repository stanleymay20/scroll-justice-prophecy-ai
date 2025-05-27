
export interface Jurisdiction {
  id: string;
  code: string;
  name: string;
  country: string;
  region?: string;
  legal_system?: string;
  languages?: string[];
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  legal_basis?: string;
  jurisdiction_id?: string;
  created_at?: string;
}

export interface ScrollPetition {
  id: string;
  title: string;
  description: string;
  petitioner_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  assigned_judge_id?: string;
  verdict_timestamp?: string;
  is_sealed: boolean;
  scroll_integrity_score?: number;
  verdict?: string;
  verdict_reasoning?: string;
  ai_suggested_verdict?: string;
  audio_verdict_url?: string;
  verdict_transcription?: string;
  flame_signature_hash?: string;
  scroll_seal_timestamp?: string;
  category?: 'Wage Theft' | 'Land Injustice' | 'Violence' | 'False Judgment';
}

export interface ScrollJudgment {
  id: string;
  petition_id: string;
  verdict: string;
  reasoning: string;
  legal_citations: string[];
  compensation_amount?: number;
  currency: string;
  language: string;
  ai_confidence: number;
  judge_id?: string;
  created_at: string;
  sealed_at?: string;
  is_public: boolean;
}

export interface ScrollEvidence {
  id: string;
  petition_id: string;
  uploaded_by: string;
  uploaded_at: string;
  is_sealed: boolean;
  file_path: string;
  file_type?: string;
  description?: string;
}

export interface ScrollIntegrityLog {
  id: string;
  user_id?: string;
  petition_id?: string;
  action_type: string;
  integrity_impact: number;
  description?: string;
  created_at: string;
}

export interface LegalCitation {
  code: string;
  section: string;
  description: string;
  category: string;
  jurisdiction: string;
}

// Speech Recognition types
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

export interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  serviceURI: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onstart: (event: Event) => void;
  onend: (event: Event) => void;
}

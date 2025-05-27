
// Core application types
export type UserRole = 'petitioner' | 'advocate' | 'scroll_judge' | 'prophet' | 'admin';

export type PetitionStatus = 'draft' | 'filed' | 'under_review' | 'judged' | 'sealed' | 'archived';

export type InjusticeCategory = 
  | 'employment' 
  | 'housing' 
  | 'healthcare' 
  | 'education' 
  | 'financial' 
  | 'discrimination' 
  | 'government' 
  | 'consumer' 
  | 'family' 
  | 'criminal';

export interface ScrollPetition {
  id: string;
  title: string;
  description: string;
  category: InjusticeCategory;
  country: string;
  region: string;
  status: PetitionStatus;
  petitioner_id: string;
  created_at: string;
  updated_at: string;
  verdict?: string;
  verdict_reasoning?: string;
  compensation_amount?: number;
  ai_confidence_score: number;
  is_simulation: boolean;
  is_public: boolean;
  language: string;
  audio_verdict_url?: string;
  assigned_judge_id?: string;
  verdict_timestamp?: string;
  ai_suggested_verdict?: string;
  is_sealed: boolean;
  scroll_integrity_score: number;
}

export interface VerdictDocument {
  id: string;
  petition_id: string;
  verdict_text: string;
  legal_citations: string[];
  compensation: number;
  actions_required: string[];
  pdf_url?: string;
  created_at: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  max_petitions: number;
  priority_support: boolean;
}

// Updated ScrollPhase to match actual usage
export type ScrollPhase = 'DAWN' | 'RISE' | 'ASCEND';

// Updated ScrollGate to use numbers instead of strings  
export type ScrollGate = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Case {
  id: string;
  case_id: string;
  title: string;
  status: PetitionStatus;
  created_at: string;
  updated_at: string;
  jurisdiction: string;
  category: InjusticeCategory;
  principle: string;
  scroll_alignment: string;
  confidence: number;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  activeUsers: number;
  systemLoad: number;
  lastUpdate: string;
  overall: number;
  delta: number;
  cases_analyzed: number;
  precedent_accuracy: number;
  jurisdictional_coverage: number;
}

export interface TrainingParameters {
  name: string;
  jurisdictions: string[];
  legalFrameworks: LegalFrameworkFocus[];
  accuracy_threshold: number;
  bias_detection: boolean;
  multilingual: boolean;
  legal_framework_focus: LegalFrameworkFocus[];
  case_count: number;
  language_weighting: Record<string, number>;
  epochs: number;
  learning_rate: number;
  human_rights_emphasis: boolean;
  balance_jurisdictions: boolean;
  include_scroll_alignment: boolean;
}

export interface LegalFrameworkFocus {
  id: string;
  name: string;
  weight: number;
  enabled: boolean;
}

export interface Jurisdiction {
  id: string;
  code: string;
  name: string;
  country: string;
  region: string;
  legal_system: string;
  supported: boolean;
}

export interface ModelTrainingStatus {
  id: string;
  status: 'pending' | 'training' | 'completed' | 'failed';
  progress: number;
  started_at: string;
  completed_at?: string;
  accuracy: number;
  model_version: string;
}

export interface GlobalLegalMetrics {
  total_cases: number;
  success_rate: number;
  avg_resolution_time: number;
  jurisdictions_covered: number;
  active_judges: number;
}

export interface Principle {
  id: string;
  name: string;
  description: string;
  strength: number;
  evolution_date: string;
  jurisdiction: string;
}

export interface ScrollMemory {
  id: string;
  phase: ScrollPhase;
  gate: ScrollGate;
  timestamp: string;
  event_type: string;
  description: string;
  metadata: Record<string, any>;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphNode {
  id: string;
  label: string;
  phase: ScrollPhase;
  strength: PrincipleStrength;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
}

export type PrincipleStrength = 'weak' | 'moderate' | 'strong' | 'absolute';

// AI Verdict Response Interface
export interface AIVerdictResponse {
  suggested_verdict: string;
  reasoning: string;
  confidence_score: number;
  legal_citations?: string[];
  jurisdiction_basis?: string;
}

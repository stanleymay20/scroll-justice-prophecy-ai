// FastTrackJusticeAI Types

export type ScrollPhase = 'DAWN' | 'RISE' | 'ASCEND';

export type ScrollGate = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type PrincipleStrength = 'strong' | 'medium' | 'weak';

export type LegalSystemType = 
  'common_law' | 
  'civil_law' | 
  'religious_law' | 
  'customary_law' | 
  'mixed' | 
  'international_law' | 
  'humanitarian_law' | 
  'un_charter' | 
  'treaty_based' | 
  'icc_rome_statute';

export interface Jurisdiction {
  id: string;
  name: string;
  code: string;
  region: string;
  legal_system: LegalSystemType;
  precedent_weight: number;
  active: boolean;
  cases_count?: number;
  principles_count?: number;
  international_relevance?: number;
  un_recognized?: boolean;
  icc_jurisdiction?: boolean;
  language_codes?: string[];
}

export interface Case {
  case_id: string;
  title: string;
  principle: string;
  scroll_alignment: string;
  confidence: number;
  jurisdiction?: string;
  year?: number;
  description?: string;
}

export interface Principle {
  id: string;
  name: string;
  strength: PrincipleStrength;
  description: string;
  cases: string[];
  evolution?: PrincipleEvolution[];
}

export interface PrincipleEvolution {
  year: number;
  description: string;
  case_id?: string;
  impact_score: number;
}

export interface ScrollMemory {
  trail_id: string;
  case_ids: string[];
  principles: string[];
  scroll_phase: ScrollPhase;
  gate: ScrollGate;
  prophetic_insight: string;
  confidence: number;
}

export interface SystemHealth {
  overall: number;
  delta: number;
  cases_analyzed: number;
  precedent_accuracy: number;
  jurisdictional_coverage: number;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'case' | 'principle';
  strength?: PrincipleStrength;
  phase?: ScrollPhase;
}

export interface GraphLink {
  source: string;
  target: string;
  value: number;
}

export interface Graph {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface ModelTrainingStatus {
  model_id: string;
  name: string;
  progress: number;
  status: 'idle' | 'training' | 'completed' | 'failed';
  jurisdiction_coverage: string[];
  accuracy: number;
  cases_analyzed: number;
  training_started?: Date;
  training_completed?: Date;
  error?: string;
  international_compliance?: number;
  un_compliance?: number;
  icc_compliance?: number;
  languages_supported?: string[];
  legal_frameworks?: string[];
}

export interface TrainingParameters {
  jurisdictions: string[];
  principles: string[];
  case_count: number;
  epochs: number;
  learning_rate: number;
  balance_jurisdictions: boolean;
  include_scroll_alignment: boolean;
  include_international_law?: boolean;
  language_weighting?: Record<string, number>;
  legal_framework_focus?: LegalFrameworkFocus[];
  un_charter_compliance?: boolean;
  icc_rome_statute_compliance?: boolean;
  human_rights_emphasis?: number;
}

export interface LegalFrameworkFocus {
  name: string;
  weight: number;
  description: string;
}

export interface GlobalLegalMetrics {
  jurisdiction_count: number;
  case_coverage_percentage: number;
  principle_universality_score: number;
  language_diversity: number;
  international_alignment: number;
  human_rights_compliance: number;
}

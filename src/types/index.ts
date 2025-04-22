
// FastTrackJusticeAI Types

export type ScrollPhase = 'DAWN' | 'RISE' | 'ASCEND';

export type ScrollGate = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type PrincipleStrength = 'strong' | 'medium' | 'weak';

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

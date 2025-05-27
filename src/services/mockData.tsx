
import { SystemHealth, ScrollMemory, Jurisdiction, ModelTrainingStatus, GlobalLegalMetrics } from "@/types";

export const systemHealth: SystemHealth = {
  status: 'healthy',
  uptime: 99.8,
  activeUsers: 1250,
  systemLoad: 45,
  lastUpdate: new Date().toISOString(),
  overall: 96.5,
  delta: 2.3,
  cases_analyzed: 1250,
  precedent_accuracy: 94.2,
  jurisdictional_coverage: 89.7
};

export const scrollMemories: ScrollMemory[] = [
  {
    id: '1',
    phase: 'DAWN',
    scroll_phase: 'DAWN',
    gate: 3,
    timestamp: '2024-01-15T10:00:00Z',
    event_type: 'CASE_JUDGEMENT',
    description: 'Sacred principle established in employment law case',
    metadata: { caseId: 'case-001' },
    case_ids: ['case-001', 'case-002'],
    principles: ['Due Process', 'Equal Treatment'],
    prophetic_insight: 'This case sets precedent for future employment disputes',
    confidence: 92
  }
];

export const jurisdictions: Jurisdiction[] = [
  {
    id: '1',
    code: 'US',
    name: 'United States',
    country: 'United States',
    region: 'North America',
    legal_system: 'Common Law',
    supported: true,
    precedent_weight: 85,
    international_relevance: 92,
    un_recognized: true,
    icc_jurisdiction: false,
    active: true,
    cases_count: 1250,
    principles_count: 45,
    language_codes: ['en']
  },
  {
    id: '2',
    code: 'DE',
    name: 'Germany',
    country: 'Germany',
    region: 'Europe',
    legal_system: 'Civil Law',
    supported: true,
    precedent_weight: 78,
    international_relevance: 88,
    un_recognized: true,
    icc_jurisdiction: true,
    active: true,
    cases_count: 892,
    principles_count: 38,
    language_codes: ['de']
  },
  {
    id: '3',
    code: 'FR',
    name: 'France',
    country: 'France',
    region: 'Europe',
    legal_system: 'Civil Law',
    supported: true,
    precedent_weight: 82,
    international_relevance: 90,
    un_recognized: true,
    icc_jurisdiction: true,
    active: true,
    cases_count: 734,
    principles_count: 42,
    language_codes: ['fr']
  }
];

export const trainingModels: ModelTrainingStatus[] = [
  {
    id: '1',
    model_id: 'model-001',
    name: 'Global Justice AI v2.1',
    status: 'completed',
    progress: 100,
    started_at: '2024-01-10T08:00:00Z',
    completed_at: '2024-01-12T16:30:00Z',
    accuracy: 94.2,
    model_version: 'v2.1.0',
    cases_analyzed: 50000,
    international_compliance: 92.5,
    un_compliance: 96.1,
    icc_compliance: 89.3,
    jurisdiction_coverage: ['US', 'DE', 'FR', 'UK', 'CA'],
    languages_supported: ['en', 'de', 'fr', 'es']
  },
  {
    id: '2',
    model_id: 'model-002',
    name: 'Constitutional Rights Specialist',
    status: 'training',
    progress: 67,
    started_at: '2024-01-14T09:00:00Z',
    accuracy: 87.8,
    model_version: 'v1.3.0',
    cases_analyzed: 25000,
    international_compliance: 89.2,
    jurisdiction_coverage: ['US', 'CA', 'AU'],
    languages_supported: ['en']
  }
];

export const globalLegalMetrics: GlobalLegalMetrics = {
  total_cases: 15420,
  success_rate: 87.3,
  avg_resolution_time: 4.2,
  jurisdictions_covered: 47,
  jurisdiction_count: 47,
  active_judges: 238,
  case_coverage_percentage: 78.5,
  principle_universality_score: 92.1,
  language_diversity: 85.4,
  international_alignment: 89.7,
  human_rights_compliance: 94.2
};

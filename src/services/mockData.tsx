import { 
  Case, 
  ScrollMemory, 
  SystemHealth,
  PrincipleStrength
} from "@/types";

export const cases: Case[] = [
  {
    id: '1',
    case_id: 'case-001',
    title: 'Employment Discrimination Case',
    status: 'judged',
    created_at: '2024-01-01T12:00:00Z',
    updated_at: '2024-01-15T14:30:00Z',
    jurisdiction: 'US',
    category: 'employment',
    principle: 'Due Process',
    scroll_alignment: 'DAWN',
    confidence: 0.85
  },
  {
    id: '2',
    case_id: 'case-002',
    title: 'Housing Discrimination Lawsuit',
    status: 'under_review',
    created_at: '2024-01-05T09:00:00Z',
    updated_at: '2024-01-10T11:00:00Z',
    jurisdiction: 'CA',
    category: 'housing',
    principle: 'Equal Protection',
    scroll_alignment: 'RISE',
    confidence: 0.78
  },
  {
    id: '3',
    case_id: 'case-003',
    title: 'Healthcare Access Dispute',
    status: 'filed',
    created_at: '2024-01-10T15:00:00Z',
    updated_at: '2024-01-12T16:00:00Z',
    jurisdiction: 'EU',
    category: 'healthcare',
    principle: 'Human Dignity',
    scroll_alignment: 'ASCEND',
    confidence: 0.92
  },
  {
    id: '4',
    case_id: 'case-004',
    title: 'Education Funding Inequity',
    status: 'draft',
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    jurisdiction: 'UK',
    category: 'education',
    principle: 'Civil Rights',
    scroll_alignment: 'DAWN',
    confidence: 0.65
  },
  {
    id: '5',
    case_id: 'case-005',
    title: 'Financial Fraud Allegations',
    status: 'judged',
    created_at: '2024-01-20T11:00:00Z',
    updated_at: '2024-01-25T13:00:00Z',
    jurisdiction: 'Global',
    category: 'financial',
    principle: 'Transparency',
    scroll_alignment: 'RISE',
    confidence: 0.88
  },
  {
    id: '6',
    case_id: 'case-006',
    title: 'Consumer Rights Violation',
    status: 'under_review',
    created_at: '2024-01-25T14:00:00Z',
    updated_at: '2024-01-28T16:00:00Z',
    jurisdiction: 'AU',
    category: 'consumer',
    principle: 'Fairness',
    scroll_alignment: 'ASCEND',
    confidence: 0.72
  },
  {
    id: '7',
    case_id: 'case-007',
    title: 'Family Law Custody Battle',
    status: 'filed',
    created_at: '2024-01-30T09:00:00Z',
    updated_at: '2024-02-01T10:00:00Z',
    jurisdiction: 'US',
    category: 'family',
    principle: 'Child Welfare',
    scroll_alignment: 'DAWN',
    confidence: 0.95
  },
  {
    id: '8',
    case_id: 'case-008',
    title: 'Criminal Justice Reform Case',
    status: 'draft',
    created_at: '2024-02-05T16:00:00Z',
    updated_at: '2024-02-05T18:00:00Z',
    jurisdiction: 'CA',
    category: 'criminal',
    principle: 'Rehabilitation',
    scroll_alignment: 'RISE',
    confidence: 0.79
  },
  {
    id: '9',
    case_id: 'case-009',
    title: 'Government Transparency Lawsuit',
    status: 'judged',
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-02-15T12:00:00Z',
    jurisdiction: 'EU',
    category: 'government',
    principle: 'Accountability',
    scroll_alignment: 'ASCEND',
    confidence: 0.82
  },
  {
    id: '10',
    case_id: 'case-010',
    title: 'Discrimination in AI Algorithms',
    status: 'under_review',
    created_at: '2024-02-15T14:00:00Z',
    updated_at: '2024-02-18T15:00:00Z',
    jurisdiction: 'Global',
    category: 'discrimination',
    principle: 'Fairness',
    scroll_alignment: 'DAWN',
    confidence: 0.91
  }
];

export const scrollMemories: ScrollMemory[] = [
  {
    id: '1',
    trail_id: 'trail-001',
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
    confidence: 0.92
  },
  {
    id: '2',
    trail_id: 'trail-002',
    phase: 'RISE',
    scroll_phase: 'RISE',
    gate: 5,
    timestamp: '2024-01-16T14:30:00Z',
    event_type: 'PRINCIPLE_EVOLUTION',
    description: 'Constitutional principle evolved through international case',
    metadata: { jurisdiction: 'International' },
    case_ids: ['case-003'],
    principles: ['Constitutional Rights'],
    prophetic_insight: 'Global alignment strengthens constitutional framework',
    confidence: 0.88
  },
  {
    id: '3',
    trail_id: 'trail-003',
    phase: 'ASCEND',
    scroll_phase: 'ASCEND',
    gate: 7,
    timestamp: '2024-01-17T08:00:00Z',
    event_type: 'SYSTEM_UPDATE',
    description: 'System updated to enhance AI accuracy',
    metadata: { version: 'v2.0' },
    case_ids: ['case-004', 'case-005'],
    principles: ['Transparency', 'Accountability'],
    prophetic_insight: 'Enhanced AI accuracy will lead to fairer judgements',
    confidence: 0.95
  },
  {
    id: '4',
    trail_id: 'trail-004',
    phase: 'DAWN',
    scroll_phase: 'DAWN',
    gate: 2,
    timestamp: '2024-01-18T16:00:00Z',
    event_type: 'NEW_LEGISLATION',
    description: 'New legislation introduced to protect consumer rights',
    metadata: { legislationId: 'leg-001' },
    case_ids: ['case-006'],
    principles: ['Fairness'],
    prophetic_insight: 'Consumer rights will be better protected',
    confidence: 0.78
  },
  {
    id: '5',
    trail_id: 'trail-005',
    phase: 'RISE',
    scroll_phase: 'RISE',
    gate: 4,
    timestamp: '2024-01-19T11:00:00Z',
    event_type: 'JUDICIAL_APPOINTMENT',
    description: 'New judge appointed to family law court',
    metadata: { judgeId: 'judge-001' },
    case_ids: ['case-007'],
    principles: ['Child Welfare'],
    prophetic_insight: 'Family law cases will be handled with greater care',
    confidence: 0.85
  },
  {
    id: '6',
    trail_id: 'trail-006',
    phase: 'ASCEND',
    scroll_phase: 'ASCEND',
    gate: 6,
    timestamp: '2024-01-20T09:30:00Z',
    event_type: 'POLICY_CHANGE',
    description: 'Policy change to promote rehabilitation in criminal justice',
    metadata: { policyId: 'pol-001' },
    case_ids: ['case-008'],
    principles: ['Rehabilitation'],
    prophetic_insight: 'Criminal justice system will focus more on rehabilitation',
    confidence: 0.91
  },
  {
    id: '7',
    trail_id: 'trail-007',
    phase: 'DAWN',
    scroll_phase: 'DAWN',
    gate: 1,
    timestamp: '2024-01-21T13:00:00Z',
    event_type: 'PUBLIC_PROTEST',
    description: 'Public protest against government corruption',
    metadata: { protestId: 'pro-001' },
    case_ids: ['case-009'],
    principles: ['Accountability'],
    prophetic_insight: 'Government will be held more accountable',
    confidence: 0.80
  },
  {
    id: '8',
    trail_id: 'trail-008',
    phase: 'RISE',
    scroll_phase: 'RISE',
    gate: 3,
    timestamp: '2024-01-22T17:00:00Z',
    event_type: 'AI_BIAS_DETECTED',
    description: 'AI bias detected in algorithm used in discrimination cases',
    metadata: { algorithmId: 'ai-001' },
    case_ids: ['case-010'],
    principles: ['Fairness'],
    prophetic_insight: 'AI algorithms will be audited for bias',
    confidence: 0.87
  }
];

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

export const principles = [
  {
    id: '1',
    name: 'Due Process',
    description: 'Right to fair legal proceedings',
    strength: 'strong' as const,
    evolution_date: '2024-01-15',
    jurisdiction: 'Global',
    evolution: [
      { date: '2024-01-01', strength: 90, event: 'Initial assessment' },
      { date: '2024-01-15', strength: 95, event: 'Reinforcement through cases' }
    ]
  },
  {
    id: '2',
    name: 'Equal Protection',
    description: 'Equal treatment under law',
    strength: 'strong' as const,
    evolution_date: '2024-01-10',
    jurisdiction: 'Constitutional',
    evolution: [
      { date: '2024-01-01', strength: 85, event: 'Baseline establishment' },
      { date: '2024-01-10', strength: 88, event: 'Case law evolution' }
    ]
  },
  {
    id: '3',
    name: 'Right to Privacy',
    description: 'Protection of personal information',
    strength: 'medium' as const,
    evolution_date: '2024-01-12',
    jurisdiction: 'Digital Rights',
    evolution: [
      { date: '2024-01-01', strength: 70, event: 'Digital privacy concerns' },
      { date: '2024-01-12', strength: 75, event: 'Enhanced protections' }
    ]
  },
  {
    id: '4',
    name: 'Freedom of Expression',
    description: 'Right to free speech and expression',
    strength: 'medium' as const,
    evolution_date: '2024-01-08',
    jurisdiction: 'Constitutional',
    evolution: [
      { date: '2024-01-01', strength: 65, event: 'Baseline rights' },
      { date: '2024-01-08', strength: 68, event: 'Platform regulation' }
    ]
  },
  {
    id: '5',
    name: 'Access to Justice',
    description: 'Equal access to legal remedies',
    strength: 'weak' as const,
    evolution_date: '2024-01-05',
    jurisdiction: 'Procedural',
    evolution: [
      { date: '2024-01-01', strength: 45, event: 'Access barriers identified' },
      { date: '2024-01-05', strength: 48, event: 'Minor improvements' }
    ]
  }
];

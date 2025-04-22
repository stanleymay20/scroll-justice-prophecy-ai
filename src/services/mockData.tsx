
import { Case, Principle, ScrollMemory, SystemHealth, Graph, ScrollPhase, ScrollGate, PrincipleStrength } from '@/types';

// Mock Cases
export const cases: Case[] = [
  {
    case_id: "CASE-2023-001",
    title: "Brown v. Board of Education",
    principle: "Equal Protection",
    scroll_alignment: "Prophetic equality mandate",
    confidence: 0.95,
    jurisdiction: "United States",
    year: 1954,
    description: "Landmark decision that declared segregation in public schools unconstitutional."
  },
  {
    case_id: "CASE-2023-002",
    title: "Roe v. Wade",
    principle: "Right to Privacy",
    scroll_alignment: "Personal autonomy principle",
    confidence: 0.87,
    jurisdiction: "United States",
    year: 1973,
    description: "Recognized a woman's constitutional right to abortion."
  },
  {
    case_id: "CASE-2023-003",
    title: "Obergefell v. Hodges",
    principle: "Equal Protection",
    scroll_alignment: "Universal love mandate",
    confidence: 0.92,
    jurisdiction: "United States",
    year: 2015,
    description: "Guaranteed the right to same-sex marriage across the United States."
  },
  {
    case_id: "CASE-2023-004", 
    title: "R v. Morgentaler",
    principle: "Dignity and Autonomy",
    scroll_alignment: "Physical sovereignty doctrine",
    confidence: 0.89,
    jurisdiction: "Canada",
    year: 1988,
    description: "Struck down Canada's abortion law as unconstitutional."
  },
  {
    case_id: "CASE-2023-005",
    title: "S v. Makwanyane",
    principle: "Right to Life",
    scroll_alignment: "Divine redemption principle",
    confidence: 0.94,
    jurisdiction: "South Africa",
    year: 1995,
    description: "Abolished the death penalty in South Africa."
  }
];

// Mock Principles
export const principles: Principle[] = [
  {
    id: "PRIN-001",
    name: "Equal Protection",
    strength: "strong",
    description: "The principle that laws must treat individuals in the same manner.",
    cases: ["CASE-2023-001", "CASE-2023-003"],
    evolution: [
      {
        year: 1954,
        description: "Established in education contexts",
        case_id: "CASE-2023-001",
        impact_score: 9.5
      },
      {
        year: 2015,
        description: "Extended to marriage equality",
        case_id: "CASE-2023-003",
        impact_score: 8.7
      }
    ]
  },
  {
    id: "PRIN-002",
    name: "Right to Privacy",
    strength: "medium",
    description: "The right to be free from unreasonable intrusion into one's personal life.",
    cases: ["CASE-2023-002"],
    evolution: [
      {
        year: 1973,
        description: "Applied to reproductive decisions",
        case_id: "CASE-2023-002",
        impact_score: 8.2
      }
    ]
  },
  {
    id: "PRIN-003",
    name: "Dignity and Autonomy",
    strength: "strong",
    description: "The right to make personal decisions about one's own life without interference.",
    cases: ["CASE-2023-004"],
    evolution: [
      {
        year: 1988,
        description: "Applied to medical decisions",
        case_id: "CASE-2023-004",
        impact_score: 7.9
      }
    ]
  },
  {
    id: "PRIN-004",
    name: "Right to Life",
    strength: "medium",
    description: "The fundamental right to not be killed by the government.",
    cases: ["CASE-2023-005"],
    evolution: [
      {
        year: 1995,
        description: "Applied to abolish death penalty",
        case_id: "CASE-2023-005",
        impact_score: 9.0
      }
    ]
  },
  {
    id: "PRIN-005",
    name: "Freedom of Speech",
    strength: "weak",
    description: "The right to express opinions without government restraint.",
    cases: [],
    evolution: []
  }
];

// Mock Scroll Memories
export const scrollMemories: ScrollMemory[] = [
  {
    trail_id: "TRAIL-001",
    case_ids: ["CASE-2023-001", "CASE-2023-003"],
    principles: ["Equal Protection"],
    scroll_phase: "DAWN",
    gate: 3,
    prophetic_insight: "The equality mandate extends beyond human perception into divine recognition of essence.",
    confidence: 0.91
  },
  {
    trail_id: "TRAIL-002",
    case_ids: ["CASE-2023-002", "CASE-2023-004"],
    principles: ["Right to Privacy", "Dignity and Autonomy"],
    scroll_phase: "RISE",
    gate: 5,
    prophetic_insight: "Bodily sovereignty reflects the higher principle of divine endowment of free will.",
    confidence: 0.85
  },
  {
    trail_id: "TRAIL-003",
    case_ids: ["CASE-2023-005"],
    principles: ["Right to Life"],
    scroll_phase: "ASCEND",
    gate: 7,
    prophetic_insight: "The sanctity of life mirrors the eternal nature of soul consciousness.",
    confidence: 0.96
  }
];

// Mock System Health
export const systemHealth: SystemHealth = {
  overall: 92.7,
  delta: 1.3,
  cases_analyzed: 10568,
  precedent_accuracy: 94.2,
  jurisdictional_coverage: 87.5
};

// Mock Graph Data
export const graphData: Graph = {
  nodes: [
    { id: "CASE-2023-001", label: "Brown v. Board of Education", type: "case", phase: "DAWN" },
    { id: "CASE-2023-002", label: "Roe v. Wade", type: "case", phase: "RISE" },
    { id: "CASE-2023-003", label: "Obergefell v. Hodges", type: "case", phase: "DAWN" },
    { id: "CASE-2023-004", label: "R v. Morgentaler", type: "case", phase: "RISE" },
    { id: "CASE-2023-005", label: "S v. Makwanyane", type: "case", phase: "ASCEND" },
    { id: "PRIN-001", label: "Equal Protection", type: "principle", strength: "strong" },
    { id: "PRIN-002", label: "Right to Privacy", type: "principle", strength: "medium" },
    { id: "PRIN-003", label: "Dignity and Autonomy", type: "principle", strength: "strong" },
    { id: "PRIN-004", label: "Right to Life", type: "principle", strength: "medium" },
    { id: "PRIN-005", label: "Freedom of Speech", type: "principle", strength: "weak" }
  ],
  links: [
    { source: "PRIN-001", target: "CASE-2023-001", value: 0.95 },
    { source: "PRIN-001", target: "CASE-2023-003", value: 0.92 },
    { source: "PRIN-002", target: "CASE-2023-002", value: 0.87 },
    { source: "PRIN-003", target: "CASE-2023-004", value: 0.89 },
    { source: "PRIN-004", target: "CASE-2023-005", value: 0.94 },
    { source: "CASE-2023-001", target: "CASE-2023-003", value: 0.75 }
  ]
};

// Helper function to get scroll phase color
export const getScrollPhaseColor = (phase: ScrollPhase): string => {
  switch (phase) {
    case 'DAWN': return '#1EAEDB'; // Blue
    case 'RISE': return '#FEC6A1'; // Gold
    case 'ASCEND': return '#FFFFFF'; // White
    default: return '#1EAEDB';
  }
};

// Helper function to get principle strength color
export const getPrincipleStrengthColor = (strength: PrincipleStrength): string => {
  switch (strength) {
    case 'strong': return '#F2FCE2'; // Green
    case 'medium': return '#FEF7CD'; // Yellow
    case 'weak': return '#ea384c'; // Red
    default: return '#F2FCE2';
  }
};

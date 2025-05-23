import { Case, Principle, ScrollMemory, SystemHealth, Graph, ScrollPhase, ScrollGate, PrincipleStrength, Jurisdiction, ModelTrainingStatus, GlobalLegalMetrics } from '@/types';

// Mock Jurisdictions with expanded international coverage
export const jurisdictions: Jurisdiction[] = [
  {
    id: "JUR-001",
    name: "United States",
    code: "US",
    region: "North America",
    legal_system: "common_law",
    precedent_weight: 0.92,
    active: true,
    cases_count: 5243,
    principles_count: 87,
    international_relevance: 9.4,
    un_recognized: true,
    icc_jurisdiction: false,
    language_codes: ["en"]
  },
  {
    id: "JUR-002",
    name: "Canada",
    code: "CA",
    region: "North America",
    legal_system: "common_law",
    precedent_weight: 0.89,
    active: true,
    cases_count: 2147,
    principles_count: 64,
    international_relevance: 8.7,
    un_recognized: true,
    icc_jurisdiction: true,
    language_codes: ["en", "fr"]
  },
  {
    id: "JUR-003",
    name: "United Kingdom",
    code: "UK",
    region: "Europe",
    legal_system: "common_law",
    precedent_weight: 0.95,
    active: true,
    cases_count: 4892,
    principles_count: 92,
    international_relevance: 9.2,
    un_recognized: true,
    icc_jurisdiction: true,
    language_codes: ["en"]
  },
  {
    id: "JUR-004",
    name: "France",
    code: "FR",
    region: "Europe",
    legal_system: "civil_law",
    precedent_weight: 0.75,
    active: true,
    cases_count: 3211,
    principles_count: 76,
    international_relevance: 9.0,
    un_recognized: true,
    icc_jurisdiction: true,
    language_codes: ["fr"]
  },
  {
    id: "JUR-005",
    name: "Germany",
    code: "DE",
    region: "Europe",
    legal_system: "civil_law",
    precedent_weight: 0.78,
    active: true,
    cases_count: 3678,
    principles_count: 81,
    international_relevance: 8.8,
    un_recognized: true,
    icc_jurisdiction: true,
    language_codes: ["de"]
  },
  // International and regional bodies
  {
    id: "JUR-013",
    name: "United Nations",
    code: "UN",
    region: "International",
    legal_system: "international_law",
    precedent_weight: 0.98,
    active: true,
    cases_count: 4732,
    principles_count: 124,
    international_relevance: 10.0,
    un_recognized: true,
    icc_jurisdiction: false,
    language_codes: ["en", "fr", "es", "ru", "zh", "ar"]
  },
  {
    id: "JUR-014",
    name: "International Criminal Court",
    code: "ICC",
    region: "International",
    legal_system: "icc_rome_statute",
    precedent_weight: 0.96,
    active: true,
    cases_count: 1245,
    principles_count: 78,
    international_relevance: 9.8,
    un_recognized: true,
    icc_jurisdiction: true,
    language_codes: ["en", "fr"]
  },
  {
    id: "JUR-015",
    name: "European Court of Human Rights",
    code: "ECHR",
    region: "Europe",
    legal_system: "treaty_based",
    precedent_weight: 0.93,
    active: true,
    cases_count: 3867,
    principles_count: 94,
    international_relevance: 9.5,
    un_recognized: true,
    icc_jurisdiction: false,
    language_codes: ["en", "fr"]
  },
  {
    id: "JUR-016",
    name: "African Union",
    code: "AU",
    region: "Africa",
    legal_system: "treaty_based",
    precedent_weight: 0.85,
    active: true,
    cases_count: 1456,
    principles_count: 67,
    international_relevance: 8.7,
    un_recognized: true,
    icc_jurisdiction: false,
    language_codes: ["en", "fr", "ar", "pt"]
  },
  {
    id: "JUR-006",
    name: "South Africa",
    code: "ZA",
    region: "Africa",
    legal_system: "mixed",
    precedent_weight: 0.82,
    active: true,
    cases_count: 1256,
    principles_count: 47,
    international_relevance: 7.9,
    un_recognized: true,
    icc_jurisdiction: true,
    language_codes: ["en", "af"]
  },
  {
    id: "JUR-007",
    name: "India",
    code: "IN",
    region: "Asia",
    legal_system: "common_law",
    precedent_weight: 0.87,
    active: true,
    cases_count: 2876,
    principles_count: 73,
    international_relevance: 8.4,
    un_recognized: true,
    icc_jurisdiction: false,
    language_codes: ["en", "hi"]
  },
  {
    id: "JUR-008",
    name: "Japan",
    code: "JP",
    region: "Asia",
    legal_system: "civil_law",
    precedent_weight: 0.74,
    active: true,
    cases_count: 2145,
    principles_count: 59,
    international_relevance: 8.2,
    un_recognized: true,
    icc_jurisdiction: true,
    language_codes: ["ja"]
  },
  {
    id: "JUR-009",
    name: "Australia",
    code: "AU",
    region: "Oceania",
    legal_system: "common_law",
    precedent_weight: 0.88,
    active: true,
    cases_count: 1967,
    principles_count: 68,
    international_relevance: 8.5,
    un_recognized: true,
    icc_jurisdiction: true,
    language_codes: ["en"]
  },
  {
    id: "JUR-010",
    name: "Brazil",
    code: "BR",
    region: "South America",
    legal_system: "civil_law",
    precedent_weight: 0.71,
    active: true,
    cases_count: 1876,
    principles_count: 52,
    international_relevance: 7.8,
    un_recognized: true,
    icc_jurisdiction: true,
    language_codes: ["pt"]
  },
  {
    id: "JUR-011",
    name: "Saudi Arabia",
    code: "SA",
    region: "Middle East",
    legal_system: "religious_law",
    precedent_weight: 0.68,
    active: true,
    cases_count: 912,
    principles_count: 42,
    international_relevance: 7.2,
    un_recognized: true,
    icc_jurisdiction: false,
    language_codes: ["ar"]
  },
  {
    id: "JUR-012",
    name: "Nigeria",
    code: "NG",
    region: "Africa",
    legal_system: "customary_law",
    precedent_weight: 0.65,
    active: true,
    cases_count: 746,
    principles_count: 38,
    international_relevance: 7.0,
    un_recognized: true,
    icc_jurisdiction: true,
    language_codes: ["en"]
  },
  // Additional jurisdictions from various regions
  {
    id: "JUR-017",
    name: "China",
    code: "CN",
    region: "Asia",
    legal_system: "civil_law",
    precedent_weight: 0.84,
    active: true,
    cases_count: 4356,
    principles_count: 82,
    international_relevance: 9.0,
    un_recognized: true,
    icc_jurisdiction: false,
    language_codes: ["zh"]
  },
  {
    id: "JUR-018",
    name: "Russia",
    code: "RU",
    region: "Europe",
    legal_system: "civil_law",
    precedent_weight: 0.80,
    active: true,
    cases_count: 2698,
    principles_count: 71,
    international_relevance: 8.5,
    un_recognized: true,
    icc_jurisdiction: false,
    language_codes: ["ru"]
  }
];

// Global Legal Metrics
export const globalLegalMetrics: GlobalLegalMetrics = {
  jurisdiction_count: jurisdictions.length,
  case_coverage_percentage: 74,
  principle_universality_score: 8.2,
  language_diversity: 12,
  international_alignment: 8.7,
  human_rights_compliance: 7.9
};

// Updated Model Training Status with international focus
export const trainingModels: ModelTrainingStatus[] = [
  {
    model_id: "MDL-001",
    name: "Global Precedent Model v2.3",
    progress: 100,
    status: "completed",
    jurisdiction_coverage: ["US", "UK", "CA", "AU", "IN"],
    accuracy: 0.93,
    cases_analyzed: 12567,
    training_started: new Date("2024-04-20T08:30:00"),
    training_completed: new Date("2024-04-20T14:45:00"),
    international_compliance: 0.87,
    un_compliance: 0.85,
    icc_compliance: 0.82,
    languages_supported: ["en"],
    legal_frameworks: ["Common Law"]
  },
  {
    model_id: "MDL-002",
    name: "Civil Law Integration Model",
    progress: 100,
    status: "completed",
    jurisdiction_coverage: ["FR", "DE", "JP", "BR"],
    accuracy: 0.87,
    cases_analyzed: 8965,
    training_started: new Date("2024-04-18T10:15:00"),
    training_completed: new Date("2024-04-18T17:20:00"),
    international_compliance: 0.82,
    un_compliance: 0.79,
    icc_compliance: 0.81,
    languages_supported: ["en", "fr", "de", "ja", "pt"],
    legal_frameworks: ["Civil Law", "Continental Law"]
  },
  {
    model_id: "MDL-003",
    name: "Mixed Systems Harmonization",
    progress: 68,
    status: "training",
    jurisdiction_coverage: ["ZA", "NG", "SA", "IN"],
    accuracy: 0.76,
    cases_analyzed: 4328,
    training_started: new Date("2024-04-23T09:45:00"),
    international_compliance: 0.74,
    un_compliance: 0.72,
    icc_compliance: 0.70,
    languages_supported: ["en", "af", "ar", "hi"],
    legal_frameworks: ["Mixed Systems", "Religious Law", "Customary Law"]
  },
  {
    model_id: "MDL-004",
    name: "UN Charter Compliance Model",
    progress: 100,
    status: "completed",
    jurisdiction_coverage: ["UN", "ICC", "ECHR", "AU"],
    accuracy: 0.94,
    cases_analyzed: 9872,
    training_started: new Date("2024-04-15T08:30:00"),
    training_completed: new Date("2024-04-17T12:45:00"),
    international_compliance: 0.97,
    un_compliance: 0.98,
    icc_compliance: 0.96,
    languages_supported: ["en", "fr", "es", "ru", "zh", "ar"],
    legal_frameworks: ["International Law", "UN Charter", "Treaty Law"]
  },
  {
    model_id: "MDL-005",
    name: "ICC Rome Statute Model",
    progress: 100,
    status: "completed",
    jurisdiction_coverage: ["ICC", "UN", "ECHR", "CA", "UK", "DE", "FR"],
    accuracy: 0.95,
    cases_analyzed: 7654,
    training_started: new Date("2024-04-10T10:00:00"),
    training_completed: new Date("2024-04-12T16:30:00"),
    international_compliance: 0.96,
    un_compliance: 0.94,
    icc_compliance: 0.98,
    languages_supported: ["en", "fr"],
    legal_frameworks: ["ICC Rome Statute", "International Criminal Law", "Humanitarian Law"]
  },
  {
    model_id: "MDL-006",
    name: "Universal Human Rights Model",
    progress: 0,
    status: "idle",
    jurisdiction_coverage: [],
    accuracy: 0,
    cases_analyzed: 0,
    international_compliance: 0,
    un_compliance: 0,
    icc_compliance: 0,
    languages_supported: [],
    legal_frameworks: ["Human Rights Law", "UDHR"]
  }
];

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
  },
  {
    case_id: "CASE-2023-006",
    title: "Entick v Carrington",
    principle: "Rule of Law",
    scroll_alignment: "Authority bounds doctrine",
    confidence: 0.91,
    jurisdiction: "United Kingdom",
    year: 1765,
    description: "Established the civil liberties of individuals and limited the scope of executive power."
  },
  {
    case_id: "CASE-2023-007",
    title: "Conseil constitutionnel Decision No. 71-44",
    principle: "Fundamental Rights",
    scroll_alignment: "Liberty essence framework",
    confidence: 0.86,
    jurisdiction: "France",
    year: 1971,
    description: "Expanded the bloc de constitutionnalité to include rights mentioned in the preamble."
  },
  {
    case_id: "CASE-2023-008",
    title: "BVerfGE 7, 198 (Lüth)",
    principle: "Freedom of Expression",
    scroll_alignment: "Truth channel directive",
    confidence: 0.88,
    jurisdiction: "Germany",
    year: 1958,
    description: "Established that basic rights influence private law, known as indirect horizontal effect."
  },
  {
    case_id: "CASE-2023-009",
    title: "Kesavananda Bharati v. State of Kerala",
    principle: "Basic Structure Doctrine",
    scroll_alignment: "Foundational immutability",
    confidence: 0.93,
    jurisdiction: "India",
    year: 1973,
    description: "Established that the basic structure of the constitution cannot be altered by amendments."
  },
  {
    case_id: "CASE-2023-010",
    title: "Tokyo High Court Saikō Saibansho",
    principle: "Article 9 Interpretation",
    scroll_alignment: "Peace divine command",
    confidence: 0.79,
    jurisdiction: "Japan",
    year: 2008,
    description: "Ruled on the interpretation of the constitutional prohibition of war."
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

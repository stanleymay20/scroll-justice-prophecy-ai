
export type ScrollTribunalCase = {
  id: string;
  nation: string;
  institution: string;
  crime_type: 'Colonialism' | 'Slavery' | 'Artifact Theft' | 'Economic Exploitation';
  summary: string;
  evidence: string[];
  verdict_id?: string;
  reparations_issued: boolean;
  created_at: string;
};

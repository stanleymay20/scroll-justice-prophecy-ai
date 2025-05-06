
export interface Petition {
  id: string;
  title: string;
  description: string;
  petitioner_id: string;
  created_at: string;
  updated_at: string;
  assigned_judge_id: string | null;
  status: "pending" | "in_review" | "verdict_delivered" | "sealed" | "rejected";
  verdict: string | null;
  verdict_reasoning: string | null;
  is_sealed: boolean;
  scroll_integrity_score: number;
  verdict_timestamp: string | null;
  ai_suggested_verdict: string | null;
}

export interface SealedPetition extends Petition {
  petitioner_username: string;
  judge_username: string | null;
  scroll_gate?: string;
}

export interface AudioVerdictPlayerProps {
  audioUrl: string;
  onComplete?: () => void;
}

export interface PetitionFormData {
  title: string;
  description: string;
}

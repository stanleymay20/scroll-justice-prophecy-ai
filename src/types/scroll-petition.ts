
export type PetitionStatus = "pending" | "in_review" | "verdict_delivered" | "sealed" | "rejected";

export interface ScrollPetition {
  id: string;
  title: string;
  description: string;
  petitioner_id: string;
  assigned_judge_id: string | null;
  status: PetitionStatus;
  created_at: string;
  updated_at: string | null;
  verdict: string | null;
  reasoning: string | null;
  is_sealed: boolean;
  scroll_integrity_score: number;
  ai_suggested_verdict: string | null;
}

export interface EnhancedScrollPetition extends ScrollPetition {
  petitionerName?: string;
  judgeName?: string;
  timeAgo?: string;
}

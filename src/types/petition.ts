
export type ScrollPetition = {
  id: string;
  title: string;
  description: string;
  petitioner_id: string;
  status: 'pending' | 'in_review' | 'verdict_delivered' | 'sealed' | 'rejected';
  created_at: string;
  updated_at: string;
  assigned_judge_id?: string;
  verdict?: string;
  verdict_reasoning?: string;
  verdict_timestamp?: string;
  ai_suggested_verdict?: string;
  is_sealed: boolean;
  scroll_integrity_score: number;
};

export type ScrollEvidence = {
  id: string;
  petition_id: string;
  file_path: string;
  file_type: string;
  uploaded_by: string;
  uploaded_at: string;
  description?: string;
  is_sealed: boolean;
};

export type UserRole = 'guest' | 'advocate' | 'seeker' | 'judge' | 'admin';

export type ScrollIntegrityLog = {
  id: string;
  user_id?: string;
  petition_id?: string;
  action_type: string;
  integrity_impact: number;
  description?: string;
  created_at: string;
};


// Core application types
export type UserRole = 'petitioner' | 'advocate' | 'scroll_judge' | 'prophet' | 'admin';

export type PetitionStatus = 'draft' | 'filed' | 'under_review' | 'judged' | 'sealed' | 'archived';

export type InjusticeCategory = 
  | 'employment' 
  | 'housing' 
  | 'healthcare' 
  | 'education' 
  | 'financial' 
  | 'discrimination' 
  | 'government' 
  | 'consumer' 
  | 'family' 
  | 'criminal';

export interface ScrollPetition {
  id: string;
  title: string;
  description: string;
  category: InjusticeCategory;
  country: string;
  region: string;
  status: PetitionStatus;
  petitioner_id: string;
  created_at: string;
  updated_at: string;
  verdict?: string;
  verdict_reasoning?: string;
  compensation_amount?: number;
  ai_confidence_score: number;
  is_simulation: boolean;
  is_public: boolean;
  language: string;
}

export interface VerdictDocument {
  id: string;
  petition_id: string;
  verdict_text: string;
  legal_citations: string[];
  compensation: number;
  actions_required: string[];
  pdf_url?: string;
  created_at: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  max_petitions: number;
  priority_support: boolean;
}

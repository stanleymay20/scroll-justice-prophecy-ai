
// Type definitions for Supabase database tables

// Define the types for the 'posts' table
export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  likes?: number;
  comments_count?: number;
}

// Define the types for the 'emergency_alerts' table
export interface EmergencyAlert {
  id: string;
  session_id: string;
  user_id: string;
  message: string;
  timestamp: string;
  resolved: boolean;
  resolution_notes?: string;
}

// Define the types for the 'scroll_witness_logs' table
export interface ScrollWitnessLog {
  id: string;
  session_id: string;
  user_id: string;
  action: string;
  details?: string;
  timestamp: string;
}

// Define the types for the 'court_sessions' table
export interface CourtSession {
  id: string;
  title: string;
  description?: string;
  status: string;
  created_by?: string;
  scheduled_start: string;
  scheduled_end: string;
  actual_start?: string;
  actual_end?: string;
  flame_integrity_score?: number;
  prayer_completed?: boolean;
  is_encrypted?: boolean;
  prayer_timestamp?: string;
}

// Define the types for the 'scroll_petitions' table
export interface ScrollPetition {
  id: string;
  title: string;
  description: string;
  petitioner_id: string;
  created_at: string;
  updated_at: string;
  status?: string;
  assigned_judge_id?: string;
  verdict?: string;
  verdict_reasoning?: string;
  verdict_timestamp?: string;
  ai_suggested_verdict?: string;
  is_sealed: boolean;
  scroll_integrity_score?: number;
}

// Define the types for the 'scroll_integrity_logs' table
export interface ScrollIntegrityLog {
  id: string;
  action_type: string;
  integrity_impact: number;
  user_id?: string;
  petition_id?: string;
  description?: string;
  created_at: string;
}

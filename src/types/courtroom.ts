
export type CourtSessionStatus = 
  | "scheduled" 
  | "in-progress" 
  | "completed" 
  | "cancelled";

export type CourtRole =
  | "judge"
  | "advocate"
  | "witness"
  | "steward"
  | "observer";

export type CourtSession = {
  id: string;
  title: string;
  description: string;
  status: CourtSessionStatus;
  scheduled_start: string;
  scheduled_end: string;
  actual_start?: string;
  actual_end?: string;
  created_by: string;
  participants: {
    user_id: string;
    role: CourtRole;
    oath_taken: boolean;
  }[];
  recording_url?: string;
  is_encrypted: boolean;
  prayer_completed: boolean;
  flame_integrity_score?: number;
  emergency_alerts?: {
    id: string;
    user_id: string;
    message: string;
    timestamp: string;
    resolved: boolean;
  }[];
};

export type OathStatus = "not_taken" | "pending" | "completed";

export type EmergencyAlert = {
  id: string;
  session_id: string;
  user_id: string;
  message: string;
  timestamp: string;
  resolved: boolean;
  resolution_notes?: string;
};

export type SessionRecording = {
  id: string;
  session_id: string;
  file_url: string;
  type: "audio" | "video" | "transcript";
  duration_seconds: number;
  created_at: string;
  encrypted: boolean;
  encryption_key?: string;
  access_log: {
    user_id: string;
    timestamp: string;
    action: "view" | "download" | "share";
  }[];
};

export type WitnessSummon = {
  id: string;
  session_id: string;
  invited_email: string;
  invited_by: string;
  invited_at: string;
  status: "pending" | "accepted" | "declined";
  role: CourtRole;
  token: string;
  expires_at: string;
};

export type FeedbackRating = 1 | 2 | 3 | 4 | 5;

export type SessionFeedback = {
  id: string;
  session_id: string;
  user_id: string;
  rating: FeedbackRating;
  testimony: string;
  created_at: string;
  is_anonymous: boolean;
};


import { Database } from "@/integrations/supabase/types";

// Type aliases for convenience when working with Supabase tables
// These are direct aliases to the auto-generated Database types

// Posts
export type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
export type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];

// Court Session Participants
export type CourtSessionParticipantInsert = Database["public"]["Tables"]["court_session_participants"]["Insert"];
export type CourtSessionParticipantUpdate = Database["public"]["Tables"]["court_session_participants"]["Update"];

// Scroll Witness Logs
export type ScrollWitnessLogInsert = Database["public"]["Tables"]["scroll_witness_logs"]["Insert"];

// Emergency Alerts
export type EmergencyAlertInsert = Database["public"]["Tables"]["emergency_alerts"]["Insert"];
export type EmergencyAlertUpdate = Database["public"]["Tables"]["emergency_alerts"]["Update"];

// Session Recordings
export type SessionRecordingInsert = Database["public"]["Tables"]["session_recordings"]["Insert"];
export type SessionRecordingUpdate = Database["public"]["Tables"]["session_recordings"]["Update"];

// Court Sessions
export type CourtSessionUpdate = Database["public"]["Tables"]["court_sessions"]["Update"];

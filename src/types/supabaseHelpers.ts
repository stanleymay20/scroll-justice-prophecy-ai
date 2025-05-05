
import { Database } from "@/integrations/supabase/types";

// Type helpers for Supabase table operations
export type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
export type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];

export type CourtSessionParticipantInsert = Database["public"]["Tables"]["court_session_participants"]["Insert"];
export type CourtSessionParticipantUpdate = Database["public"]["Tables"]["court_session_participants"]["Update"];

export type ScrollWitnessLogInsert = Database["public"]["Tables"]["scroll_witness_logs"]["Insert"];

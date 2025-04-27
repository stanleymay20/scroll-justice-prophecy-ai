
export type FlameIntegrityLevel = "pure" | "stable" | "wavering" | "compromised" | "critical";

export type OathValidationStatus = "upheld" | "questioned" | "violated";

export type MCPAlertType = 
  | "flame_integrity"
  | "oath_violation"
  | "emergency_mercy"
  | "solar_gate_misalignment"
  | "system_healing";

export type MCPAlert = {
  id: string;
  type: MCPAlertType;
  severity: "info" | "warning" | "error" | "critical";
  message: string;
  timestamp: string;
  session_id?: string;
  user_id?: string;
  resolved: boolean;
  resolution_timestamp?: string;
  system_action_taken?: string;
};

export type SystemHealth = {
  overall_status: "optimal" | "good" | "fair" | "poor" | "critical";
  flame_integrity: number; // 0-100%
  oath_compliance: number; // 0-100%
  mercy_index: number; // 0-100%
  solar_alignment: number; // 0-100%
  corrupted_sessions: number;
  active_alerts: number;
  last_updated: string;
};

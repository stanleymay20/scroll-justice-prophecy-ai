
export type FlameIntegrityLevel = "pure" | "stable" | "wavering" | "compromised" | "critical";

export interface FlameIntegrityProps {
  userId?: string;
  petitionId?: string;
  sessionId?: string;
  compact?: boolean;
}

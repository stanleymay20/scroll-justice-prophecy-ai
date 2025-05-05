
import { useFlameIntegrity } from "./useFlameIntegrity";
import { CompactFlameIndicator } from "./CompactFlameIndicator";
import { FlameIntegrityCard } from "./FlameIntegrityCard";
import { FlameIntegrityProps } from "./types";

export function FlameIntegrityMonitor({ 
  userId, 
  petitionId,
  sessionId,
  compact = false 
}: FlameIntegrityProps) {
  const { flameScore, flameLevel, alerts, isLoading } = useFlameIntegrity(userId, petitionId, sessionId);
  
  // While loading, return minimal UI or null
  if (isLoading) {
    return compact ? null : <div className="animate-pulse h-24 bg-black/20 rounded-md"></div>;
  }
  
  if (compact) {
    return <CompactFlameIndicator flameLevel={flameLevel} alerts={alerts} />;
  }
  
  return <FlameIntegrityCard flameLevel={flameLevel} flameScore={flameScore} alerts={alerts} />;
}

// Re-export types and components for easier imports
export * from "./types";

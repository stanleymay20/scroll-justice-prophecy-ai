
import { Flame, AlertTriangle } from "lucide-react";
import { FlameIntegrityLevel } from "./types";
import { getFlameColor } from "./FlameColors";

interface CompactFlameIndicatorProps {
  flameLevel: FlameIntegrityLevel;
  alerts: number;
}

export function CompactFlameIndicator({ flameLevel, alerts }: CompactFlameIndicatorProps) {
  const flameColorClass = getFlameColor(flameLevel);
  
  return (
    <div className="flex items-center space-x-2">
      <Flame className={`h-4 w-4 ${flameColorClass}`} />
      <span className="text-sm">{flameLevel.charAt(0).toUpperCase() + flameLevel.slice(1)}</span>
      {alerts > 0 && (
        <div className="flex items-center text-xs bg-red-900/30 text-red-400 px-1.5 rounded-full">
          <AlertTriangle className="h-3 w-3 mr-0.5" />
          {alerts}
        </div>
      )}
    </div>
  );
}

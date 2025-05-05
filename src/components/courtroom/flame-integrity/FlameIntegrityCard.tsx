
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, ShieldAlert } from "lucide-react";
import { FlameIntegrityLevel } from "./types";
import { getFlameColor, getProgressColor } from "./FlameColors";

interface FlameIntegrityCardProps {
  flameLevel: FlameIntegrityLevel;
  flameScore: number;
  alerts: number;
}

export function FlameIntegrityCard({ flameLevel, flameScore, alerts }: FlameIntegrityCardProps) {
  const flameColorClass = getFlameColor(flameLevel);
  const progressColorClass = getProgressColor(flameLevel);
  
  return (
    <Card className="p-4 bg-black/30">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <Flame className={`h-5 w-5 ${flameColorClass}`} />
          <h3 className="text-sm font-medium text-white">Flame Integrity</h3>
        </div>
        
        {alerts > 0 && (
          <div className="flex items-center text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded-full">
            <ShieldAlert className="h-3 w-3 mr-1" />
            {alerts} {alerts === 1 ? 'Alert' : 'Alerts'}
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${flameColorClass}`}>
            {flameLevel.charAt(0).toUpperCase() + flameLevel.slice(1)}
          </span>
          <span className="text-sm">{flameScore}%</span>
        </div>
        
        <Progress 
          value={flameScore} 
          className="h-2 bg-muted" 
          indicatorClassName={progressColorClass}
        />
        
        {(flameLevel === "compromised" || flameLevel === "critical") && (
          <p className="text-xs text-muted-foreground">
            Warning: Flame integrity {flameLevel}. 
            {alerts > 0 ? ` ${alerts} integrity violations detected.` : ''}
          </p>
        )}
      </div>
    </Card>
  );
}


import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame } from "lucide-react";
import { FlameIntegrityLevel } from "@/types/mcp";
import { supabase } from "@/lib/supabase";

interface FlameIntegrityMonitorProps {
  sessionId: string;
  compact?: boolean;
}

export function FlameIntegrityMonitor({ sessionId, compact = false }: FlameIntegrityMonitorProps) {
  const [flameScore, setFlameScore] = useState(100);
  const [flameLevel, setFlameLevel] = useState<FlameIntegrityLevel>("pure");
  
  useEffect(() => {
    // Initial fetch
    fetchFlameIntegrity();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel(`flame-integrity-${sessionId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'court_sessions',
        filter: `id=eq.${sessionId}`
      }, (payload) => {
        if (payload.new && payload.new.flame_integrity_score !== undefined) {
          updateFlameData(payload.new.flame_integrity_score);
        }
      })
      .subscribe();
      
    // Poll every 10 seconds as a fallback
    const interval = setInterval(fetchFlameIntegrity, 10000);
    
    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [sessionId]);
  
  const fetchFlameIntegrity = async () => {
    try {
      const { data, error } = await supabase
        .from('court_sessions')
        .select('flame_integrity_score')
        .eq('id', sessionId)
        .single();
        
      if (error) throw error;
      
      if (data && data.flame_integrity_score !== null) {
        updateFlameData(data.flame_integrity_score);
      }
    } catch (error) {
      console.error("Error fetching flame integrity:", error);
    }
  };
  
  const updateFlameData = (score: number) => {
    setFlameScore(score);
    
    // Determine flame level based on score
    if (score >= 90) {
      setFlameLevel("pure");
    } else if (score >= 75) {
      setFlameLevel("stable");
    } else if (score >= 50) {
      setFlameLevel("wavering");
    } else if (score >= 25) {
      setFlameLevel("compromised");
    } else {
      setFlameLevel("critical");
    }
  };
  
  const getFlameColor = () => {
    switch (flameLevel) {
      case "pure": return "text-green-400";
      case "stable": return "text-emerald-400";
      case "wavering": return "text-yellow-400";
      case "compromised": return "text-orange-500";
      case "critical": return "text-red-500";
      default: return "text-justice-primary";
    }
  };
  
  const getProgressColor = () => {
    switch (flameLevel) {
      case "pure": return "bg-green-400";
      case "stable": return "bg-emerald-400";
      case "wavering": return "bg-yellow-400";
      case "compromised": return "bg-orange-500";
      case "critical": return "bg-red-500";
      default: return "bg-justice-primary";
    }
  };
  
  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <Flame className={`h-4 w-4 ${getFlameColor()}`} />
        <span className="text-sm">{flameLevel.charAt(0).toUpperCase() + flameLevel.slice(1)}</span>
      </div>
    );
  }
  
  return (
    <Card className="p-4">
      <div className="flex items-center space-x-3 mb-2">
        <Flame className={`h-5 w-5 ${getFlameColor()}`} />
        <h3 className="text-sm font-medium">Flame Integrity Monitor</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${getFlameColor()}`}>
            {flameLevel.charAt(0).toUpperCase() + flameLevel.slice(1)}
          </span>
          <span className="text-sm">{flameScore}%</span>
        </div>
        
        <Progress 
          value={flameScore} 
          className="h-2 bg-muted" 
          indicatorClassName={getProgressColor()}
        />
        
        {flameLevel === "compromised" || flameLevel === "critical" ? (
          <p className="text-xs text-muted-foreground">MCP alert: Flame integrity compromised. Consider resetting the session.</p>
        ) : null}
      </div>
    </Card>
  );
}

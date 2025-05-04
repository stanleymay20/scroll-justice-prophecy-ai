
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, AlertTriangle, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type FlameIntegrityLevel = "pure" | "stable" | "wavering" | "compromised" | "critical";

interface FlameIntegrityMonitorProps {
  userId?: string;
  petitionId?: string;
  compact?: boolean;
}

export function FlameIntegrityMonitor({ 
  userId, 
  petitionId, 
  compact = false 
}: FlameIntegrityMonitorProps) {
  const [flameScore, setFlameScore] = useState(100);
  const [flameLevel, setFlameLevel] = useState<FlameIntegrityLevel>("pure");
  const [alerts, setAlerts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchFlameIntegrity();
    
    // Set up a subscription for real-time updates if there's a petition ID
    let subscription: any;
    
    if (petitionId) {
      subscription = supabase
        .channel(`petition-integrity-${petitionId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'scroll_integrity_logs',
          filter: `petition_id=eq.${petitionId}`
        }, () => {
          fetchFlameIntegrity();
        })
        .subscribe();
    }
    
    // Poll every 30 seconds as a fallback
    const interval = setInterval(fetchFlameIntegrity, 30000);
    
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      clearInterval(interval);
    };
  }, [userId, petitionId]);
  
  const fetchFlameIntegrity = async () => {
    setIsLoading(true);
    let scoreValue = 100;
    
    try {
      // Check for alerts
      const alertQuery = supabase
        .from('scroll_integrity_logs')
        .select('*')
        .eq('flame_alert', true);
        
      // Add filters if applicable
      if (userId) {
        alertQuery.eq('user_id', userId);
      }
      if (petitionId) {
        alertQuery.eq('petition_id', petitionId);
      }
      
      const { data: alertData, error: alertError } = await alertQuery;
      
      if (alertError) throw alertError;
      
      const alertCount = alertData?.length || 0;
      setAlerts(alertCount);
      
      // Calculate aggregate impact
      const { data: impactData, error: impactError } = await supabase
        .rpc('calculate_integrity_score', {
          user_id_param: userId || null,
          petition_id_param: petitionId || null
        });
        
      if (!impactError && impactData) {
        scoreValue = Math.min(Math.max(impactData, 0), 100); // Clamp between 0 and 100
      } else {
        console.warn("Could not retrieve integrity score, using default", impactError);
      }
    } catch (error) {
      console.error("Error fetching flame integrity:", error);
    } finally {
      setIsLoading(false);
      updateFlameData(scoreValue);
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
        {alerts > 0 && (
          <div className="flex items-center text-xs bg-red-900/30 text-red-400 px-1.5 rounded-full">
            <AlertTriangle className="h-3 w-3 mr-0.5" />
            {alerts}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <Card className="p-4 bg-black/30">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <Flame className={`h-5 w-5 ${getFlameColor()}`} />
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

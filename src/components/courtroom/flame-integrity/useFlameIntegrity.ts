
import { useState, useEffect } from "react";
import { FlameIntegrityLevel } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const useFlameIntegrity = (
  userId?: string,
  petitionId?: string,
  sessionId?: string
) => {
  const [flameScore, setFlameScore] = useState(100);
  const [flameLevel, setFlameLevel] = useState<FlameIntegrityLevel>("pure");
  const [alerts, setAlerts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Update flame level based on score
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
  
  const fetchFlameIntegrity = async () => {
    setIsLoading(true);
    let scoreValue = 100;
    
    try {
      if (sessionId) {
        // If monitoring a court session
        const { data } = await supabase
          .from('court_sessions')
          .select('flame_integrity_score')
          .eq('id', sessionId)
          .single();
          
        if (data && typeof data.flame_integrity_score === 'number') {
          scoreValue = data.flame_integrity_score;
        }
      } else {
        // Check for alerts
        const alertQuery = supabase
          .from('scroll_integrity_logs')
          .select('*');
          
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
        
        // For petition monitoring, calculate the integrity score
        if (petitionId) {
          const { data: petitionData } = await supabase
            .from('scroll_petitions')
            .select('scroll_integrity_score')
            .eq('id', petitionId)
            .single();
            
          if (petitionData && petitionData.scroll_integrity_score !== null) {
            scoreValue = petitionData.scroll_integrity_score;
          }
        }
      }
    } catch (error) {
      console.error("Error fetching flame integrity:", error);
    } finally {
      setIsLoading(false);
      updateFlameData(scoreValue);
    }
  };
  
  useEffect(() => {
    fetchFlameIntegrity();
    
    // Set up a subscription for real-time updates
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
    } else if (sessionId) {
      subscription = supabase
        .channel(`flame-integrity-${sessionId}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'court_sessions',
          filter: `id=eq.${sessionId}`
        }, (payload) => {
          if (payload.new && typeof payload.new.flame_integrity_score === 'number') {
            updateFlameData(payload.new.flame_integrity_score);
          }
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
  }, [userId, petitionId, sessionId]);
  
  return {
    flameScore,
    flameLevel,
    alerts,
    isLoading
  };
};

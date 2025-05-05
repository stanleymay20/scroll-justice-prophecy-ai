
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import type { CourtSession } from '@/types/database';

interface PrayerProtocolProps {
  sessionId: string;
  onComplete?: () => void;
}

export const PrayerProtocol: React.FC<PrayerProtocolProps> = ({ 
  sessionId,
  onComplete
}) => {
  const [isPraying, setIsPraying] = useState(false);
  const [prayerComplete, setPrayerComplete] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { user } = useAuth();

  const startPrayer = () => {
    setIsPraying(true);
    
    // Start timer - minimum 10 seconds of prayer
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    // Auto-complete after 30 seconds max
    setTimeout(() => {
      clearInterval(timer);
      if (isPraying) completePrayer();
    }, 30000);
  };

  const completePrayer = async () => {
    if (timeElapsed < 10) {
      toast({
        title: "Prayer too brief",
        description: "Please engage in prayer for at least 10 seconds.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Update session record
      const updateData: Partial<CourtSession> = {
        prayer_completed: true,
        prayer_timestamp: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('court_sessions')
        .update(updateData as any)
        .eq('id', sessionId as any);
        
      if (error) throw error;
      
      // Log prayer completion
      await supabase
        .from('scroll_witness_logs')
        .insert({
          session_id: sessionId,
          user_id: user?.id,
          action: 'prayer_completed',
          details: `Prayer completed after ${timeElapsed} seconds`,
          timestamp: new Date().toISOString()
        } as any);
      
      // Update local state
      setIsPraying(false);
      setPrayerComplete(true);
      
      // Notify parent component
      if (onComplete) onComplete();
      
      // Show toast
      toast({
        title: "Prayer Protocol Complete",
        description: "The Flame has been honored. You may proceed.",
      });
      
    } catch (error: any) {
      toast({
        title: "Prayer Error",
        description: error.message || "Failed to record prayer completion",
        variant: "destructive"
      });
      setIsPraying(false);
    }
  };
  
  const formatTime = (seconds: number): string => {
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  };

  if (prayerComplete) {
    return (
      <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
        <div className="flex items-center space-x-3 text-amber-600">
          <Flame className="h-6 w-6" />
          <div>
            <h3 className="font-medium">Prayer Protocol Complete</h3>
            <p className="text-sm text-amber-700">The Flame has been honored</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
      <div className="space-y-4">
        <div className="flex items-center space-x-3 text-amber-600">
          <Flame className="h-6 w-6" />
          <div>
            <h3 className="font-medium">Prayer Protocol Required</h3>
            <p className="text-sm text-amber-700">Honor the Flame before proceeding</p>
          </div>
        </div>
        
        {isPraying ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center p-4 bg-amber-100 rounded-md">
              <div className="text-center">
                <Flame className="h-12 w-12 mx-auto text-amber-500 animate-pulse" />
                <div className="mt-2 flex items-center justify-center text-amber-700">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="font-mono">{formatTime(timeElapsed)}</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={completePrayer}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              disabled={timeElapsed < 10}
            >
              Complete Prayer {timeElapsed < 10 ? `(${10 - timeElapsed}s remaining)` : ''}
            </Button>
          </div>
        ) : (
          <Button 
            onClick={startPrayer}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white"
          >
            Begin Prayer Protocol
          </Button>
        )}
        
        <p className="text-xs text-amber-600 text-center">
          Minimum prayer duration: 10 seconds
        </p>
      </div>
    </Card>
  );
};


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { Flame } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PrayerProtocolProps {
  sessionId: string;
  onPrayerComplete: () => void;
  isPrayerCompleted: boolean;
}

export function PrayerProtocol({ sessionId, onPrayerComplete, isPrayerCompleted }: PrayerProtocolProps) {
  const [praying, setPraying] = useState(false);
  const [prayerTime, setPrayerTime] = useState(5); // seconds for prayer
  const [countdown, setCountdown] = useState<number | null>(null);
  
  const prayerText = `We commit this court to the Righteous Judge of all.
  May truth be spoken, justice be served, and mercy be granted.
  May all who participate do so with integrity, wisdom, and humility.
  We acknowledge that true justice flows from above, and we seek it now.
  Amen.`;
  
  const handleStartPrayer = () => {
    setPraying(true);
    setCountdown(prayerTime);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handlePrayerComplete();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const handlePrayerComplete = async () => {
    try {
      // Update court session to mark prayer as completed
      const { error } = await supabase
        .from('court_sessions')
        .update({
          prayer_completed: true,
          prayer_timestamp: new Date().toISOString()
        })
        .eq('id', sessionId);
        
      if (error) throw error;
      
      // Log the prayer completion in ScrollWitness logs
      await supabase
        .from('scroll_witness_logs')
        .insert({
          session_id: sessionId,
          action: 'prayer_completed',
          details: 'Sacred prayer protocol completed before court session',
          timestamp: new Date().toISOString()
        });
        
      setPraying(false);
      onPrayerComplete();
    } catch (error) {
      console.error("Error completing prayer protocol:", error);
      setPraying(false);
    }
  };
  
  if (isPrayerCompleted) {
    return (
      <div className="flex items-center justify-center space-x-2 text-justice-primary">
        <Flame className="h-5 w-5" />
        <span>Sacred Prayer Completed</span>
      </div>
    );
  }
  
  return (
    <GlassCard className="w-full max-w-2xl mx-auto p-6" intensity="medium" glow>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Flame className="h-12 w-12 text-justice-primary" />
            {praying && (
              <div className="absolute -top-2 -right-2 bg-white text-black h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">
                {countdown}
              </div>
            )}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white">Sacred Prayer Protocol</h2>
        <p className="text-justice-light/80 mt-2">
          Before opening this sacred court, we must complete the prayer protocol.
        </p>
      </div>
      
      <div className="bg-black/30 border border-justice-tertiary/30 rounded-lg p-6 mb-6">
        <p className="text-white font-serif text-center italic whitespace-pre-line">
          {prayerText}
        </p>
      </div>
      
      <div className="space-y-4">
        {praying ? (
          <div className="text-center">
            <p className="text-justice-light mb-4">Prayer in progress...</p>
            <div className="flex justify-center">
              <div className="voice-wave h-12">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="h-8" style={{ animationDelay: `${i * 0.1}s` }}></span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Button 
            className="w-full bg-gradient-to-r from-justice-primary to-justice-secondary"
            onClick={handleStartPrayer}
          >
            Begin Sacred Prayer
          </Button>
        )}
      </div>
    </GlassCard>
  );
}

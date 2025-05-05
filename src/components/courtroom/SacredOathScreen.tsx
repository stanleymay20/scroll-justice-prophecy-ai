
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollText, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from '@/integrations/supabase/client';
import { PulseEffect } from "@/components/advanced-ui/PulseEffect";
import { CourtSessionParticipantInsert, ScrollWitnessLogInsert } from "@/types/supabaseHelpers";

interface SacredOathScreenProps {
  userId: string;
  onComplete: () => void;
  onOathAccepted: () => void;
  onCancel: () => void;
  sessionId?: string;
}

export function SacredOathScreen({ userId, onComplete, onOathAccepted, onCancel, sessionId }: SacredOathScreenProps) {
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { t } = useLanguage();
  
  const oathText = "I solemnly affirm to seek justice with truth, mercy, and purity.";
  
  const handleSubmitOath = async () => {
    if (!agreed) return;
    
    setSubmitting(true);
    try {
      // Record the oath taking in user's profile or session participants
      if (sessionId) {
        // Create properly typed participant data
        const participantData: CourtSessionParticipantInsert = {
          session_id: sessionId,
          user_id: userId,
          oath_taken: true,
          oath_timestamp: new Date().toISOString(),
          role: 'witness'
        };

        await supabase
          .from('court_session_participants')
          .upsert([participantData]);
      }
        
      // Create properly typed log data
      const logData: ScrollWitnessLogInsert = {
        user_id: userId,
        session_id: sessionId,
        action: 'oath_taken',
        details: 'Sacred oath taken for court participation',
        timestamp: new Date().toISOString()
      };
      
      await supabase
        .from('scroll_witness_logs')
        .insert([logData]);
        
      // Store in localStorage to remember this user has taken the oath
      localStorage.setItem('scrollJustice-oath-taken', 'true');
      
      onOathAccepted();
      onComplete();
    } catch (error) {
      console.error("Error taking sacred oath:", error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-justice-dark to-black flex items-center justify-center p-4 z-50">
      <GlassCard className="w-full max-w-2xl mx-auto p-6" glow>
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <ScrollText className="h-12 w-12 text-justice-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white">{t('oath.title')}</h2>
          <p className="text-justice-light/80 mt-2">
            Before participating in this sacred court, you must take an oath to uphold justice and speak truth.
          </p>
        </div>
        
        <div className="bg-black/30 border border-justice-tertiary/30 rounded-lg p-6 mb-6">
          <p className="text-white font-serif text-center text-xl">
            {oathText}
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="oath-agreement" 
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(!!checked)}
            />
            <label 
              htmlFor="oath-agreement" 
              className="text-sm text-justice-light cursor-pointer"
            >
              I solemnly affirm this sacred oath and will abide by its principles
            </label>
          </div>
          
          <div className="flex space-x-4">
            <Button 
              className="w-full relative"
              disabled={!agreed || submitting}
              onClick={handleSubmitOath}
            >
              {submitting ? "Processing..." : t('oath.confirm')}
              {agreed && !submitting && (
                <div className="absolute -top-1 -right-1">
                  <PulseEffect color="bg-justice-primary" />
                </div>
              )}
            </Button>
            
            <Button 
              variant="outline"
              className="w-1/3"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

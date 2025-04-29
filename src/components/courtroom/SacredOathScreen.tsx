
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollText, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";

interface SacredOathScreenProps {
  userId: string;
  onComplete: () => void;
  sessionId?: string;
}

export function SacredOathScreen({ userId, onComplete, sessionId }: SacredOathScreenProps) {
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { t } = useLanguage();
  
  const oathText = `I solemnly swear to uphold the principles of truth and justice in this sacred proceeding.
  I will speak with integrity and honor, seeking only what is right and just.
  I will show respect to all witnesses, advocates, and participants.
  I will not knowingly speak falsehood or distort truth.
  I acknowledge that this oath is sacred and binds me to the principles of justice in this court.`;
  
  const handleSubmitOath = async () => {
    if (!agreed) return;
    
    setSubmitting(true);
    try {
      // Record the oath taking in user's profile or session participants
      if (sessionId) {
        await supabase
          .from('court_session_participants')
          .upsert({
            session_id: sessionId,
            user_id: userId,
            oath_taken: true,
            oath_timestamp: new Date().toISOString()
          });
      }
        
      // Log the oath in ScrollWitness logs
      await supabase
        .from('scroll_witness_logs')
        .insert({
          user_id: userId,
          session_id: sessionId,
          action: 'oath_taken',
          details: 'Sacred oath taken for court participation',
          timestamp: new Date().toISOString()
        });
        
      // Store in localStorage to remember this user has taken the oath
      localStorage.setItem('scrollJustice-oath-taken', 'true');
      
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
          <p className="text-white font-serif whitespace-pre-line">
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
          
          <Button 
            className="w-full"
            disabled={!agreed || submitting}
            onClick={handleSubmitOath}
          >
            {submitting ? "Processing..." : t('oath.confirm')}
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}

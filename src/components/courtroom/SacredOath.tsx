
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/advanced-ui/GlassCard";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollText, Shield } from "lucide-react";
import { OathStatus } from "@/types/courtroom";
import { supabase } from "@/integrations/supabase/client";
import { CourtSessionParticipantUpdate, ScrollWitnessLogInsert } from "@/types/supabaseHelpers";

interface SacredOathProps {
  sessionId: string;
  userId: string;
  onOathComplete: () => void;
  oathStatus: OathStatus;
}

export function SacredOath({ sessionId, userId, onOathComplete, oathStatus }: SacredOathProps) {
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const oathText = `I solemnly swear to uphold the principles of truth and justice in this sacred proceeding.
  I will speak with integrity and honor, seeking only what is right and just.
  I will show respect to all witnesses, advocates, and participants.
  I will not knowingly speak falsehood or distort truth.
  I acknowledge that this oath is sacred and binds me to the principles of justice in this court.`;
  
  const handleSubmitOath = async () => {
    if (!agreed) return;
    
    setSubmitting(true);
    try {
      // Create properly typed update data
      const updateData: CourtSessionParticipantUpdate = {
        oath_taken: true,
        oath_timestamp: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('court_session_participants')
        .update(updateData)
        .eq('session_id', sessionId)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      // Create properly typed log data
      const logData: ScrollWitnessLogInsert = {
        session_id: sessionId,
        user_id: userId,
        action: 'oath_taken',
        details: 'Sacred oath taken for court participation',
        timestamp: new Date().toISOString()
      };
      
      await supabase
        .from('scroll_witness_logs')
        .insert(logData);
        
      onOathComplete();
    } catch (error) {
      console.error("Error taking sacred oath:", error);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (oathStatus === "completed") {
    return (
      <div className="flex items-center justify-center space-x-2 text-green-400">
        <Shield className="h-5 w-5" />
        <span>Sacred Oath Taken</span>
      </div>
    );
  }
  
  return (
    <GlassCard className="w-full max-w-2xl mx-auto p-6" glow>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <ScrollText className="h-12 w-12 text-justice-primary" />
        </div>
        <h2 className="text-2xl font-bold text-white">Sacred Oath Required</h2>
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
          {submitting ? "Processing..." : "Take Sacred Oath"}
        </Button>
      </div>
    </GlassCard>
  );
}

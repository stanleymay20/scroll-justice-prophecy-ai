
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language";

interface UseVerdictSubmissionProps {
  petitionId: string;
  onVerdictSubmitted: () => void;
}

export const useVerdictSubmission = ({
  petitionId,
  onVerdictSubmitted
}: UseVerdictSubmissionProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const submitVerdict = async (approved: boolean, reasoning: string) => {
    if (!reasoning) {
      toast({
        title: t("verdict.missingReasoning"),
        description: t("verdict.provideReasoning"),
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const verdictText = approved ? "APPROVED" : "REJECTED";
      
      const { error } = await supabase
        .from('scroll_petitions')
        .update({
          verdict: verdictText,
          verdict_reasoning: reasoning,
          verdict_timestamp: new Date().toISOString(),
          status: approved ? 'resolved' : 'rejected'
        })
        .eq('id', petitionId);
      
      if (error) throw error;
      
      // Log the verdict in scroll_integrity_logs
      await supabase
        .from('scroll_integrity_logs')
        .insert([{
          action_type: approved ? 'VERDICT_APPROVED' : 'VERDICT_REJECTED',
          integrity_impact: approved ? 10 : -5,
          description: `Verdict delivered: ${verdictText}`,
          petition_id: petitionId,
        }]);
      
      toast({
        title: t(`verdict.${approved ? 'approved' : 'rejected'}`),
        description: t("verdict.recorded"),
      });
      
      onVerdictSubmitted();
    } catch (err) {
      console.error("Error submitting verdict:", err);
      setError(t("verdict.submissionError") + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    error,
    submitVerdict,
    setError
  };
};


import { useState } from "react";
import { getAiSuggestedVerdict } from "@/services/integrityService";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logAIInteraction } from "@/services/aiAuditService";
import { useLanguage } from "@/contexts/language";

interface UseAiSuggestionProps {
  petitionId: string;
  petitionTitle: string;
  aiConsent: boolean;
  setReasoning: (reasoning: string) => void;
  setError: (error: string | null) => void;
}

export const useAiSuggestion = ({
  petitionId,
  petitionTitle,
  aiConsent,
  setReasoning,
  setError
}: UseAiSuggestionProps) => {
  const [suggestingVerdict, setSuggestingVerdict] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const getAiSuggestion = async () => {
    if (!aiConsent) {
      toast({
        title: t("verdict.aiConsentRequired"),
        description: t("verdict.enableAiConsent"),
        variant: "destructive"
      });
      return;
    }

    setSuggestingVerdict(true);
    setError(null);
    
    try {
      const aiVerdict = await getAiSuggestedVerdict(petitionId);
      
      if (aiVerdict) {
        toast({
          title: t("verdict.aiSuggested"),
          description: t("verdict.aiConsideredCase"),
        });
        
        // Update database with AI suggestion
        await supabase
          .from('scroll_petitions')
          .update({ ai_suggested_verdict: aiVerdict })
          .eq('id', petitionId);
          
        // Set the reasoning field with a default reasoning
        setReasoning("AI-suggested verdict based on available evidence and precedents.");

        // Log the AI interaction
        await logAIInteraction({
          action_type: "VERDICT_SUGGESTION",
          ai_model: "scroll-verdict-assistant-1.0",
          input_summary: `Petition title: ${petitionTitle.substring(0, 50)}...`,
          output_summary: `AI verdict suggested: ${aiVerdict.substring(0, 50)}...`
        });
      } else {
        setError(t("verdict.aiSuggestionFailed"));
      }
    } catch (err) {
      console.error("Error getting AI verdict:", err);
      setError(t("verdict.aiError") + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSuggestingVerdict(false);
    }
  };
  
  return {
    suggestingVerdict,
    getAiSuggestion
  };
};

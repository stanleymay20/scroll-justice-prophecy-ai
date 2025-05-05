
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logAIInteraction } from "@/services/aiAuditService";

interface UseAiSuggestionProps {
  petitionId: string;
  petitionTitle: string;
  aiConsent: boolean;
  setReasoning: (reasoning: string) => void;
  setError: (error: string | null) => void;
}

export function useAiSuggestion({
  petitionId,
  petitionTitle,
  aiConsent,
  setReasoning,
  setError
}: UseAiSuggestionProps) {
  const [suggestingVerdict, setSuggestingVerdict] = useState(false);

  const getAiSuggestion = async () => {
    if (!aiConsent) {
      setError("You must enable AI assistance to get a suggested verdict");
      return;
    }

    if (!petitionId) {
      setError("No petition selected");
      return;
    }

    try {
      setSuggestingVerdict(true);
      setError(null);

      // Call the Supabase edge function to get AI verdict suggestion
      const { data, error } = await supabase.functions.invoke('get-ai-verdict', {
        body: { petitionId }
      });

      if (error) throw error;

      if (data?.reasoning) {
        setReasoning(data.reasoning);
        
        // Log this AI interaction
        await logAIInteraction({
          action_type: "AI_VERDICT_SUGGESTION",
          ai_model: "gpt-3.5-turbo",
          input_summary: `Generated verdict suggestion for petition: ${petitionTitle.substring(0, 50)}...`,
          output_summary: `Verdict reasoning (${data.reasoning.length} chars) was provided to the judge`,
        });
      } else {
        throw new Error("No verdict suggestion returned");
      }
    } catch (error) {
      console.error("Error getting AI suggestion:", error);
      setError("Failed to get AI verdict suggestion. Please try again.");
    } finally {
      setSuggestingVerdict(false);
    }
  };

  return {
    suggestingVerdict,
    getAiSuggestion
  };
}

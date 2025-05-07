
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/language";
import { supabase } from "@/integrations/supabase/client";

export interface AiSuggestionButtonProps {
  petitionId: string;
  setVerdict: (verdict: string) => void;
  setReasoning: (reasoning: string) => void;
}

export const AiSuggestionButton: React.FC<AiSuggestionButtonProps> = ({ 
  petitionId, 
  setVerdict, 
  setReasoning 
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchAiSuggestion = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("get-ai-verdict", {
        body: { petitionId }
      });
      
      if (error) throw error;
      
      if (data?.verdict && data?.reasoning) {
        setVerdict(data.verdict);
        setReasoning(data.reasoning);
        
        toast({
          title: t("ai.suggestionReceived"),
          description: t("ai.suggestionApplied"),
        });
      }
    } catch (error) {
      console.error("Error getting AI verdict suggestion:", error);
      toast({
        title: t("ai.suggestionFailed"),
        description: t("ai.tryAgain"),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isLoading}
      onClick={fetchAiSuggestion}
      className="flex items-center gap-1"
    >
      <Sparkles className="h-4 w-4" />
      {isLoading ? t("ai.generating") : t("ai.suggestVerdict")}
    </Button>
  );
};

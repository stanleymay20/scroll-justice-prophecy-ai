
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/language";

interface AiSuggestionButtonProps {
  onGetSuggestion: () => Promise<void>;
  disabled: boolean;
}

export const AiSuggestionButton = ({ 
  onGetSuggestion, 
  disabled 
}: AiSuggestionButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  
  const handleClick = async () => {
    setLoading(true);
    try {
      await onGetSuggestion();
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={loading || disabled}
      className="flex-1"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("verdict.consultingAi")}
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" /> {t("verdict.getAiSuggestion")}
        </>
      )}
    </Button>
  );
};

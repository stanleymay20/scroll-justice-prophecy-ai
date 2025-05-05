
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AIConsentToggle } from "@/components/compliance/AIConsentToggle";
import { ReasoningField } from "./ReasoningField";
import { AiSuggestionButton } from "./AiSuggestionButton";
import { VerdictButtons } from "./VerdictButtons";
import { useVerdictSubmission } from "./useVerdictSubmission";
import { useAiSuggestion } from "./useAiSuggestion";
import { useLanguage } from "@/contexts/language";

interface VerdictFormProps {
  petitionId: string;
  petitionTitle: string;
  petitionDescription: string;
  onVerdictSubmitted: () => void;
}

export const VerdictForm = ({
  petitionId,
  petitionTitle,
  petitionDescription,
  onVerdictSubmitted
}: VerdictFormProps) => {
  const [verdict, setVerdict] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [aiConsent, setAiConsent] = useState(true);
  const { t } = useLanguage();

  const {
    loading,
    error,
    submitVerdict,
    setError
  } = useVerdictSubmission({
    petitionId,
    onVerdictSubmitted
  });

  const {
    suggestingVerdict,
    getAiSuggestion
  } = useAiSuggestion({
    petitionId,
    petitionTitle,
    aiConsent,
    setReasoning,
    setError
  });

  const handleSubmitVerdict = (approved: boolean) => {
    submitVerdict(approved, reasoning);
  };

  return (
    <div className="space-y-4 bg-black/20 p-4 rounded-lg border border-justice-primary/30">
      <h3 className="text-lg font-medium text-white">{t("verdict.sacred")}</h3>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <ReasoningField 
          value={reasoning} 
          onChange={setReasoning} 
        />
        
        <AIConsentToggle 
          userRole="judge"
          onConsentChange={setAiConsent}
        />
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <AiSuggestionButton 
            onGetSuggestion={getAiSuggestion}
            disabled={!aiConsent}
          />
        </div>
        
        <VerdictButtons 
          onApprove={() => handleSubmitVerdict(true)}
          onReject={() => handleSubmitVerdict(false)}
          disabled={!reasoning}
          loading={loading}
        />
      </div>
    </div>
  );
};


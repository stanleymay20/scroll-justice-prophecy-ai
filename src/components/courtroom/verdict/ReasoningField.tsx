
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/language";

export interface ReasoningFieldProps {
  reasoning: string;
  setReasoning: (reasoning: string) => void;
}

export const ReasoningField: React.FC<ReasoningFieldProps> = ({ reasoning, setReasoning }) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-1">
      <Label htmlFor="reasoning">{t("verdict.reasoning")}</Label>
      <Textarea
        id="reasoning"
        value={reasoning}
        onChange={(e) => setReasoning(e.target.value)}
        placeholder={t("verdict.reasoningPlaceholder")}
        className="h-32"
      />
    </div>
  );
};

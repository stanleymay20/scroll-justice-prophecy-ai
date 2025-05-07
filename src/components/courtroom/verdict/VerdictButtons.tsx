
import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language";

export interface VerdictButtonsProps {
  selectedVerdict: string;
  onVerdictSelect: (verdict: string) => void;
}

export const VerdictButtons: React.FC<VerdictButtonsProps> = ({ selectedVerdict, onVerdictSelect }) => {
  const { t } = useLanguage();
  
  const verdictOptions = [
    { value: "Approved", label: t("verdict.approved"), color: "bg-green-600 hover:bg-green-700" },
    { value: "Denied", label: t("verdict.denied"), color: "bg-red-600 hover:bg-red-700" },
    { value: "Conditional Approval", label: t("verdict.conditional"), color: "bg-yellow-600 hover:bg-yellow-700" }
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {verdictOptions.map((option) => (
        <Button
          key={option.value}
          type="button"
          onClick={() => onVerdictSelect(option.value)}
          className={`${selectedVerdict === option.value ? option.color : 'bg-gray-600 hover:bg-gray-700'}`}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};

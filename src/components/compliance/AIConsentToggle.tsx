
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { useLanguage } from "@/contexts/language";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface AIConsentToggleProps {
  userRole: "judge" | "petitioner" | string;
  defaultChecked?: boolean;
  onConsentChange: (consented: boolean) => void;
  disabled?: boolean;
}

export const AIConsentToggle = ({
  userRole,
  defaultChecked = true,
  onConsentChange,
  disabled = false
}: AIConsentToggleProps) => {
  const { t } = useLanguage();
  const [checked, setChecked] = useState(defaultChecked);
  
  useEffect(() => {
    // Load saved preference if available
    const savedPreference = localStorage.getItem(`ai-consent-${userRole}`);
    if (savedPreference !== null) {
      setChecked(savedPreference === "true");
    }
  }, [userRole]);
  
  const handleChange = (checked: boolean) => {
    setChecked(checked);
    localStorage.setItem(`ai-consent-${userRole}`, checked.toString());
    onConsentChange(checked);
  };
  
  const getConsentText = () => {
    switch (userRole) {
      case "judge":
        return t("ai.consent.judge");
      case "petitioner":
        return t("ai.consent.petitioner");
      default:
        return t("ai.consent.general");
    }
  };
  
  const getTooltipText = () => {
    switch (userRole) {
      case "judge":
        return t("ai.consent.judgeTooltip");
      case "petitioner":
        return t("ai.consent.petitionerTooltip");
      default:
        return t("ai.consent.generalTooltip");
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id={`ai-consent-${userRole}`} 
          checked={checked} 
          onCheckedChange={handleChange} 
          disabled={disabled}
        />
        <Label 
          htmlFor={`ai-consent-${userRole}`}
          className="text-sm text-justice-light cursor-pointer"
        >
          {getConsentText()}
        </Label>
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-justice-light/70 cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs text-sm">{getTooltipText()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

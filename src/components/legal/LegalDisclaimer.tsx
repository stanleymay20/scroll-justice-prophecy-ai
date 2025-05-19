
import React from "react";
import { useLanguage } from "@/contexts/language";

interface LegalDisclaimerProps {
  variant?: "full" | "compact";
  className?: string;
}

export const LegalDisclaimer = ({ 
  variant = "compact",
  className = ""
}: LegalDisclaimerProps) => {
  const { t } = useLanguage();
  
  return (
    <div className={`text-xs text-justice-light/70 ${className}`}>
      {variant === "full" ? (
        <p>
          {t("legal.disclaimer.full", 
            "ScrollJustice.AI is an AI-assisted tool. It does not offer legal advice and may not reflect real case outcomes unless cited. Use responsibly."
          )}
        </p>
      ) : (
        <p>
          {t("legal.disclaimer.compact", 
            "For illustration only. Not a substitute for legal advice."
          )}
        </p>
      )}
    </div>
  );
};

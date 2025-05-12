
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/language";
import { LanguageCode } from "@/contexts/language";
import { getLanguageDisplayName, getSupportedLanguages } from "@/utils/languageUtils";

interface PreferenceLanguageSelectProps {
  onLanguageChange?: (language: LanguageCode) => void;
  className?: string;
  disabled?: boolean;
}

export function PreferenceLanguageSelect({
  onLanguageChange,
  className = "",
  disabled = false
}: PreferenceLanguageSelectProps) {
  const { language, setLanguage, t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(language || "en");
  
  // Update internal state when language context changes
  useEffect(() => {
    if (language) {
      setSelectedLanguage(language);
    }
  }, [language]);
  
  const handleValueChange = (value: string) => {
    try {
      if (!value) return;
      
      const langCode = value as LanguageCode;
      setSelectedLanguage(langCode);
      
      // Call the context setter
      setLanguage(langCode);
      
      // Call the prop handler if provided
      if (onLanguageChange) {
        onLanguageChange(langCode);
      }
      
      console.log(`Language preference changed to: ${langCode}`);
    } catch (error) {
      console.error("Error changing language preference:", error);
    }
  };

  const supportedLanguages = getSupportedLanguages();
  
  // Safely translate with fallback
  const getLanguageSelectLabel = () => {
    try {
      const translated = t("language.select");
      return translated === "language.select" ? "Select Language" : translated;
    } catch (error) {
      return "Select Language";
    }
  };
  
  return (
    <Select
      value={selectedLanguage || "en"}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger className={`w-full ${className}`}>
        <SelectValue placeholder={getLanguageSelectLabel()} />
      </SelectTrigger>
      <SelectContent className="max-h-[300px] overflow-y-auto z-50">
        {Array.isArray(supportedLanguages) && supportedLanguages.map((code) => (
          <SelectItem key={code} value={code}>
            {getLanguageDisplayName(code)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

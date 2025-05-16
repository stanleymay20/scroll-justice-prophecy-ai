
import React, { useState } from "react";
import { useLanguage } from "@/contexts/language";
import { LanguageCode } from "@/contexts/language/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LANGUAGE_OPTIONS: Record<LanguageCode, { label: string, flag: string }> = {
  "en": { label: "English", flag: "🇺🇸" },
  "fr": { label: "Français", flag: "🇫🇷" },
  "es": { label: "Español", flag: "🇪🇸" },
  "de": { label: "Deutsch", flag: "🇩🇪" },
  "zh": { label: "中文", flag: "🇨🇳" },
  "ar": { label: "العربية", flag: "🇸🇦" },
  "hi": { label: "हिन्दी", flag: "🇮🇳" },
  "pt": { label: "Português", flag: "🇧🇷" },
  "he": { label: "עברית", flag: "🇮🇱" },
  "sw": { label: "Kiswahili", flag: "🇰🇪" },
  "am": { label: "አማርኛ", flag: "🇪🇹" }
};

export function LanguageSelect() {
  const { language, setLanguage } = useLanguage();
  
  const handleValueChange = (value: string) => {
    setLanguage(value as LanguageCode);
  };

  return (
    <Select value={language} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select language">
          <span className="flex items-center">
            {LANGUAGE_OPTIONS[language].flag} {LANGUAGE_OPTIONS[language].label}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.entries(LANGUAGE_OPTIONS).map(([code, { label, flag }]) => (
            <SelectItem key={code} value={code}>
              <div className="flex items-center gap-2">
                <span>{flag}</span>
                <span>{label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

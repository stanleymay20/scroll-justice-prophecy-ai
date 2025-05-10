
import React from "react";
import { DropdownMenuGroup, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { LanguageOption } from "./LanguageOption";
import { LanguageCode } from "@/contexts/language";

export interface LanguageItem {
  code: LanguageCode;
  name: string;
  flag: string;
  group: string;
}

interface LanguageGroupProps {
  title: string;
  languages: LanguageItem[];
  currentLanguage: LanguageCode;
  onLanguageSelect: (code: LanguageCode) => void;
}

export function LanguageGroup({ title, languages, currentLanguage, onLanguageSelect }: LanguageGroupProps) {
  if (languages.length === 0) return null;
  
  return (
    <>
      <DropdownMenuLabel className="text-justice-light/70">
        {title}
      </DropdownMenuLabel>
      
      <DropdownMenuGroup>
        {languages.map(lang => (
          <LanguageOption
            key={lang.code}
            code={lang.code}
            name={lang.name}
            flag={lang.flag}
            isSelected={currentLanguage === lang.code}
            onSelect={onLanguageSelect}
          />
        ))}
      </DropdownMenuGroup>
    </>
  );
}
